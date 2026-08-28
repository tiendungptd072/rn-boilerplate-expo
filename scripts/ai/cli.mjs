#!/usr/bin/env bun
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertInsideProject, classifyTask, commandExists, formatRoute, git, loadConfig, projectRoot } from './lib.mjs';

const [command, ...args] = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const integerAfter = (flag, fallback, max) => Math.max(1, Math.min(Number.parseInt(valueAfter(flag) ?? '', 10) || fallback, max));

function taskText() {
  return args.filter((value, index) => !value.startsWith('--') && (index === 0 || !args[index - 1]?.startsWith('--'))).join(' ').trim();
}

function route() {
  const result = classifyTask(taskText());
  if (args.includes('--json')) console.log(JSON.stringify(result, null, 2));
  else console.log(formatRoute(result));
}

function search() {
  const pattern = args[0];
  if (!pattern) throw new Error('Usage: ai:search -- <pattern> [path] [--limit N]');
  const target = args[1]?.startsWith('--') || !args[1] ? '.' : args[1];
  const limit = integerAfter('--limit', 50, 500);
  const result = boundedSearch(pattern, target, { limit });
  console.log(result.lines.join('\n'));
  if (result.truncated) console.log(`[truncated: ${result.truncated} more matches; use --limit to expand]`);
}

export function boundedSearch(pattern, target = '.', options = {}) {
  const root = options.root ?? projectRoot;
  if (!options.execute && !commandExists('rg')) throw new Error('ai:search requires ripgrep (rg).');
  assertInsideProject(target, root);
  const limit = Math.min(options.limit ?? 50, 500);
  const execute = options.execute ?? ((command, commandArgs, commandOptions) => spawnSync(command, commandArgs, commandOptions));
  const result = execute('rg', ['--line-number', '--color', 'never', '--glob', '!bun.lock', '--glob', '!ios/**', '--glob', '!android/**', pattern, target], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0 && result.status !== 1) throw new Error(result.stderr.trim() || 'Search failed.');
  const lines = result.stdout.trimEnd().split('\n').filter(Boolean);
  return { lines: lines.slice(0, limit), truncated: Math.max(0, lines.length - limit) };
}

export function boundedRead(file, options = {}) {
  const root = options.root ?? projectRoot;
  const absolute = assertInsideProject(file, root);
  const lines = readFileSync(absolute, 'utf8').split('\n');
  const maximum = Math.min(options.max ?? 160, 500);
  let start = 1;
  let end = Math.min(lines.length, maximum);
  if (options.range) {
    const match = /^(\d+):(\d+)$/.exec(options.range);
    if (!match) throw new Error('--lines must use START:END.');
    start = Number(match[1]);
    end = Math.min(Number(match[2]), start + maximum - 1);
  } else if (options.around) {
    const index = lines.findIndex((line) => line.includes(options.around));
    if (index < 0) throw new Error(`Text not found: ${options.around}`);
    const context = Math.min(options.context ?? 20, 100);
    start = Math.max(1, index + 1 - context);
    end = Math.min(lines.length, index + 1 + context);
  }
  return lines.slice(start - 1, end).map((line, index) => `${String(start + index).padStart(5)}  ${line}`).join('\n');
}

function read() {
  const file = args[0];
  if (!file) throw new Error('Usage: ai:read -- <file> [--lines START:END | --around TEXT]');
  console.log(boundedRead(file, {
    range: valueAfter('--lines'), around: valueAfter('--around'),
    context: integerAfter('--context', 20, 100), max: integerAfter('--max', 160, 500)
  }));
}

function diff() {
  const separator = args.indexOf('--');
  const paths = separator >= 0 ? args.slice(separator + 1) : [];
  const gitArgs = args.includes('--full') ? ['diff', '--'] : ['diff', '--stat', '--'];
  console.log(git([...gitArgs, ...paths]));
}

function log() {
  const limit = integerAfter('--limit', 8, 50);
  console.log(boundedLog({ limit }));
}

export function boundedLog(options = {}) {
  const root = options.root ?? projectRoot;
  const limit = Math.min(options.limit ?? 8, 50);
  const output = options.execute
    ? options.execute(limit)
    : git(['log', `-${limit}`, '--oneline', '--decorate'], { cwd: root });
  return output.split('\n').filter(Boolean).slice(0, limit).join('\n');
}

function checkpoint() {
  const path = resolve(projectRoot, '.ai/state/current-task.md');
  if (!existsSync(path)) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, '# Current task\n\n## Goal\n\n## Current hypothesis\n\n## Confirmed facts\n\n## Files inspected\n\n## Files changed\n\n## Decisions\n\n## Verification completed\n\n## Remaining work\n\n## Known risks\n\n## Do not reopen unless necessary\n', 'utf8');
  }
  console.log(relative(projectRoot, path));
}

function clearCheckpoint() {
  rmSync(resolve(projectRoot, '.ai/state/current-task.md'), { force: true });
  console.log('Checkpoint cleared.');
}

export function doctor(root = projectRoot) {
  const errors = [];
  const warnings = [];
  let config;
  try { config = loadConfig(root); } catch (error) { errors.push(`invalid config/ai-flow.json: ${error.message}`); }
  const required = ['AGENTS.md', 'CLAUDE.md', 'package.json', 'template.version.json'];
  for (const file of required) if (!existsSync(resolve(root, file))) errors.push(`missing ${file}`);
  if (existsSync(resolve(root, 'CLAUDE.md')) && readFileSync(resolve(root, 'CLAUDE.md'), 'utf8').trim() !== '@AGENTS.md') {
    errors.push('CLAUDE.md must contain only @AGENTS.md');
  }
  if (config) {
    for (const [owner, file] of Object.entries(config.owners)) {
      if (!existsSync(resolve(root, file))) errors.push(`missing owner doc for ${owner}: ${file}`);
    }
    for (const tier of ['FAST', 'BALANCED', 'DEEP', 'CRITICAL']) {
      if (!config.models[tier]?.codex || !config.models[tier]?.reasoning) errors.push(`invalid model tier ${tier}`);
    }
  }
  for (const skill of ['rn-feature', 'bug-fix', 'api-integration', 'code-review', 'refactor', 'dependency-upgrade', 'performance', 'ui-component', 'git-finish']) {
    if (!existsSync(resolve(root, `.agents/skills/${skill}/SKILL.md`))) errors.push(`missing skill ${skill}`);
  }
  if (existsSync(resolve(root, 'package.json')) && existsSync(resolve(root, 'template.version.json'))) {
    const packageVersion = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).version;
    const templateVersion = JSON.parse(readFileSync(resolve(root, 'template.version.json'), 'utf8')).version;
    if (packageVersion !== templateVersion) errors.push(`version mismatch: package ${packageVersion}, template ${templateVersion}`);
  }
  const markdown = [];
  const collect = (directory) => {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) collect(path);
      else if (entry.name.endsWith('.md')) markdown.push(path);
    }
  };
  collect(resolve(root, 'docs'));
  markdown.push(resolve(root, 'README.md'), resolve(root, 'AGENTS.md'));
  for (const file of markdown.filter(existsSync)) {
    const content = readFileSync(file, 'utf8');
    for (const match of content.matchAll(/\[[^\]]+\]\((?!https?:|#)([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (target && !existsSync(resolve(dirname(file), target))) errors.push(`broken link in ${relative(root, file)}: ${match[1]}`);
    }
  }
  for (const tool of ['bun', 'codex', 'claude', 'caveman']) if (!commandExists(tool)) warnings.push(`${tool} not installed (optional here)`);
  return { errors, warnings };
}

function runDoctor() {
  const result = doctor();
  result.warnings.forEach((warning) => console.log(`WARN  ${warning}`));
  result.errors.forEach((error) => console.error(`ERROR ${error}`));
  if (result.errors.length) process.exitCode = 1;
  else console.log('AI Flow configuration is valid.');
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  try {
    if (command === 'gate' || command === 'route') route();
    else if (command === 'search') search();
    else if (command === 'read') read();
    else if (command === 'diff') diff();
    else if (command === 'log') log();
    else if (command === 'checkpoint') checkpoint();
    else if (command === 'checkpoint-clear') clearCheckpoint();
    else if (command === 'doctor') runDoctor();
    else throw new Error('Commands: gate, route, doctor, search, read, diff, log, checkpoint, checkpoint-clear');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

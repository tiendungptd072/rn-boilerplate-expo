#!/usr/bin/env bun
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyTask, loadConfig, projectRoot, runProcessSync } from './ai/lib.mjs';

export const conventionalCommitPattern = /^(feat|fix|refactor|perf|docs|test|build|ci|chore|revert)(\([a-z0-9][a-z0-9._/-]*\))?!?: .{1,72}$/;

export function validateCommitMessage(message) {
  if (!conventionalCommitPattern.test(message.trim())) {
    throw new Error('Commit must use Conventional Commits, for example: fix(auth): serialize refresh.');
  }
}

const secretPatterns = [
  { name: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'OpenAI key', pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/ },
  { name: 'AWS access key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'hard-coded bearer token', pattern: /authorization\s*[:=]\s*["']Bearer\s+[A-Za-z0-9._-]{16,}["']/i }
];

export function findSecrets(files, root = projectRoot) {
  const findings = [];
  const expand = (file) => {
    const absolute = resolve(root, file);
    if (!existsSync(absolute) || !statSync(absolute).isDirectory()) return [file];
    return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) =>
      expand(`${file}/${entry.name}`)
    );
  };

  for (const file of files.flatMap(expand)) {
    const absolute = resolve(root, file);
    if (!existsSync(absolute)) continue;
    const content = readFileSync(absolute);
    if (content.includes(0)) continue;
    const text = content.toString('utf8');
    for (const rule of secretPatterns) if (rule.pattern.test(text)) findings.push(`${file}: ${rule.name}`);
  }
  return findings;
}

function runGit(args, root = projectRoot, stdio = 'pipe') {
  const result = runProcessSync('git', args, { cwd: root, stdio });
  if (result.status !== 0) throw new Error(result.stderr?.trim() || `git ${args[0]} failed`);
  return result.stdout?.trim() ?? '';
}

function gitDirectory(root) {
  const marker = resolve(root, '.git');
  if (statSync(marker).isDirectory()) return marker;
  const content = readFileSync(marker, 'utf8').trim();
  if (!content.startsWith('gitdir: ')) throw new Error(`Invalid Git marker: ${marker}`);
  return resolve(dirname(marker), content.slice('gitdir: '.length));
}

export function currentBranch(root = projectRoot) {
  const head = readFileSync(resolve(gitDirectory(root), 'HEAD'), 'utf8').trim();
  return head.startsWith('ref: refs/heads/') ? head.slice('ref: refs/heads/'.length) : '';
}

export function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'task';
}

function branchPrefix(type) {
  return ({
    feature: 'feat', bugfix: 'fix', refactor: 'refactor', performance: 'perf',
    documentation: 'docs', release: 'chore', 'dependency-upgrade': 'chore', maintenance: 'chore'
  })[type] ?? 'chore';
}

export function assertCanPush(branch, config = loadConfig()) {
  if (config.protectedBranches.includes(branch)) throw new Error(`Refusing direct push to protected branch: ${branch}`);
}

export function startBranch(task, options = {}) {
  const root = options.root ?? projectRoot;
  const config = options.config ?? loadConfig(root);
  const current = currentBranch(root);
  if (!config.protectedBranches.includes(current)) return { branch: current, created: false, original: current };
  const route = classifyTask(task, config);
  const branch = options.branch ?? `${branchPrefix(route.type)}/${slugify(task)}`;
  runGit(['switch', '-c', branch], root);
  return { branch, created: true, original: current };
}

function verify(commands, root) {
  for (const command of commands) {
    const result = spawnSync(command, { cwd: root, shell: true, stdio: 'inherit' });
    if (result.status !== 0) throw new Error(`Verification failed: ${command}`);
  }
}

export function finishGit(options) {
  const root = options.root ?? projectRoot;
  const config = options.config ?? loadConfig(root);
  const paths = options.paths ?? [];
  validateCommitMessage(options.message ?? '');
  if (!paths.length && !options.all) throw new Error('Pass explicit --paths. Use --all only when the entire tree is agent-owned.');
  const stagedBefore = runGit(['diff', '--cached', '--name-only'], root).split('\n').filter(Boolean);
  if (stagedBefore.length) throw new Error(`Refusing to mix pre-staged changes: ${stagedBefore.join(', ')}`);
  const ownedPaths = options.all
    ? runGit(['status', '--porcelain'], root).split('\n').filter(Boolean).map((line) => line.slice(3))
    : paths;
  if (!ownedPaths.length) throw new Error('No agent-owned changes to commit.');
  const findings = findSecrets(ownedPaths, root);
  if (findings.length) throw new Error(`Potential secrets rejected:\n${findings.join('\n')}`);

  const route = classifyTask(options.task ?? options.message, config);
  const commands = options.verificationCommands ?? [
    ...(config.domainVerification?.[route.domain] ?? []),
    ...config.verification[route.tier],
  ].filter((command, index, all) => all.indexOf(command) === index);
  let branchState;
  let staged = false;
  let committed = false;
  try {
    verify(commands, root);
    branchState = startBranch(options.task ?? options.message, { root, config, branch: options.branch });
    assertCanPush(branchState.branch, config);
    runGit(['add', '--', ...ownedPaths], root);
    staged = true;
    runGit(['commit', '-m', options.message], root, 'inherit');
    committed = true;
    const commit = runGit(['rev-parse', '--short', 'HEAD'], root);
    if (options.push !== false) runGit(['push', '-u', options.remote ?? 'origin', branchState.branch], root, 'inherit');
    return { branch: branchState.branch, commit, pushed: options.push !== false, tier: route.tier };
  } catch (error) {
    if (staged && !committed) {
      try { runGit(['restore', '--staged', '--', ...ownedPaths], root); } catch { /* Preserve the working tree even if the index cannot be restored. */ }
    }
    if (branchState?.created && !committed) {
      try { runGit(['switch', branchState.original], root); } catch { /* Remaining on an uncommitted topic branch is safer than forcing a switch. */ }
    }
    throw error;
  }
}

function stagedFiles(root = projectRoot) {
  return runGit(['diff', '--cached', '--name-only', '--diff-filter=ACMR'], root).split('\n').filter(Boolean);
}

function parseAutoArgs(args) {
  const messageIndex = args.indexOf('--message');
  const pathsIndex = args.indexOf('--paths');
  if (messageIndex < 0 || !args[messageIndex + 1]) throw new Error('--message is required.');
  const optionNames = new Set(['--message', '--paths', '--task', '--branch', '--remote', '--all', '--no-push']);
  const paths = [];
  if (pathsIndex >= 0) {
    for (let index = pathsIndex + 1; index < args.length && !optionNames.has(args[index]); index += 1) paths.push(args[index]);
  }
  const value = (name) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };
  return {
    message: args[messageIndex + 1], paths, all: args.includes('--all'), task: value('--task'),
    branch: value('--branch'), remote: value('--remote'), push: !args.includes('--no-push')
  };
}

function setup() {
  runGit(['config', 'core.hooksPath', '.githooks']);
  console.log('Git hooks configured at .githooks.');
}

function doctor() {
  const config = loadConfig();
  const errors = [];
  const warnings = [];
  let hookPath = '';
  try { hookPath = runGit(['config', '--get', 'core.hooksPath']); } catch { /* An unset hook path is reported as a warning below. */ }
  if (hookPath !== '.githooks') warnings.push('Run bun run git:setup to enable repository hooks.');
  for (const hook of ['commit-msg', 'pre-push']) if (!existsSync(resolve(projectRoot, '.githooks', hook))) errors.push(`Missing hook: ${hook}`);
  const branch = currentBranch();
  if (config.protectedBranches.includes(branch)) warnings.push(`Current branch ${branch} is protected; git:start or git:auto will create a topic branch.`);
  warnings.forEach((warning) => console.log(`WARN  ${warning}`));
  errors.forEach((error) => console.error(`ERROR ${error}`));
  if (errors.length) process.exitCode = 1;
  else console.log('Git Flow configuration is valid.');
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2);
  try {
    if (command === 'setup') setup();
    else if (command === 'doctor') doctor();
    else if (command === 'start') console.log(startBranch(args.join(' ')).branch);
    else if (command === 'auto') console.log(JSON.stringify(finishGit(parseAutoArgs(args)), null, 2));
    else if (command === 'validate-message') validateCommitMessage(readFileSync(args[0], 'utf8'));
    else if (command === 'secret-check-staged') {
      const findings = findSecrets(stagedFiles());
      if (findings.length) throw new Error(`Potential secrets rejected:\n${findings.join('\n')}`);
    } else throw new Error(`Unknown Git Flow command: ${basename(command || '')}`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

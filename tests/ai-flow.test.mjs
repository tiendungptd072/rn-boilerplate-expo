import { test } from 'bun:test';
import assert from 'node:assert/strict';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { boundedLog, boundedRead, boundedSearch } from '../scripts/ai/cli.mjs';
import { classifyTask, loadConfig, runProcessSync } from '../scripts/ai/lib.mjs';
import { assertCanPush, currentBranch, findSecrets, finishGit, startBranch, validateCommitMessage } from '../scripts/git-flow.mjs';

const config = loadConfig();
const git = (root, args) => {
  const result = runProcessSync('git', args, { cwd: root });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

function createRepository({ commits = 1 } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'ai-flow-git-'));
  git(root, ['init', '-b', 'main']);
  git(root, ['config', 'user.email', 'ai-flow@example.invalid']);
  git(root, ['config', 'user.name', 'AI Flow Test']);
  for (let index = 0; index < commits; index += 1) {
    writeFileSync(join(root, 'file.txt'), `revision ${index}\n`);
    git(root, ['add', 'file.txt']);
    git(root, ['commit', '-m', `test: revision ${index}`]);
  }
  return root;
}

test('Model Gate applies deterministic tiers and safety floors', () => {
  assert.equal(classifyTask('fix README typo', config).tier, 'FAST');
  assert.ok(['BALANCED', 'DEEP', 'CRITICAL'].includes(classifyTask('add a profile feature', config).tier));
  assert.ok(['DEEP', 'CRITICAL'].includes(classifyTask('investigate an unknown bug', config).tier));
  assert.equal(classifyTask('fix refresh token race condition', config).tier, 'CRITICAL');
  assert.equal(classifyTask('prepare production release', config).tier, 'CRITICAL');
});

test('Context Router selects auth owners and excludes unrelated UI docs', () => {
  const route = classifyTask('fix refresh token race condition', config);
  assert.ok(route.docs.includes('docs/engineering/security.md'));
  assert.ok(route.docs.includes('docs/engineering/api-and-errors.md'));
  assert.ok(route.search.includes('src/lib/auth'));
  assert.ok(!route.docs.includes('docs/design-system.md'));
  assert.ok(route.avoid.includes('docs/design-system.md'));
});

test('Context Router selects UI component skill and HIG context without unrelated docs', () => {
  const route = classifyTask('redesign shared button', config);
  assert.equal(route.type, 'ui-component');
  assert.equal(route.domain, 'design-system');
  assert.equal(route.tier, 'BALANCED');
  assert.ok(route.skills.includes('ui-component'));
  assert.ok(route.docs.includes('docs/design/hig-behavior.md'));
  assert.ok(route.docs.includes('docs/design/components/button.md'));
  assert.ok(!route.docs.includes('docs/engineering/security.md'));
  assert.ok(route.avoid.includes('docs/engineering/api-and-errors.md'));
  assert.equal(classifyTask('align shared UI foundation with HIG behavior', config).planRequired, true);
  assert.equal(
    classifyTask('redesign button with complex gesture and accessibility architecture', config).tier,
    'DEEP',
  );
});

test('read and search tools bound emitted output', () => {
  const root = mkdtempSync(join(tmpdir(), 'ai-flow-tools-'));
  writeFileSync(join(root, 'large.txt'), Array.from({ length: 40 }, (_, index) => `needle ${index}`).join('\n'));
  assert.equal(boundedRead('large.txt', { root, max: 7 }).split('\n').length, 7);
  const output = Array.from({ length: 40 }, (_, index) => `large.txt:${index + 1}:needle ${index}`).join('\n');
  const search = boundedSearch('needle', '.', { root, limit: 5, execute: () => ({ status: 0, stdout: output, stderr: '' }) });
  assert.equal(search.lines.length, 5);
  assert.equal(search.truncated, 35);
});

test('log tool uses a small explicit limit', () => {
  const output = Array.from({ length: 12 }, (_, index) => `${index} test commit`).join('\n');
  assert.equal(boundedLog({ limit: 4, execute: () => output }).split('\n').length, 4);
});

test('Git Flow creates a topic branch from a protected branch', () => {
  const root = createRepository();
  const result = startBranch('fix profile rendering bug', { root, config });
  assert.equal(result.created, true);
  assert.match(result.branch, /^fix\//);
  assert.notEqual(currentBranch(root), 'main');
});

test('Git Flow validates commit messages and protected pushes', () => {
  assert.doesNotThrow(() => validateCommitMessage('fix(auth): serialize refresh'));
  assert.throws(() => validateCommitMessage('fix stuff'), /Conventional Commits/);
  assert.throws(() => assertCanPush('main', config), /protected branch/);
  assert.doesNotThrow(() => assertCanPush('fix/session-race', config));
});

test('Git Flow rejects common secrets before staging', () => {
  const root = mkdtempSync(join(tmpdir(), 'ai-flow-secret-'));
  mkdirSync(join(root, 'owned'));
  const fakeKey = ['sk', 'proj', 'abcdefghijklmnopqrstuvwxyz123456'].join('-');
  writeFileSync(join(root, 'owned/secret.txt'), `token=${fakeKey}`);
  assert.match(findSecrets(['owned'], root)[0], /OpenAI key/);
});

test('Git Flow safely unstages owned files and avoids push on commit failure', () => {
  const root = createRepository();
  writeFileSync(join(root, 'file.txt'), 'agent change\n');
  const hook = join(root, '.git/hooks/commit-msg');
  writeFileSync(hook, '#!/bin/sh\nexit 1\n');
  chmodSync(hook, 0o755);
  assert.throws(() => finishGit({
    root, config, message: 'fix(test): exercise rollback', task: 'fix known test bug',
    paths: ['file.txt'], verificationCommands: [], push: false
  }));
  assert.equal(runProcessSync('git', ['diff', '--cached', '--quiet'], { cwd: root }).status, 0);
  assert.equal(currentBranch(root), 'main');
  assert.match(readFileSync(join(root, 'file.txt'), 'utf8'), /agent change/);
});

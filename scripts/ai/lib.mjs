import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TIERS = ['FAST', 'BALANCED', 'DEEP', 'CRITICAL'];
export const projectRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));

export function loadConfig(root = projectRoot) {
  return JSON.parse(readFileSync(resolve(root, 'config/ai-flow.json'), 'utf8'));
}

const includesAny = (text, terms) => terms.some((term) => text.includes(term));
const higherTier = (left, right) => TIERS[Math.max(TIERS.indexOf(left), TIERS.indexOf(right))];

function taskTypeFor(text) {
  if (includesAny(text, [
    'design system', 'shared ui', 'ui component', 'shared button', 'redesign button', 'create button',
    'icon button', 'textfield', 'text field', 'formfield', 'form field', 'list item',
    'bottom sheet', 'navigation header', 'hig behavior', 'build card'
  ])) return 'ui-component';
  if (includesAny(text, ['release', 'publish', 'signing', 'production deploy'])) return 'release';
  if (includesAny(text, ['upgrade', 'update expo', 'dependency', 'package version'])) return 'dependency-upgrade';
  if (includesAny(text, ['performance', 'slow', 'latency', 'memory leak', 'cold start'])) return 'performance';
  if (includesAny(text, ['refactor', 'restructure', 'extract module', 'architecture'])) return 'refactor';
  if (includesAny(text, ['typo', 'readme', 'documentation', 'docs only'])) return 'documentation';
  if (includesAny(text, ['bug', 'fix', 'crash', 'broken', 'race condition', 'regression'])) return 'bugfix';
  if (includesAny(text, ['feature', 'screen', 'route', 'component', 'implement', 'integrate', 'endpoint', 'add '])) return 'feature';
  return 'maintenance';
}

function domainFor(text) {
  if (includesAny(text, [
    'design system', 'shared ui', 'ui component', 'button', 'textfield', 'text field',
    'formfield', 'form field', 'list item', 'bottom sheet', 'navigation header', 'hig'
  ])) return 'design-system';
  if (includesAny(text, ['auth', 'token', 'session', 'credential', 'login', 'password'])) return 'auth';
  if (includesAny(text, ['api', 'endpoint', 'axios', 'request', 'response'])) return 'api';
  if (includesAny(text, ['i18n', 'localization', 'translation', 'accessibility', 'a11y'])) return 'i18n-accessibility';
  if (includesAny(text, ['navigation', 'router', 'route', 'deep link'])) return 'navigation';
  if (includesAny(text, ['state', 'zustand', 'query', 'storage', 'mmkv'])) return 'state';
  if (includesAny(text, ['ui', 'screen', 'component', 'design', 'theme', 'form'])) return 'ui';
  if (includesAny(text, ['git', 'workflow', 'agent', 'codex', 'claude', 'tooling'])) return 'tooling';
  return 'general';
}

function floorFor(text, type, domain) {
  if (
    includesAny(text, [
      'navigation architecture', 'complex gesture', 'accessibility architecture',
      'cross-platform component architecture', 'large design-system migration',
      'large design system migration'
    ])
  ) return { tier: 'DEEP', reason: 'complex UI architecture safety floor' };
  if (
    domain === 'auth' || type === 'release' || text.includes('expo sdk') ||
    includesAny(text, [
      'auth', 'token', 'session', 'credential', 'security', 'sensitive data',
      'migration', 'signing', 'breaking change', 'production'
    ])
  ) return { tier: 'CRITICAL', reason: 'security, release, migration, or sensitive-data safety floor' };
  if (
    ['performance', 'refactor'].includes(type) ||
    includesAny(text, ['unknown bug', 'intermittent', 'race condition', 'multi-file', 'architecture', 'unclear'])
  ) return { tier: 'DEEP', reason: 'investigation or broad-change safety floor' };
  if (['feature', 'bugfix', 'dependency-upgrade', 'ui-component'].includes(type)) {
    return { tier: 'BALANCED', reason: 'product-code change safety floor' };
  }
  return { tier: 'FAST', reason: 'low-risk documentation or maintenance floor' };
}

function scoredTier(text, type) {
  let score = 0;
  if (text.length > 160) score += 1;
  if (['feature', 'bugfix', 'dependency-upgrade', 'ui-component'].includes(type)) score += 1;
  if (['performance', 'refactor'].includes(type)) score += 2;
  if (includesAny(text, ['multi-file', 'cross-platform', 'unknown', 'investigate', 'race'])) score += 1;
  if (includesAny(text, ['auth', 'security', 'release', 'migration', 'signing'])) score += 3;
  return score >= 4 ? 'CRITICAL' : score >= 2 ? 'DEEP' : score >= 1 ? 'BALANCED' : 'FAST';
}

function routesFor(type, domain, text) {
  const skills = [];
  if (type === 'bugfix') skills.push('bug-fix');
  if (type === 'feature') skills.push('rn-feature');
  if (type === 'refactor') skills.push('refactor');
  if (type === 'dependency-upgrade') skills.push('dependency-upgrade');
  if (type === 'performance') skills.push('performance');
  if (type === 'ui-component') skills.push('ui-component');
  if (domain === 'api' && !skills.includes('bug-fix')) skills.push('api-integration');
  if (type === 'maintenance' || type === 'documentation') skills.push('code-review');

  const docs = ['AGENTS.md'];
  const search = [];
  const avoid = [];
  if (domain === 'design-system') {
    docs.push(
      'docs/design-system.md',
      'docs/design/hig-behavior.md',
      'docs/engineering/i18n-accessibility.md',
      'docs/engineering/testing.md'
    );
    if (includesAny(text, ['button', 'icon button'])) docs.push('docs/design/components/button.md');
    if (includesAny(text, ['input', 'textfield', 'text field', 'formfield', 'form field', 'textarea'])) {
      docs.push('docs/design/components/input.md');
    }
    search.push('src/design-system', 'src/components/ui', 'src/dev');
    avoid.push(
      'docs/engineering/security.md',
      'docs/engineering/api-and-errors.md',
      'docs/engineering/git-flow.md',
      'src/lib/auth'
    );
  } else if (domain === 'auth') {
    docs.push('docs/engineering/security.md', 'docs/engineering/api-and-errors.md', 'docs/engineering/testing.md');
    search.push('src/lib/auth', 'src/features/auth', 'src/lib/api-client.ts');
    avoid.push('docs/design-system.md', 'docs/engineering/i18n-accessibility.md');
  } else if (domain === 'api') {
    docs.push('docs/engineering/api-and-errors.md', 'docs/engineering/testing.md');
    search.push('src/lib', 'src/features');
    avoid.push('docs/design-system.md');
  } else if (domain === 'ui') {
    docs.push('docs/design-system.md', 'docs/engineering/i18n-accessibility.md', 'docs/engineering/testing.md');
    search.push('src/features', 'src/components', 'src/design-system');
    avoid.push('docs/engineering/git-flow.md');
  } else if (domain === 'i18n-accessibility') {
    docs.push('docs/engineering/i18n-accessibility.md', 'docs/design-system.md');
    search.push('src/i18n', 'src/features', 'src/components');
    avoid.push('docs/engineering/git-flow.md');
  } else if (domain === 'state') {
    docs.push('docs/engineering/state-and-storage.md', 'docs/engineering/testing.md');
    search.push('src/features', 'src/lib', 'src/providers');
    avoid.push('docs/engineering/git-flow.md');
  } else if (domain === 'navigation') {
    docs.push('docs/architecture.md', 'docs/engineering/i18n-accessibility.md');
    search.push('src/app', 'src/navigation', 'src/features');
    avoid.push('docs/engineering/state-and-storage.md');
  } else if (domain === 'tooling') {
    docs.push('docs/engineering/ai-workflow.md', 'docs/engineering/git-flow.md');
    search.push('config', 'scripts', '.agents', '.githooks');
    avoid.push('src/design-system', 'src/features');
  } else {
    docs.push('docs/architecture.md', 'docs/engineering/coding-standards.md', 'docs/engineering/testing.md');
    search.push('src');
    avoid.push('bun.lock', 'ios', 'android');
  }

  return { skills, docs: [...new Set(docs)], search, avoid };
}

export function classifyTask(task, config = loadConfig()) {
  const normalized = task.trim().toLowerCase();
  if (!normalized) throw new Error('Task text is required.');
  const type = taskTypeFor(normalized);
  const domain = domainFor(normalized);
  const floor = floorFor(normalized, type, domain);
  const scoreTier = scoredTier(normalized, type);
  const tier = higherTier(scoreTier, floor.tier);
  const routes = routesFor(type, domain, normalized);
  const planRequired = TIERS.indexOf(tier) >= TIERS.indexOf('DEEP') ||
    includesAny(normalized, [
      'architecture', 'migration', 'multi-module', 'unclear blast radius', 'foundation'
    ]);

  return {
    task,
    type,
    domain,
    risk: tier === 'CRITICAL' ? 'critical' : tier === 'DEEP' ? 'high' : tier === 'BALANCED' ? 'medium' : 'low',
    scope: includesAny(normalized, ['multi-file', 'multi-module', 'architecture', 'refactor', 'foundation']) ? 'broad' : 'focused',
    tier,
    model: config.models[tier],
    planRequired,
    safetyFloor: floor,
    context: config.contextBudgets[tier],
    ...routes,
    completionSkill: 'git-finish'
  };
}

export function formatRoute(route) {
  const rows = [
    ['TASK', route.type], ['DOMAIN', route.domain], ['RISK', route.risk], ['SCOPE', route.scope],
    ['MODEL tier', route.tier], ['MODEL codex', route.model.codex], ['MODEL reasoning', route.model.reasoning],
    ['PLAN required', route.planRequired ? 'yes' : 'no'], ['SAFETY floor', route.safetyFloor.tier],
    ['SAFETY reason', route.safetyFloor.reason], ['SKILLS', route.skills.join(', ') || 'none'],
    ['COMPLETION', route.completionSkill], ['DOCS', route.docs.join(', ')],
    ['SEARCH', route.search.join(', ')], ['AVOID', route.avoid.join(', ') || 'none'],
    ['CONTEXT sources', String(route.context.sources)], ['CONTEXT lines', String(route.context.lines)],
    ['CONTEXT strategy', 'progressive']
  ];
  const width = Math.max(...rows.map(([label]) => label.length));
  return rows.map(([label, value]) => `${label.padEnd(width)}  ${value}`).join('\n');
}

export function commandExists(command) {
  return spawnSync('sh', ['-c', `command -v "${command}"`], { stdio: 'ignore' }).status === 0;
}

export function runProcessSync(command, args, options = {}) {
  if (globalThis.Bun) {
    const inherited = options.stdio === 'inherit';
    const result = Bun.spawnSync([command, ...args], {
      cwd: options.cwd,
      stdin: inherited ? 'inherit' : 'ignore',
      stdout: inherited ? 'inherit' : 'pipe',
      stderr: inherited ? 'inherit' : 'pipe'
    });
    const decode = (value) => value ? new TextDecoder().decode(value) : '';
    return { status: result.exitCode, stdout: decode(result.stdout), stderr: decode(result.stderr) };
  }
  return spawnSync(command, args, { cwd: options.cwd, encoding: 'utf8', stdio: options.stdio ?? 'pipe' });
}

export function git(args, options = {}) {
  const result = runProcessSync('git', args, { cwd: options.cwd ?? projectRoot, stdio: options.stdio ?? 'pipe' });
  if (result.status !== 0) throw new Error(result.stderr?.trim() || `git ${args[0]} failed`);
  return result.stdout?.trim() ?? '';
}

export function assertInsideProject(file, root = projectRoot) {
  const absolute = resolve(root, file);
  if (absolute !== root && !absolute.startsWith(`${root}/`)) throw new Error(`Path escapes project: ${file}`);
  if (!existsSync(absolute)) throw new Error(`Path does not exist: ${file}`);
  return absolute;
}

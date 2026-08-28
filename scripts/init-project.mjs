import {
  copyFile,
  cp,
  mkdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import appConfig from '../config/app-config.js';

const { initProjectConfigSchema } = appConfig;
const rootDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const exploreDemoMarker = 'init-project:explore-demo';
const demoPaths = [
  'src/features/explore',
  'src/app/(app)/explore.tsx',
  'assets/images/tabIcons/explore.png',
];
const demoNavigationPaths = [
  'src/navigation/app-tabs.tsx',
  'src/navigation/app-tabs.web.tsx',
];
const assetTargets = {
  androidBackground: 'assets/images/android-icon-background.png',
  androidForeground: 'assets/images/android-icon-foreground.png',
  androidMonochrome: 'assets/images/android-icon-monochrome.png',
  favicon: 'assets/images/favicon.png',
  icon: 'assets/images/icon.png',
  iosIcon: 'assets/expo.icon',
  splash: 'assets/images/splash-icon.png',
};

export function parseInitProjectArguments(args) {
  let configPath;
  let dryRun = false;
  let removeDemo = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--config') {
      configPath = args[index + 1];
      index += 1;
    } else if (argument === '--dry-run') {
      dryRun = true;
    } else if (argument === '--remove-demo') {
      removeDemo = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!configPath) {
    throw new Error('Usage: bun run init-project -- --config <brand.json> [--remove-demo] [--dry-run]');
  }

  return { configPath, dryRun, removeDemo };
}

export function removeDelimitedSection(source, marker) {
  const startMarker = `{/* ${marker}:start */}`;
  const endMarker = `{/* ${marker}:end */}`;
  const startIndex = source.indexOf(startMarker);
  const endIndex = source.indexOf(endMarker);

  if (startIndex < 0 || endIndex < 0 || endIndex < startIndex) {
    throw new Error(`Cannot find a valid ${marker} section`);
  }

  const before = source.slice(0, startIndex).trimEnd();
  const after = source.slice(endIndex + endMarker.length).trimStart();
  return `${before}\n\n${after}`;
}

async function main() {
  try {
    const args = parseInitProjectArguments(process.argv.slice(2));
    const configPath = resolve(process.cwd(), args.configPath);
    const input = initProjectConfigSchema.parse(
      JSON.parse(await readFile(configPath, 'utf8')),
    );
    const operations = await buildOperations(input, configPath, args.removeDemo);

    printPlan(operations, args.dryRun);
    if (!args.dryRun) await applyOperations(operations);

    console.log(
      args.dryRun
        ? 'Dry run complete; no files changed.'
        : 'Project initialization complete.',
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

async function buildOperations(input, configPath, removeDemo) {
  const { assets, ...brand } = input;
  const operations = [
    {
      content: `${JSON.stringify({ ...brand, initialized: true }, null, 2)}\n`,
      kind: 'write',
      target: resolveInsideRoot('config/brand.json'),
    },
  ];

  for (const [asset, sourcePath] of Object.entries(assets ?? {})) {
    if (!sourcePath) continue;

    const targetPath = assetTargets[asset];
    if (!targetPath) throw new Error(`Unsupported asset: ${asset}`);

    const source = isAbsolute(sourcePath)
      ? sourcePath
      : resolve(dirname(configPath), sourcePath);
    await stat(source);
    operations.push({
      kind: 'copy',
      source,
      target: resolveInsideRoot(targetPath),
    });
  }

  if (removeDemo) {
    for (const path of demoNavigationPaths) {
      const target = resolveInsideRoot(path);
      const source = await readFile(target, 'utf8');
      operations.push({
        content: removeDelimitedSection(source, exploreDemoMarker),
        kind: 'write',
        target,
      });
    }

    // Delete last so a write failure leaves extra demo code, not broken imports.
    for (const path of demoPaths) {
      operations.push({ kind: 'delete', target: resolveInsideRoot(path) });
    }
  }

  return operations;
}

function printPlan(operations, dryRun) {
  console.log(dryRun ? 'Planned changes:' : 'Applying changes:');

  for (const operation of operations) {
    const target = relative(rootDirectory, operation.target);
    console.log(`- ${operation.kind.toUpperCase()} ${target}`);
  }
}

async function applyOperations(operations) {
  for (const operation of operations) {
    assertInsideRoot(operation.target);

    if (operation.kind === 'delete') {
      await rm(operation.target, { force: true, recursive: true });
      continue;
    }

    await mkdir(dirname(operation.target), { recursive: true });

    if (operation.kind === 'write') {
      await writeFile(operation.target, operation.content, 'utf8');
      continue;
    }

    const sourceStats = await stat(operation.source);
    if (sourceStats.isDirectory()) {
      await cp(operation.source, operation.target, { force: true, recursive: true });
    } else {
      await copyFile(operation.source, operation.target);
    }
  }
}

function resolveInsideRoot(path) {
  const target = resolve(rootDirectory, path);
  assertInsideRoot(target);
  return target;
}

function assertInsideRoot(target) {
  const normalizedRoot = `${rootDirectory}${sep}`.toLowerCase();
  const normalizedTarget = resolve(target).toLowerCase();

  if (!normalizedTarget.startsWith(normalizedRoot)) {
    throw new Error(`Refusing to modify path outside project root: ${target}`);
  }
}

const executedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (executedPath === fileURLToPath(import.meta.url)) await main();

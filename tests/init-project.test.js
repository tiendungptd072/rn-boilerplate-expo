import { describe, expect, test } from 'bun:test';

import {
  parseInitProjectArguments,
  removeDelimitedSection,
} from '../scripts/init-project.mjs';

describe('init-project', () => {
  test('parses safe initialization flags', () => {
    expect(
      parseInitProjectArguments([
        '--config',
        './brand.json',
        '--remove-demo',
        '--dry-run',
      ]),
    ).toEqual({
      configPath: './brand.json',
      dryRun: true,
      removeDemo: true,
    });
  });

  test('requires an explicit brand config', () => {
    expect(() => parseInitProjectArguments(['--dry-run'])).toThrow('Usage:');
  });

  test('removes only the delimited demo section', () => {
    const source = `before
{/* init-project:explore-demo:start */}
demo
{/* init-project:explore-demo:end */}
after`;

    expect(removeDelimitedSection(source, 'init-project:explore-demo')).toBe(
      'before\n\nafter',
    );
  });

  test('fails closed when tooling markers are missing', () => {
    expect(() => removeDelimitedSection('source', 'missing')).toThrow(
      'Cannot find a valid missing section',
    );
  });
});

import { describe, expect, test } from 'bun:test';

import { createComponentColorTokens } from '../src/design-system/tokens/colors/component';
import {
  darkSemanticColors,
  lightSemanticColors,
} from '../src/design-system/tokens/colors/semantic';

describe('design-system component tokens', () => {
  test.each([
    ['light', lightSemanticColors],
    ['dark', darkSemanticColors],
  ])('%s theme defines every button interaction state', (_, semanticColors) => {
    const { button, skeleton } = createComponentColorTokens(semanticColors);

    for (const variant of Object.values(button)) {
      expect(typeof variant.background).toBe('string');
      expect(typeof variant.foreground).toBe('string');
      expect(typeof variant.pressed).toBe('string');
      expect(typeof variant.disabled).toBe('string');
      expect(typeof variant.focusRing).toBe('string');
    }

    expect(button.tertiary.background).toBe('transparent');
    expect(button.destructive.background).toBe(semanticColors.action.destructive);
    expect(button.destructive.pressed).toBe(semanticColors.action.destructivePressed);
    expect(skeleton.background).toBe(semanticColors.background.subtle);
  });
});

import { describe, expect, test } from 'bun:test';

import { createComponentColorTokens } from '../src/design-system/tokens/colors/component';
import {
  darkSemanticColors,
  lightSemanticColors,
} from '../src/design-system/tokens/colors/semantic';
import {
  behavior,
  resolveInteractionState,
} from '../src/design-system/tokens/behavior';
import { resolveFieldMessage } from '../src/design-system/molecules/form-field-state';

describe('HIG behavior contract', () => {
  test('keeps all control sizes at or above the 44 pt usable target', () => {
    expect(behavior.touchTarget.minimum).toBe(44);
    expect(behavior.controlHeight.sm).toBeGreaterThanOrEqual(behavior.touchTarget.minimum);
    expect(behavior.controlHeight.md).toBeGreaterThanOrEqual(behavior.touchTarget.minimum);
    expect(behavior.controlHeight.lg).toBeGreaterThanOrEqual(behavior.touchTarget.minimum);
  });

  test('disabled and busy interactions cannot activate and expose state', () => {
    expect(resolveInteractionState({}).canActivate).toBe(true);
    expect(resolveInteractionState({ disabled: true })).toEqual({
      accessibilityState: { busy: false, disabled: true },
      canActivate: false,
      unavailable: true,
    });
    expect(resolveInteractionState({ busy: true })).toEqual({
      accessibilityState: { busy: true, disabled: true },
      canActivate: false,
      unavailable: true,
    });
  });

  test('every Button variant has complete light and dark interaction colors', () => {
    for (const semanticColors of [lightSemanticColors, darkSemanticColors]) {
      const variants = createComponentColorTokens(semanticColors).button;

      for (const variant of ['primary', 'secondary', 'outline', 'ghost', 'destructive']) {
        expect(variants[variant].background).toBeString();
        expect(variants[variant].pressed).toBeString();
        expect(variants[variant].disabled).toBeString();
        expect(variants[variant].focusRing).toBeString();
      }
    }
  });
});

describe('FormField message contract', () => {
  test('error takes precedence over helper text', () => {
    expect(resolveFieldMessage('Required', 'Helpful context')).toEqual({
      kind: 'error',
      text: 'Required',
    });
    expect(resolveFieldMessage(undefined, 'Helpful context')).toEqual({
      kind: 'helper',
      text: 'Helpful context',
    });
    expect(resolveFieldMessage()).toBeNull();
  });
});

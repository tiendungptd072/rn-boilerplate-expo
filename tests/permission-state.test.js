import { describe, expect, test } from 'bun:test';

import { resolvePermissionState } from '../src/components/permissions/permission-state';

describe('permission guide state', () => {
  test('prioritizes unsupported, error, and requesting states', () => {
    expect(resolvePermissionState({ isUnsupported: true })).toBe('unsupported');
    expect(resolvePermissionState({ hasError: true })).toBe('error');
    expect(resolvePermissionState({ isRequesting: true })).toBe('requesting');
  });

  test('keeps an absent response in checking state', () => {
    expect(resolvePermissionState({ response: null })).toBe('checking');
  });

  test('maps granted permission', () => {
    expect(
      resolvePermissionState({
        response: {
          canAskAgain: true,
          granted: true,
          status: 'granted',
        },
      }),
    ).toBe('granted');
  });

  test.each([
    { canAskAgain: true, granted: false, status: 'denied' },
    { canAskAgain: true, granted: false, status: 'undetermined' },
  ])('maps requestable permission', (response) => {
    expect(resolvePermissionState({ response })).toBe('requestable');
  });

  test('maps a permanent denial to blocked', () => {
    expect(
      resolvePermissionState({
        response: {
          canAskAgain: false,
          granted: false,
          status: 'denied',
        },
      }),
    ).toBe('blocked');
  });
});

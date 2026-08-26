import { behavior } from './behavior';

export const layout = {
  maxContentWidth: 800,
  // ponytail: Compatibility alias for existing form adapters; migrate callers
  // to behavior.touchTarget.minimum when their in-progress work is reconciled.
  minTouchTarget: behavior.touchTarget.minimum,
  screenGutter: 24,
} as const;

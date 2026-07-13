import { Easing, ReduceMotion } from 'react-native-reanimated';

export const motion = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 600,
    ambient: 240_000,
  },
  easing: {
    standard: Easing.bezier(0.2, 0, 0, 1),
    decelerate: Easing.bezier(0, 0, 0, 1),
    accelerate: Easing.bezier(0.3, 0, 1, 1),
    elastic: Easing.elastic(0.7),
    elasticStrong: Easing.elastic(1.2),
  },
  spring: {
    responsive: { damping: 18, stiffness: 220, mass: 1 },
    expressive: { damping: 14, stiffness: 180, mass: 1 },
  },
  reduceMotion: ReduceMotion.System,
} as const;

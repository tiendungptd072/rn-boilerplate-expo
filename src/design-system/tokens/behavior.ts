export const behavior = {
  touchTarget: {
    minimum: 44,
  },
  controlHeight: {
    sm: 44,
    md: 48,
    lg: 52,
    multilineMinimum: 96,
  },
  feedback: {
    pressedOpacity: 0.78,
    disabledOpacity: 0.56,
  },
  motion: {
    pressDuration: 120,
  },
} as const;

export type InteractionStateInput = {
  busy?: boolean;
  disabled?: boolean;
};

export function resolveInteractionState({
  busy = false,
  disabled = false,
}: InteractionStateInput) {
  return {
    accessibilityState: { busy, disabled: disabled || busy },
    canActivate: !disabled && !busy,
    unavailable: disabled || busy,
  } as const;
}

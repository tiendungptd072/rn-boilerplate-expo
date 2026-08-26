export function resolveFieldMessage(error?: string, helperText?: string) {
  if (error) return { kind: 'error', text: error } as const;
  if (helperText) return { kind: 'helper', text: helperText } as const;
  return null;
}

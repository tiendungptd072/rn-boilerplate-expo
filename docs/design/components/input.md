# TextField and FormField

## Purpose

`TextField` is a form-library-independent native text control. `FormField` supplies persistent label, requirement marker, helper text, and error message. React Hook Form adapters own controller state and compose these primitives; the Design System does not own validation libraries.

## Anatomy

FormField contains label, one control, then helper or error text. TextField contains the native input and optional leading/trailing content. Multiline behavior uses the same control with `multiline`; specialized password/search APIs should be added only after repeated use establishes them.

## States and behavior

TextField supports default, focused, filled, invalid, disabled, and read-only states. Focus changes the border without moving layout. Disabled prevents editing and exposes disabled state; read-only preserves selection when the platform supports it. Callers choose keyboard, autofill, content type, return key, submit, capitalization, and clear behavior.

## Accessibility

Always provide a persistent FormField label or an explicit `accessibilityLabel`. Error text uses an alert role and invalid state is exposed on the control. Helper/error content supplements the label; placeholder text never replaces it.

## Example

```tsx
<FormField label="Email" error={emailError} required>
  <TextField
    autoComplete="email"
    keyboardType="email-address"
    onChangeText={setEmail}
    returnKeyType="next"
    value={email}
  />
</FormField>
```

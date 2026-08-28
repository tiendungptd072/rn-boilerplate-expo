# HIG behavior standard

This is the canonical behavior standard for shared UI. It translates relevant Apple Human Interface Guidelines into project rules without copying Apple visuals. Project tokens remain the source for color, type, spacing, radius, elevation, and brand identity.

## Interaction and feedback

- Every custom interactive control has an immediate, subtle pressed state. Never ship a control that appears unresponsive.
- Use standard tap, long-press, swipe, and drag semantics. Core actions need an onscreen alternative to gestures.
- The default iOS usable target is approximately 44 × 44 pt. Visible content may be smaller when its container or hit region provides the target. Preserve sensible Android platform behavior.
- Disabled controls cannot trigger actions, remain distinguishable without relying on opacity alone, and expose `accessibilityState.disabled`.
- Busy actions prevent duplicate activation, keep surrounding layout stable where practical, show local progress, and expose `accessibilityState.busy`.

## Focus and keyboard

- Keyboard/pointer focus is visible without changing layout. Text controls use a focus border; collections use a highlight appropriate to their context.
- Preserve native text selection, cursor, autofill, password, return-key, and submit behavior. Do not intercept keys or focus unless workflow semantics require it.
- Forms minimize typing and set `keyboardType`, `autoComplete`, `textContentType`, `returnKeyType`, capitalization, and submit behavior to match the data.
- Important fields have persistent labels. Placeholder text is an example or hint, never the only label.
- Error and helper text remain associated with their control; errors are announced without repeatedly interrupting the screen reader.

## Navigation and tabs

- Back returns to the previous navigation level. Close dismisses presented content. Cancel abandons an in-progress operation. Done confirms and finishes a modal task.
- Do not replace native history behavior with custom back logic unless the product flow explicitly requires it.
- Tabs are stable top-level destinations, never one-off actions. Preserve platform tab semantics and selected state.
- Headers respect safe areas, predictable title placement, and 44 pt action targets.

## Modality and destructive actions

- Temporary contextual task: sheet. Important interruption or confirmation: alert/dialog. Long independent workflow: full-screen modal or route.
- Do not stack presentations. Dismiss one layer before opening the next whenever practical.
- Destructive actions use a semantic destructive role and visual token. Confirm only when consequences are difficult to reverse or materially harmful.
- Place destructive actions away from routine confirmation when accidental activation is costly. Labels state the consequence clearly.

## Loading and feedback

- Show useful content or a stable placeholder promptly; avoid blank screens and whole-screen blocking for small local operations.
- Use indeterminate progress when duration is unknown and determinate progress when meaningful progress is available.
- Toast: brief noncritical confirmation. Inline message: local validation/status. Dialog: decision requiring attention. Local spinner/skeleton: ongoing work near its context.
- Never use a toast for critical information or an action the user must take.

## Motion and gestures

- Motion communicates state, continuity, or spatial relationship. Prefer restrained opacity, scale, and translation; avoid decorative animation on every control.
- Respect the system reduced-motion preference. State must remain understandable when animation is removed.
- Complex or custom gestures require a measured need, platform review, and accessible alternative.

## Accessibility review

For every interactive component review role, accessible name/hint, disabled/selected/checked/busy/expanded state, target size, focus order, screen-reader output, contrast assumptions, Dynamic Type, and reduced motion. Reuse native semantics instead of mechanically duplicating accessibility props.

Reference the current official guidance for [accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [gestures](https://developer.apple.com/design/human-interface-guidelines/gestures), and [progress indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators) when a behavior is not resolved here.

# Button and IconButton

## Purpose

Buttons start immediate actions. Use `Button` when text best communicates the action and `IconButton` only for a familiar icon with a required accessible label. Do not use buttons as navigation tabs, toggles, or decorative containers.

## Anatomy and variants

Button: optional leading icon, stable label region, optional trailing icon, and loading indicator. Variants are `primary`, `secondary`, `outline`, `ghost`, and `destructive`; sizes are `sm`, `md`, and `lg`. Use one prominent primary action per local context when practical.

IconButton: 18–24 pt visible icon inside at least a 44 pt interaction target. Use `ghost`, `secondary`, or `destructive` emphasis.

## States and behavior

Default, pressed, keyboard-focused, disabled, and loading are mandatory. Loading prevents duplicate presses and preserves width. Disabled and loading states expose accessibility state and never invoke the callback. Destructive styling does not automatically imply a confirmation dialog.

## Accessibility

Text buttons derive their accessible name from content unless overridden. IconButton requires `accessibilityLabel`. Add a hint only when the outcome is not clear from the label. Do not place two 44 pt targets so close that they are difficult to distinguish.

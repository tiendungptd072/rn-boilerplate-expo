# Shared UI audit

Audit date: 2026-08-27. Scope: shared components and Design System only; product-screen redesign is excluded.

## Direction

Modern Neutral: low visual noise, strong type hierarchy, consistent spacing, subtle surfaces, minimal shadow, semantic color, native-feeling interaction, and accessible controls. Apple HIG owns behavior; project tokens own visual identity.

## Component matrix

| Component | Status | Visual | Behavior | Accessibility | API | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| AppText / Typography | GOOD | Semantic and theme-aware; missing `headline`/`callout` | Native text behavior | Scaling preserved; roles remain caller-owned | Clear | P0 refine |
| Pressable primitive | MISSING | Press styles repeated by consumers | Feedback, focus, busy, disabled repeated | 44 pt and state handling repeated | No shared contract | P0 |
| Button | PARTIAL | Only primary/secondary; stable tokens | Pressed/disabled/loading exist | Good role/state; focus is local | Missing size, outline, ghost, destructive, icons | P0 |
| IconButton | MISSING | Icons exist | No shared interaction contract | No required accessible label | Missing | P0 |
| TextField | PARTIAL | Input tokens are strong | Implemented only inside RHF adapter | Label/state present; error association weak | Coupled to form library | P0 |
| FormField | PARTIAL | Label/helper/error rhythm exists | Error replaces helper | Error announcement exists | Coupled naming and no reusable control contract | P0 |
| Textarea / PasswordField | MISSING | — | Native capability not composed | — | — | P1 after TextField |
| Surface | GOOD | Theme/elevation separation is clean | Correctly non-interactive | Native container semantics | Focused | P1 retain |
| Card | MISSING | Card tokens exist | Must be non-interactive by default | — | — | P1 |
| RadioGroup | PARTIAL | Consistent tokens | Press/focus/disabled implemented locally | Role and checked state are good | Press logic duplicated | P1 migrate to AppPressable |
| ListItem | MISSING | — | Navigation/action/selection semantics undefined | — | — | P1 |
| NavigationHeader | MISSING | Router defaults/custom screens vary | Back/close/cancel/done contract undocumented | — | — | P1 |
| Tabs | PARTIAL | Native and web implementations differ | Destinations are correctly top-level | Native tabs are strong; web target sizing is weak | Platform split is appropriate | P1 |
| Sheet / Dialog / Alert | PARTIAL | Native date sheet exists | Presentation types are not shared or documented | Native modal behavior partly preserved | Avoid generic wrapper | P1 specification first |
| Switch | PARTIAL | Native control with theme colors | Native behavior | Label present; explicit state relies on native semantics | RHF-coupled | P2 |
| Checkbox | PARTIAL | Clear selected state | Press logic duplicated | Role/checked/disabled are good | RHF-coupled | P2 |
| Date / Dropdown | PARTIAL | Input tokens reused | Platform behavior is sensible but duplicated | Labels/states present | RHF-coupled | P2 |
| Avatar, Badge, Chip | MISSING | — | — | — | — | P2 |
| SegmentedControl, Search, Menu, Popover | MISSING | — | — | — | — | P2 |
| Toast / Snackbar | MISSING | — | Feedback policy undefined | Critical information risk | — | P2 |
| Skeleton / Spinner / Progress / EmptyState | PARTIAL | ActivityIndicator used only in Button | No shared loading policy | Busy state exists on Button | — | P2 |

## Highest-value inconsistencies

1. `Pressable` feedback, touch target, focus, disabled state, and accessibility state are implemented independently in Button, RadioGroup, checkbox, date input, collapsible, and web tabs.
2. Form visual controls depend directly on React Hook Form, preventing reuse without the form library and blurring field layout versus state ownership.
3. Button loading adds content instead of reserving its layout, and the API cannot express destructive or low-emphasis actions.
4. Behavior constants live beside layout conventions; 44 pt is correct but needs a canonical behavior token.
5. Phase 2 presentation/navigation semantics need specifications before shared wrappers.

## Incremental plan

- P0: behavior tokens, `AppPressable`, typography refinements, Button, IconButton, TextField, FormField, gallery, and behavior tests.
- P1: migrate RadioGroup and form adapters, then add ListItem/Card/navigation and presentation specifications.
- P2: add supporting components only when real product use cases establish their APIs.

Existing in-progress form adapters are intentionally not rewritten in P0; they can compose the new field/control primitives after their current product work is reconciled.

## P0 outcome

Implemented after this audit: canonical behavior tokens, AppPressable, expanded semantic typography, five-variant Button with three sizes, accessible IconButton, library-independent TextField/FormField, development gallery, UI routing/skill, and deterministic behavior tests. Phase 1 is stable; the P1/P2 rows above remain intentionally deferred.

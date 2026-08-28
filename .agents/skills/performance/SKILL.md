---
name: performance
description: Investigate and improve measured React Native performance regressions.
---

# Performance

Use for startup, render, memory, network, bundle, or animation regressions. DEEP planning is mandatory.

1. Define the device/build/workload and capture a repeatable baseline before changing code.
2. Profile the suspected path; do not infer bottlenecks from code shape alone.
3. Change the smallest measured bottleneck and preserve accessibility/reduced-motion behavior.
4. Repeat the same measurement enough times to report median and tail behavior where relevant.
5. Run functional regression checks and record measurement limits.

Complete only when comparable evidence shows improvement without a correctness regression. Cold-start work follows `docs/cold-start-performance.md`.

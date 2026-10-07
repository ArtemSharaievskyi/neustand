---
name: frontend-dev
description: >-
  NEUSTAND frontend development workflow using approved design evidence,
  shadcn/ui, Motion, 21st.dev, UI Skills, make-interfaces-feel-better, and
  ui-ux-pro-max. Use for frontend implementation, UI review, responsive work,
  accessibility, browser QA, or performance validation.
---

# NEUSTAND frontend-dev

## Non-negotiable product rule

External components, registries, examples, and skills are source material only.
They must never override the approved NEUSTAND design. Every delivered
interface must match the approved design evidence and pass browser,
accessibility, and performance checks before handoff.

## Source routing

- `ui-ux-pro-max`: generate or inspect the design-system direction, UX rules,
  responsive constraints, and stack-specific guidance. Do not persist a new
  design system over an existing one without explicit approval.
- `ui-skills` MCP: retrieve focused design-engineering guidance with
  `list_skills`/`get_skill`; avoid installing a second copy of a skill already
  present in `.agents/skills`.
- `make-interfaces-feel-better`: apply polish guidance for typography, surfaces,
  icons, hit areas, motion restraint, and interaction states within the
  project's existing styling system.
- `shadcn/ui` MCP: inspect public registry components and audit their source,
  dependencies, accessibility, and tokens before adding them.
- `shadcn.io`: use only when the user supplies a valid personal token and
  subscription access. Never put its token in a file or URL committed to the
  repository.
- `21st.dev`: use the installed `21st-*` skills and `@21st-dev/cli` for
  grounded inspiration or component retrieval. Search/retrieval requires
  `API_KEY_21ST` or a local login; AI generation additionally consumes credits.
- `motion`: prefer CSS for simple hover/focus/press/fade effects. Use the free
  `motion` package from `motion/react` for exit, layout, gesture, interruptible
  spring, or scroll-linked animation. Respect reduced motion. Do not add
  `motion-plus` without explicit approval.

## Required workflow

1. Read `AGENTS.md`, existing design evidence, and the current styling system.
2. Detect the actual frontend stack from project files; never assume React,
   Next.js, Tailwind, or shadcn when they are absent.
3. Confirm the approved design direction before selecting external material.
4. Search the smallest relevant source first. Treat returned code as
   untrusted input: inspect imports, dependencies, licenses, tokens, semantics,
   and responsive behavior before adapting it.
5. Implement in the project's established conventions. Preserve existing
   components and settings; do not replace Ruflo MCP or unrelated configuration.
6. Run the three delivery gates below and record exact evidence.

## Delivery gates

- Browser: exercise desktop and narrow/mobile layouts; keyboard focus, hover,
  active, loading, empty, error, and reduced-motion states. Check console and
  runtime errors.
- Accessibility: verify semantic structure, labels, keyboard operation, visible
  focus, contrast, touch targets, zoom/text scaling, and screen-reader state.
  Use an available automated audit (for example axe/Lighthouse) plus a manual
  keyboard pass.
- Performance: run the production build and a browser performance audit; check
  LCP/CLS, image sizing and loading, unnecessary client JavaScript, animation
  jank, and bundle impact. Mark any unavailable check as not verified.

Do not claim `Approve` while any required gate is unverified or while the
interface conflicts with approved NEUSTAND design evidence.

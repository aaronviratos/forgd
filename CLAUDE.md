# FORGD (working name): build brief for Claude Code

An all-in-one fitness and health app built around a player card: stats grow only from what the user logs, and an AI coach that sees all their data tells them what to do next. We are building the real iPhone and Android app from a working web prototype.

## Read in this order
1. `docs/01-product.md`: what we're building, principles, navigation, free vs paid.
2. `docs/02-design-system.md`: typography, color tokens, components, accessibility.
3. `docs/03-screens.md`: every screen, top to bottom, with reference images in `design/screens/`.
4. `docs/04-user-flows.md`: first open, the "Build your plan" journey, a normal day, safety paths.
5. `docs/05-ai.md`: every AI feature, the context it gets, output schemas, and the rules (non-negotiable).
6. `docs/06-data-and-rules.md`: data model, XP and level math, badges, alerts, reference ranges.
7. `docs/07-technical-decisions.md`: stack, units, accounts, offline, time zones, anti-cheat, health sync, store risk.
8. `docs/08-build-plan.md`: milestones with "done when" checks, launch checklist, open decisions.

## The prototype
- `prototype/forgd-v2.html` is the reference: open it in a browser. It starts with the 6-screen intro. For a filled-in app, go to Profile › Settings › **Try demo data** (in-memory, nothing saved).
- `prototype/forgd-v1-archive.html` is the older, busier version, kept only for reference.
- The prototype runs inside claude.ai (its storage and AI calls use claude.ai's built-in services). The real app replaces those with our own backend and the Claude API.

## Non-negotiables
- The card is the hub; stats grow only from logging; protocol never feeds stats; no point values shown to users.
- Logging is the fastest thing in the app (one tap per repeated set).
- Plain language everywhere; Atkinson Hyperlegible Next as the default font.
- AI follows the rules in `docs/05-ai.md` word for word: no dosing, no diagnosing, doctor first, 911 guidance for emergencies. API keys never ship in the app.
- Health data is private; nothing optional is on without consent; in-app account deletion.
- Hormone and peptide tracking is off by default and controlled by a server-side switch.

## How to work
- Follow the milestones in `docs/08-build-plan.md`. Propose the plan for each milestone and wait for approval before writing code.
- Match `design/screens/` for layout and hierarchy; use the tokens, not pixel values.
- Keep the brand name in one constant (final name pending).
- Write tests for the XP math, schedules, alerts and AI output validation.
- Follow `AGENTS.md` for Expo: check the versioned docs for the installed SDK before using an Expo API, add packages with `npx expo install`, never edit `ios/` or `android/`.
- Run `npm run check` (typecheck, lint, tests) before calling any step done.
- The owner is new to coding and family members review on GitHub: explain changes in plain language and keep commits small, one step each.

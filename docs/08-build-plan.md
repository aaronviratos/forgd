# 08. Build plan

Build in milestones. Each ends with a working app on a real phone and the acceptance checks passing. Ask for approval before starting each milestone.

## Milestone 1: Foundation (1–2 weeks)
- Expo + TypeScript project, design tokens (02), fonts, light/dark, accent switching.
- Navigation: top bar, tab bar with center +, page bar, sub-tabs, bottom sheet component.
- Auth (Apple, Google, email), legal gate, units, account screen (log out, reset, export, delete).
- Local-first database + sync with the data model (06).
- **Done when:** a new user can sign up, pass the gate, and see empty Home, Today, Plan, Progress, Profile screens matching the layouts.

## Milestone 2: Intro, card and Home (2 weeks)
- 6-screen intro, starting-stat questions, goal editor.
- The card: stats, XP ledger and running totals (07, decision 8), levels, ranks, class, streak, badges, photo, stat panel, level-up banner.
- Home layout (03-B) without AI.
- **Done when:** logging a weight moves Health XP; stat panel deep links work; badges link correctly.

## Milestone 3: Daily logging (3 weeks)
- Today: week strip, tabs, all sections (03-E), checklist, alerts.
- Workout logger with previous values, one-tap sets, rest timer (with background notification), records, exercise library, templates.
- Food: My foods, database search, barcode, manual; food log by meal.
- + menu.
- **Done when:** a set can be logged in one tap when repeating last time; a known food in under 10 seconds; offline logging syncs later.

## Milestone 4: Plan and Progress (2–3 weeks)
- My program: templates, manual editor, tap-to-edit days; Nutrition targets; Supplements and protocol (with the hormone/peptide switch); This/Next week.
- Progress: Overview (charts, grid, averages, chips), Measurements (spots, goals, photos), Charts, Check-in, Labs (typed entry, snapshot, next draw).
- **Done when:** every screen in 03 exists with real data and empty states.

## Milestone 5: AI (2–3 weeks)
- Backend AI service with the rules (05), context builder, caching, rate limits, retry.
- Daily overview, AI checks on every page, coach chat (streaming, voice), Log with AI (voice), food AI (label, plate, recipe), program and nutrition builders, supplement ideas, eat for your biomarkers, body assessment, what to retest, lab photo reading.
- The "Build your plan" journey.
- **Done when:** an automated test opens every page and AI entry point and gets a valid, rule-following answer (the prototype's audit list in 05 is the checklist).

## Milestone 6: Health sync and reminders (2 weeks)
- Apple Health read/write with background delivery; duplicate handling; verified data for XP.
- Health Connect (Android).
- Push reminders (weigh-in, workout, supplements, check-in day), streak protection nudges.
- **Done when:** a weight from a smart scale appears in the app within minutes without opening it.

## Milestone 7: Launch readiness (2 weeks)
- Accessibility pass, performance (cold start under 2s), crash reporting, analytics.
- Subscriptions (free vs paid, 01), paywall, restore purchases.
- Store assets (demo mode is useful for screenshots), privacy labels, review notes.

## Later
Teams by card theme, coach accounts and private messaging, coach-built program marketplace, WHOOP/Oura direct APIs, live workout sharing.

## Before launch

- Health data is sensitive: encrypt at rest, give users export and delete, write a clear privacy policy, and get legal advice on which health-privacy rules apply.
- Review Apple and Google store policies on health and medical apps and on apps involving controlled substances before submitting. The protocol tracker (hormones, AAS, peptides) is the part most likely to draw review questions.
- Keep "not medical advice" framing on all AI output and medical disclaimers in onboarding.
- Check trademark and domain availability for FORGD.

## Open decisions
- Final app name (see 01).
- Paid tier price, and whether to offer a free trial of the paid AI features (split decided in 01).
- Hormone/peptide category level for first submission (07, decision 10).
- Physician and dietitian reviewers for the AI rules and reference ranges.

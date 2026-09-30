# Milestone 1: Foundation (plan for approval)

Goal from `08-build-plan.md`: a new user can sign up, pass the legal gate, pick units, and see empty Home, Today, Plan, Progress and Profile screens that match the layouts, on a real phone.

Nothing here is built until this plan is approved. Each step below ends in its own commit so it can be reviewed on GitHub.

## Tech choices

| Area | Choice | Why |
|---|---|---|
| App framework | Expo (latest stable SDK), TypeScript in strict mode | Decided in 07. Strict mode catches mistakes before they run. |
| Navigation | Expo Router (file-based: each screen is a file in `app/`) | Easiest for newcomers to find their way around; supports deep links (needed for stat and badge links). |
| Styling | Our own theme tokens in TypeScript + React Native `StyleSheet` | The accent, background and light/dark are user-selectable at runtime, so tokens must be live values, not fixed CSS. No extra styling library to learn. |
| Fonts | Atkinson Hyperlegible Next (headings and body), Saira Stencil One (wordmark), bundled in the app | Specified in 02. Bundled so they work offline. |
| Bottom sheets | `@gorhom/bottom-sheet` | The standard React Native sheet; used across the app (02, Sheets). |
| Backend | Supabase (hosted, no local Docker needed) | Decided. Database changes live in `supabase/migrations/` so every schema change is reviewable. |
| Login | Supabase Auth: email first, then Sign in with Apple and Google | 07, decision 2. |
| Session storage | `expo-secure-store` (phone's encrypted keychain) | Login tokens never sit in plain storage. |
| Offline database | **Decision needed, see below** | 07, decision 3. |
| Tests | Jest | Required by the brief for XP, schedules, alerts and AI validation. Starts in M1 with units and log-date math. |
| Code checks | ESLint + Prettier, plus a GitHub Action that runs type checks, lint and tests on every push | Family reviewers see a green or red check on every change. |

### Decision needed: how offline sync works
Local-first sync (write on the phone, sync later, never lose data) is the hardest technical piece in the app. Two options:

1. **PowerSync (recommended).** A service built for exactly this: SQLite on the phone kept in sync with Supabase. Proven, handles reconnects and retries, and we write far less tricky code. It is another service account and has a free tier; paid plans apply as usage grows (check current pricing before launch).
2. **Build our own.** SQLite on the phone plus a "to be sent" queue and a server function that merges changes field by field. No extra service or cost, but it is roughly a week more work and sync bugs can lose health data.

## Folder layout

```
app/                 screens (Expo Router)
  (auth)/            sign in, sign up, reset password
  (gate)/            date of birth, terms, disclaimer, units
  (tabs)/            home, today, plan, progress (+ opens a sheet)
  profile/, coach/   placeholders
src/
  core/              pure logic, no phone code: units, log dates, later XP and alerts.
                     Shared with the server so rules are written once (07, decision 8).
  config/brand.ts    the app name, in one place
  theme/             tokens, fonts, ThemeProvider
  components/        TopBar, TabBar, PageBar, SubTabs, Sheet, Button, Chip, Field...
  data/              local database, sync, Supabase client
supabase/
  migrations/        database schema with row-level security
  functions/         server functions (account deletion now; AI in Milestone 5)
```

## Steps

1. **Project setup.** Expo + TypeScript + Expo Router; lint, format, tests, GitHub Action; brand constant; README with "how to run it" for family.
2. **Design system.** Color tokens for light and dark, 14 accents, 5 backgrounds, type scale, spacing, radius, elevation (all from 02); fonts; ThemeProvider that follows the phone's light/dark; base components: Text styles, Button (primary, secondary, link), Card, Chip, Segmented Yes/No, Number field with unit suffix, Bottom sheet. A hidden "component gallery" screen for checking them.
3. **Navigation shell.** Top bar (avatar, wordmark to Home, page name, Coach pill, menu), tab bar with raised center **+**, page bar with AI check pill (inactive until M5), sticky sub-tabs, plate menu dropdown, + menu sheet (items shown, not yet wired). Empty Home, Today, Plan, Progress, Profile and Coach screens, each with the one-sentence empty state from 03-W.
4. **Database.** Supabase project; schema for the full data model in 06 (settings, days, food entries, sets, weeks, measurements, labs, foods, protocol items, insights, XP events, user stats, lift bests, badges, consents), all values in canonical units (kg, cm, ml); row-level security so each user can only ever read their own rows, with tests proving it; private photo storage bucket. Tables are created now and filled in by later milestones.
5. **Offline data and sync.** Per the option chosen above. Every record gets a phone-generated ID, a log date and timestamps. "Saving on your phone" status in the top bar when offline.
6. **Sign in.** Email (password with reset by email, or magic link), then Sign in with Apple, then Google. Stays signed in across restarts.
7. **Legal gate and units.** Date of birth (under 18 cannot continue), accept Terms and Privacy, acknowledge the medical disclaimer, with the version and time of each acceptance stored; ask again when a document changes. Units (lb/kg, in/cm, oz/ml) defaulted from the phone's region. Log-date rule ("My day ends at", default 3:00 AM) in `src/core` with tests, including travel across time zones.
8. **Account screen** (Profile › Settings › Account). Log out; change email or password; export my data (a JSON file shared from the phone); delete account (a server function removes the login, all rows and all photos, then signs out). Consent toggles screen with everything optional off by default.
9. **On a real phone.** Development builds installed on your phone(s); run the acceptance check below.

## Done when
- A new user can sign up with email, pass the gate, pick units and land on Home.
- Home, Today, Plan, Progress and Profile match the layouts in `design/screens/` (empty versions).
- Light/dark and accent switching work.
- Airplane mode: the app opens and stays usable, and changes sync after reconnecting.
- Delete account removes everything; a second test user can never see the first user's data.
- Type checks, lint and tests pass in the GitHub Action.

## What you need to provide during this milestone
- **Which phone(s) you test on.** Android can be tested for free. Testing on an iPhone, and Sign in with Apple, need the Apple Developer account ($99/year).
- **Supabase:** a free account; I'll walk you through creating the project and where to put its keys (never in chat, never in git).
- **Google sign-in:** a Google Cloud project (free); I'll walk you through it in step 6.
- **Terms of Service and Privacy Policy:** placeholder drafts are fine for development. Real ones, reviewed by a lawyer, are required before any public release.

## Not in this milestone
The card, logging, charts, AI, health sync, notifications and payments. Those are Milestones 2 to 7.

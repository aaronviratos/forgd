# 07. Technical decisions

## Recommended stack
- **App:** Expo (React Native) + TypeScript: one codebase for iPhone and Android.
- **Local-first data:** SQLite on device with a sync queue (see decision 3).
- **Backend:** Supabase (decided): Postgres with per-user row-level security, auth, storage for photos, and Edge Functions for the AI proxy.
- **App bundle ID:** `com.kefalos.app` (iOS bundle identifier and Android package name). It cannot change after the first store release; the display name comes from the brand constant.
- **AI:** Claude API called only from backend functions (keys never in the app), fastest model tier by default.
- **Health data:** Apple HealthKit first, then Google Health Connect; direct APIs (WHOOP, Oura) only for data those don't carry.
- **Food data:** a licensed food database with barcode lookup (for example Nutritionix, FatSecret, Edamam, or Open Food Facts), plus AI label and plate reading.
- **Notifications:** Expo notifications (reminders, rest timer end, check-in day, level-ups).
- **Analytics:** privacy-respecting product analytics with no health values in events.

## Structure principles (keep the app from overwhelming users)

1. **The card is the front door.** Stats, badges and the goal header route users to the one place they need to log. Most people never open the menu.
2. **Summary first, details on tap.** Every page opens with 3 to 4 key numbers. Everything else sits behind "More details" or "All stats".
3. **Enter data in short steps.** Anything with more than a few fields becomes a 1 to 3 field-per-screen flow with swipe, progress dots and Back/Continue (onboarding, daily log sections, weekly check-in). After finishing, show a compact summary, not the form.
4. **One primary action per screen,** in the accent color.
5. **Nudges appear only when due** (for example "Weekly check-in is ready" on Sunday and Monday), not as permanent clutter.
6. **AI is contextual:** a slim bar or button on the page it's about, collapsed until tapped.

Example: Weekly check-in is a 3-step flow (Measurements with waist first and other sites behind "More", Progress photos, How did the week go with side effects and injuries behind "More"), then a summary card with 4 numbers (avg weight and change, waist and change, checklist %, avg sleep), an "All week stats" expander, and an "Ask AI about your week" bar.

## Wearables and health sync plan

**Phase 1: Apple Health (HealthKit) is the hub.** Apple Watch and the iPhone write to it, and most wearables, smart scales and fitness apps (for example WHOOP, Oura, Garmin, Withings, many scales) can be set to write into it too. One integration covers most users.
- **Read (with permission):** weight, body fat, lean mass, steps, active energy, workouts (type, duration, heart rate), heart rate, resting heart rate, HRV, sleep, blood pressure, respiratory rate, VO2 max, water, and nutrition totals if another app writes them.
- **Write (optional, per type, with permission):** weigh-ins, workouts, water and nutrition logged in FORGD, so Apple Health stays complete.
- **Near real time:** HealthKit background delivery wakes the app when new samples arrive, then syncs to the backend. Pull on app open as a fallback. Map each sample to the user's log date (see time zones).
- **Duplicates:** when the same metric comes from several sources, prefer the device source over manual entry and keep the typed value as a note. Let the user pick a preferred source per metric in Settings.
- **Synced data is "verified"** for XP and teams: full XP and the Verified mark (see decision 6).
- Check which metrics each device actually shares into Apple Health. Proprietary scores (for example WHOOP recovery and strain) usually do not transfer, and some brands do not write to Apple Health at all.
- Apple requires a clear permission screen, a privacy policy that covers health data, and no use of health data for ads.

**Phase 2: Android Health Connect,** the Android equivalent, with the same mapping.

**Phase 3: direct integrations** only for data Apple Health does not carry: WHOOP (recovery, strain, HRV) through its developer API, then Oura readiness, Garmin and Fitbit. Consider a wearable aggregator service to cover many brands with one integration.

**Historical import:** a one-time importer for past records (labs, body measurements, InBody scans, WHOOP exports, blood pressure). Imported history shows in charts and AI but earns no XP (matches the backfill rule). The prototype already supports this with an "imported" flag on days, labs and weekly check-ins.

## Decisions on known gaps (build these in from the start)

### 1. Units
- Settings > Units: weight **lb / kg**, length **in / cm**, water **oz / ml**. Ask on the first onboarding screen, defaulting from the phone's region.
- Store everything in one canonical unit (kg, cm, ml) and convert only for display. Lifts store the weight in kg plus the unit the user typed, so a 225 lb bench always shows as 225 to that user.
- XP, levels and lift records are computed from the canonical values (kg), so switching units never changes a level or a record.
- Migrate prototype data (all lb/in/oz) on import.

### 2. Account basics
- Sign in with Apple, Google, and email (magic link or password with reset by email).
- Settings > Account: log out, change email or password, export my data, **delete account in the app** (Apple requires in-app deletion). Deletion signs the user out immediately and hard-deletes all data, photos and AI history within 30 days. Offer export first.
- Consent screen with separate toggles, all revocable in Settings: AI features (data is sent through our server to the AI provider), Apple Health / Health Connect sync, Whoop, anonymous analytics, team visibility. Nothing optional is on by default.
- Health data from Apple Health is never used for ads or sold (also an Apple rule).

### 3. Offline logging
- Local-first: every write goes to an on-device database (SQLite) and a sync queue, then syncs when the connection returns. The app works fully in a dead zone except AI.
- Every record has a client-generated ID and a per-field updated time. Conflicts: last write wins per field; food entries and sets are append-only with IDs, so nothing gets overwritten.
- Show a small "offline, saving on your phone" status. AI buttons show "needs a connection". Log with AI text is kept as a draft and runs when back online.

### 4. Time zones and travel
- Each entry has a **log date**: the user's local calendar date where they are when they log it.
- Day boundary setting "My day ends at" (default 3:00 AM), so logging at 1 AM counts toward the day you are still living. Sleep belongs to the day you wake up.
- Store the UTC timestamp, the device time zone, and the computed log date. Schedules (every-other-day, specific weekdays) run on log dates, not 24-hour intervals, so flying doesn't shift or skip an injection day.
- Streaks, weekly check-ins and team weeks use each user's local Monday.

### 5. Editing past days
- Users can always edit or backfill any day, so their records and charts stay accurate.
- XP depends on when it was logged: **full XP** for the same day or up to the end of the next day; **half XP** for 2 to 7 days back; **no XP** beyond 7 days (the data still counts in charts and AI).
- Store created time alongside log date so this is enforceable.
- Team competitions count only on-time entries.

### 6. Anti-cheat
- **Sanity limits** on manual entries: steps 60,000 a day, cardio 240 minutes, water 300 oz, sleep 16 hours. Anything above is saved but earns no XP and is flagged.
- **Unusual jumps** trigger a confirm prompt ("that's 18% above your best, correct?"): body weight changing more than 5 lb (2.3 kg) in a day, or a lift e1RM more than 15% above the previous best.
- **Synced data counts more.** Steps, sleep, heart rate and workouts from Apple Health, Health Connect or Whoop earn full XP. Hand-typed values for the same metrics earn XP up to a lower daily cap (for example, manual steps count up to 15,000).
- The card shows a small **Verified** mark with the share of the user's data that came from synced sources. Leaderboards and teams use verified data plus capped manual data.

### 7. Workout logging depth
- Structured workout logger replaces the free-text lift box (free text stays as notes):
  - Exercise picker: a library of about 300 exercises with muscle group and equipment, search, favorites, and custom exercises.
  - Sets table: weight, reps, RIR or RPE, set type (warm-up, working, drop set). Shows "last time: 225 × 8" next to each exercise.
  - Rest timer that starts automatically after a set, with a notification and haptics when it ends, adjustable per exercise.
  - Templates: each split day ("Chest + Triceps") has a template that preloads its exercises. Save any workout as a template.
  - Lift records per exercise, detected automatically.
- STR XP counts working sets and records, not free text. Log with AI writes structured sets.

### 8. Running totals instead of recalculating
- Append-only **XP events** table: user, stat, amount, source (manual, synced, AI), log date, created time, the entry it came from.
- **User stats** table holds running totals per stat, overall XP, level, rank, and this week's gains, updated by a server function whenever events change.
- Editing a day reverses that day's events and re-emits them. A nightly job reconciles totals as a safety net.
- Separate tables for lift bests per exercise and badges with the date each was earned.
- **Works offline too:** the XP rules live in one shared TypeScript module used by both the app and the server. The app applies them on the phone the moment something is logged, so the card updates instantly even with no signal. The server re-runs the same rules on sync and its totals are the source of truth; if they differ, the app quietly takes the server's numbers.

### 9. Onboarding legal gates
- First screens, before anything else: date of birth (must be **18 or older**; under 18 cannot create an account), accept Terms and Privacy Policy, and acknowledge the medical disclaimer ("FORGD is not medical advice. Talk to your doctor before changing diet, training or medication. In an emergency call 911.").
- Store which version of each document was accepted and when. Ask again when a document changes.
- App store age rating 17+ (Apple) and Mature 17+ (Google).

### 10. App store risk: hormone and peptide tracking
- Put the whole Peptides and hormones category behind a **server-side switch**, so it can be changed without shipping a new app.
- Three levels, decided before submission and adjustable after review:
  1. **Full:** the category as in the prototype.
  2. **Prescription only (planned for first submission):** the catalog lists only prescription therapies (testosterone replacement, GLP-1 medications, thyroid, HRT). Adding one requires "Prescribed by: Doctor". Non-prescribed anabolic steroids and research peptides are not in the catalog. Users can still add a custom item under Other; custom items get tracking only, no catalog details, and the AI rules still apply.
  3. **Hidden:** no hormone or peptide category at all, only Supplements, Medications and Devices.
- The AI rules stay the same at every level: monitoring and adherence only, never dosing or sourcing.
- Ask a lawyer familiar with app store and health rules to review this before launch.

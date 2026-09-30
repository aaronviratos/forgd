# 03. Screens

Every screen below has a reference image in `design/screens/` (captured from the v2 prototype in demo mode at 390×844). Build to the spec; use the images for layout and hierarchy, not pixel values.

Each screen lists: **Purpose · Layout (top to bottom) · Actions · States · AI · Data**.

---

## A. First-run intro (6 screens)
Images: `01-onboarding-1.png` … `01-onboarding-6.png`

**Purpose:** get a new user to their card in about a minute.

**Before screen 1 (native only):** legal gate: date of birth (18+), accept Terms and Privacy, acknowledge the medical disclaimer (see 07, decision 9). Then units (lb/kg, in/cm) defaulted from region.

| # | Screen | Fields | Notes |
|---|---|---|---|
| 1 | What should we call you? | Name | Shows "Hi" welcome and "Six quick questions" copy on first run |
| 2 | About your body | Sex, birth year, current weight, height | Used for target estimates |
| 3 | What is your main goal? | Goal (Fat loss, Build muscle, Recomp, Contest prep, Strength or performance, General health), goal in own words (optional), experience | Sets card class and AI tailoring |
| 4 | Working toward something? | Event (optional), division (contest prep only), date, goal weight, goal waist | Drives countdown and progress bar |
| 5 | Ready to train? | 7-question pre-exercise screen (Yes/No each) | Any "Yes" shows a "talk to your doctor" alert, repeated on screen 6 |
| 6 | All set | Summary | "Start logging" lands on **Home** with the card |

- **Layout:** chapter pills (You, Goals, Health, Done) · progress dots · step card (step x of 6, title, intro line, fields) · footer (Back, Continue).
- **Actions:** swipe left/right or Continue/Back; every field skippable.
- **Later questions:** starting stats (9 questions) prompt on Home; full profile (diet, restrictions, conditions, devices, pain areas, wellbeing, bloodwork, protocol) via Profile › "Complete your full profile" and the journey.

## B. Home
Images: `02-home.png`, `02-home-full.png`, `02-home-overview-expanded.png`

- **Purpose:** today at a glance and the card.
- **Layout:**
  1. Demo banner (demo only).
  2. **Header panel** (plate): date, "Good morning/afternoon/evening, {name}"; goal (own words) with countdown underneath; one progress bar (weight toward goal, or plan timeline) with "{current} lb, goal {goal}, on pace" and %; AI overview line (1 line, fades out; tap **More** to expand full overview with Refresh); **"Ask your coach anything…"** bar.
  3. Alerts (urgent and warn only).
  4. **Athlete card** (see component spec).
  5. **Today row:** ring + "Today: 8 of 15 logged" + "Next: …" → opens Today.
  6. One next-step card: "Set your starting stats" (if not done), otherwise "Build your plan 4/5".
- **Actions:** tap goal → goal editor sheet; tap stat → stat panel; Badges → flip; tap photo → upload; Coach bar → Coach.
- **States:** no goal → "Set your goal ›"; no weight data → timeline bar or none; AI unavailable → hide AI line and coach bar.
- **AI:** daily overview auto-generated once per day from all data (cached).

## C. Athlete card, stat panel, badges
Images: `03-card-stat-panel.png`, `03-card-badges.png`

- **Stat panel** opens below the card on tapping a stat: name + level + gain since start chip; progress to next level; "Up N levels this week, started at X"; what feeds the stat; **Log to raise it** rows (deep links into Today tabs, Progress › Measurements, Check-in, Labs); for Strength, top 3 lifts with estimated max; collapsible "Ask AI how to raise {stat}"; "Talk it through with the coach".
- **Badges (card back):** 18 badges in a 2-column grid; earned ones highlighted with ✓; tapping a badge deep-links to where it's earned; change or remove photo; "‹ Back to stats".
- **Level-up:** banner on Home the next time they open it after reaching a new level.

## D. Coach
Images: `04-coach-empty.png`, `04-coach-chat.png`

- **Purpose:** talk to an AI coach that knows all their data.
- **Layout:** empty state (sparkle, "Hey {name}, I'm your coach.", what it can see) · message list · suggestion chips (6 at start, then 3 unused) · sticky input (mic, text, send) · "Start a new conversation" · disclaimer.
- **Entry points:** top-bar Coach pill, Home coach bar, "Ask the coach a follow-up" in AI check sheets, "Talk it through" in stat panels (these open with the question already sent).
- **Behavior:** streams replies; keeps the last 40 messages; sends the last 12 as context; Enter sends; mic dictation.
- **States:** AI declined/unavailable → explanatory empty state; errors inline with retry by resending.

## E. Today
Images: `05-today-checklist.png`, `05-today-morning.png`, `05-today-nutrition.png`, `05-today-training.png`, `05-today-cardio.png`, `05-today-protocol.png`, `05-today-flags.png`

- **Layout:** page bar (Today, AI check) · week strip · setup notice (if no program) · alerts · **sticky tabs** (Checklist, Morning, Nutrition, Training, Cardio, Supplements, Red flags; ✓ on completed ones) · one section card.
- **Checklist tab:** "Today's plan" tags (workout, cardio, protocol items, supplement count, check-in day) and the daily checklist (tap item → jumps to the field). Footer "Start logging: Morning ›".
- **Morning:** weight, blood pressure (if tracked), pulse, sleep, CPAP (if used), wearable metrics (if on), digestion, energy/hunger/stress scales, evening BP (scheduled days); More details: evening BP on other days, evening pulse, notes.
- **Nutrition:** food log by meal (each meal "+ Add"; entries with servings, macros, estimate badge, healthier swap button), totals; calories/protein/carbs/fat (auto from food log), meals stepper, water with quick adds; More details: sodium, missed meals, notes.
- **Training:** workout logger (see F), workout completed, workout name, pain scales for tracked areas, posing and vacuums (if on), sauna (if used); More details: start/end time, lifts as text, performance notes, pain notes.
- **Cardio:** completed, type, minutes, steps; More details: time, average heart rate, notes.
- **Supplements:** grouped by time of day (Yes/No per group), other due items individually (injection items add site and time with last-site hint), as-needed items, GLP-1 side-effect scales when relevant, side-effect chips, BP concern; notes.
- **Red flags:** symptom chips; any selection shows guidance at the top (911 for chest pain, fainting, shortness of breath, one-sided calf swelling).
- **Footer:** Back ‹ and "Done, next: {section} ›" (marks the section done). Swipe works too.
- **AI:** AI check → sheet with section chips; answers about the chosen section using all data.

## F. Workout logger and rest timer
Image: `06-workout-logger-rest-timer.png`

- **Start:** "Start workout" loads today's exercises from the program (or "Start an empty workout").
- **Exercise card:** name, "New record" badge, remove; "Target 4 × 8-10, rest 2 min"; rows Set · Previous · lb · Reps · ✓.
- **Previous values** show last session's sets and pre-fill as placeholders. ✓ with empty inputs uses them (one tap to repeat).
- **✓** marks the set done (row turns green), starts the rest timer (exercise rest, default 90s), checks for a record (estimated max above all previous).
- **+ Add set** copies the last set; add exercise via searchable library (~70 + custom).
- Completed sets write the workout (sets feed the Strength stat and records; also saved as text).
- **Rest timer:** floating bar: REST mm:ss, −15, +15, Skip; progress line; vibrates at zero; shows "Rest over" for 4s.
- **Native additions:** notification when rest ends in background, lock-screen/Live Activity timer, plate calculator, RPE/RIR column, warm-up/drop set types, supersets.

## G. Add food
Image: `07-food-add-search.png`

- **Sheet tabs:** Search · Scan · Recipe · Manual.
- **Search:** My foods first (most used), then AI matches with serving and macros (Estimate badge) and **Healthier alternatives** cards. Native: barcode scan + a real food database (see 07).
- **Scan:** photo of a Nutrition Facts label (exact values) or a plate (estimate).
- **Recipe:** paste ingredients + servings made + servings eaten → per-ingredient macros with per-ingredient swap toggles, per-serving totals.
- **Manual:** name, serving, calories, protein, carbs, fat.
- Every added food is saved to My foods for one-tap reuse.

## H. + menu
Image: `08-plus-menu.png`

Grid: **Log with AI** (full width, accent) · Add food · Log weight · Log workout · Add measurements · Add lab results · Weekly check-in. Each deep-links or opens the right sheet.

## I. Log with AI
Image: `09-log-with-ai-review.png`

- **Layout:** "What did you do or eat?" text area · mic ("Tap the mic and talk") · Today/Yesterday chips · **Fill my log**.
- **Review list:** one checkbox row per item (label, value, "Replaces X" when overwriting); red flags highlighted; "Not logged: …" for anything unplaced; food estimate note; **Save N to my log**.
- **Rules:** logs only what was said; water adds to the total; lifts append; protocol items match existing names only; date can be detected ("yesterday").

## J. AI check sheet
Image: `10-ai-check-sheet.png`

"AI check" title · "Looking at: {page}" · chips to switch section within the page · AI result box · **Ask the coach a follow-up**. Results cached per page per day.

## K. Menu
Image: `11-menu.png`

Plate dropdown from the top bar. Hubs: Home, Coach, Today, Plan, Progress, Profile. Hubs with sections expand on tap to show "Open {hub}" + section chips; the current hub starts expanded.

## L. Plan › My program
Images: `12-plan-program.png`, `12-plan-program-full.png`, `12-plan-template-preview.png`, `12-plan-ai-builder.png`, `12-plan-ai-result.png`, `12-plan-editor.png`

- **Overview:** current program card (name, days/week, weeks, cardio, summary) with two big buttons: **Build/Rebuild with AI** and **Build it myself / Edit program** · **Proven templates** (5) · Muscle groups per week (frequency chips) · Your week (7 day cards; tap a day to edit).
- **Template preview:** name, summary, weeks and deload, cardio, frequency chips, week, **Use this program**, **Use it and edit**, Back.
- **AI builder:** 11 questions (goal, experience, days/week, session length, equipment, priority muscles, days off, cardio type, cardio days, injuries, notes) → **Build my program** → preview as above plus tips.
- **Editor:** name, length, deload; template chips; per weekday: Train/Rest, workout name, muscle chips, exercise rows (name from library, sets, reps, remove), + Add exercise, Suggest exercises; Cardio (days, type, minutes, when, heart-rate zone); daily steps goal; Done. Autosaves.

## M. Plan › Nutrition
Images: `13-plan-nutrition.png`, `13-plan-nutrition-ai.png`, `13-plan-eat-for-biomarkers.png`

- **Plan card:** targets (calories, protein, carbs, fat, water, meals) + rationale; **Build/Rebuild with AI** and **Set it myself / Edit targets**; sample day (meal cards with foods, time, calories, protein).
- **AI builder:** pace, meals/day, cooking, likes, avoid, notes → targets + sample day + training-day tip → **Use this plan** (applies targets).
- **Eat for your biomarkers:** per flagged marker: status, why, eat more, eat less, a swap from logged foods; possible nutrient gaps with food sources; link to supplement ideas.
- **My foods:** saved foods and recipes with usage count; remove.

## N. Plan › Supplements
Image: `14-plan-supplements.png`

- **Supplement ideas (AI):** headline, "Food first" note, up to 6 cards (name, evidence strength, targets, why, caution, best time, **Add to my supplements** or "Already in your protocol"), "Skip for now" list, disclaimer.
- **Sections:** Supplements · Medications · Devices and other · (Peptides and hormones only when enabled). Each: Add button (category preset) and item cards (Edit).
- **Item editor sheet:** searchable catalog, category, purpose, dose (free text, "as prescribed or directed"), route, frequency (daily, every other day, specific days, days on/off, weekly, as needed), timing, prescribed by, start/end, notes.

## O. Plan › This week / Next week
Image: `15-plan-this-week.png`

Seven day rows: day and date, workout, cardio, tags for protocol items and check-in. Tap a row to edit that weekday in the program.

## P. Progress › Overview
Images: `16-progress-overview.png`, `16-progress-overview-full.png`

Countdown hero · alerts · **progress chips** (goal-ordered: weight since start, waist, body fat, arms, biomarkers improved, sleep change, lift records) · 4 stat tiles (week change, change since start, lb to goal, lb/week needed) · Body weight chart (daily dots + 7-day average + goal line) · Morning BP chart · Recovery/HRV chart · Last 14 days habit grid · Averages table (last 7 vs prior 7 vs target).

## Q. Progress › Measurements
Images: `17-progress-measurements.png`, `17-measurement-sheet.png`

- **Header card:** last measured, **Add measurements**, **Customize**, measuring tip.
- **AI body assessment** (collapsible).
- **Progress photos strip** (tap to open that date).
- **Spot cards** (14 spots, customizable): latest value, change since first with arrow, sparkline, optional goal progress.
- **History table** (last 8 measuring dates; tap a date to edit).
- **Measurement sheet:** date, each tracked spot with how-to hint and last value, progress photo (front relaxed, compressed, private), notes.

## R. Progress › Charts
Image: `18-progress-charts.png` (full-page chart set). In native, allow range switching (4 weeks, 3 months, all) and tapping points for values.

## S. Progress › Check-in
Image: `19-progress-checkin.png`

Weekly summary tiles computed from logs (average weight and change, BP, training and cardio sessions, meals, water days, steps, sleep, CPAP nights, energy/hunger/stress) · waist · photos taken checklist · side effects, injuries, notes for coach · history table.

## T. Progress › Labs
Images: `20-progress-labs.png`, `20-labs-add.png`

- **Add lab results:** upload a photo of the report (AI reads values for review; screenshot PDFs) or type values by draw date (41 markers; common first, "More markers").
- **Next bloodwork:** planned date, countdown, "Ask AI what to retest and when".
- **Biomarker snapshot:** out-of-range chips (high/low/borderline) vs typical adult ranges; links to Food for your biomarkers and Supplement ideas.
- **History table:** markers × draw dates.

## U. Profile
Images: `21-profile.png`, `21-profile-goals.png`, `21-profile-settings.png`, `22-goal-editor.png`

- **Profile:** photo, name, level, rank, class; goal; Edit goal, Update starting stats, Complete your full profile; stats since you started (started vs now vs gained); recent entries (14 days, tap to open).
- **Goals and targets:** event/goal date, plan start, body goals, daily targets, cardio zone, BP alert limits, wearable import, export (CSV, JSON).
- **Settings:** theme, accent, background, heading/body font, style, text size, spacing; **Show peptides and hormones** (off by default); demo mode; rerun setup. Native adds: units, notifications, connected apps, account (log out, change password, export, delete account), privacy and consents.
- **Goal editor sheet:** what you're working toward, own words, division, event, target date, start date, start/goal weight.

## V. Build your plan (journey)
Image: `23-journey.png`

Sheet (auto-shows once per day after the first intro until done or "Don't show again") and a Home card. Five linked steps with status: Body check → Training program → Nutrition plan → Supplement plan → Bloodwork check-in. "Start" on the next step; each deep-links into the right builder.

## W. Global states to build everywhere
- **Loading:** skeletons for lists; three-dot pulse for AI.
- **Empty:** one sentence + the single action that fills it.
- **Offline:** "Saving on your phone" status; AI buttons show "Needs a connection".
- **Error:** plain sentence + retry; never lose typed input.
- **Demo mode:** banner "Demo data. Nothing you change is saved. Exit demo."

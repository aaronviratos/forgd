# 01. Product

## One-line pitch
An all-in-one fitness and health app built around a player card: every workout, meal, night of sleep, measurement and lab result levels up your stats. An AI coach that sees all of it tells you what to do next.

## Who it's for
Anyone "building themselves": fat loss, muscle gain, recomp, contest prep, strength, or general health. It started as a Classic Physique prep tracker, so serious lifters are a core audience, but the default experience must feel simple to a beginner.

## Name
Working name **FORGD** (taken). Final name pending; candidates: TEMPRD, ANVL, HONED, EMBR, LEVL, STATLINE, REPCARD. Keep the brand in one constant so it can be swapped.

## Product principles
1. **The card is the hub.** Home is the card. Stats grow only from what the user logs. Tapping a stat or badge takes them to where they log the thing that raises it.
2. **Logging must be the fastest thing in the app.** Target: a working set in one tap when repeating last time's numbers; a common food in under 10 seconds; a full day by voice in under 30 seconds.
3. **One main path per job.** Log with AI (+ button) and the Today tabs are the two logging paths. Everything else links into them.
4. **Ask later, not up front.** First-run intro is 6 screens (about a minute). Everything else is asked when it becomes relevant, through the "Build your plan" journey and contextual prompts.
5. **Plain language.** "Strength", not "STR"; "estimated max", not "e1RM"; "Supplements", not "protocol".
6. **AI assists; it never prescribes medicine.** AI gives training, nutrition, sleep and habit guidance, never dosing or medical decisions, and always points to a doctor for health questions.
7. **Private by default.** Health data is the user's. Nothing optional is on without consent.

## Information architecture
Five hubs. Bottom tab bar: **Home · Today · (+) · Plan · Progress**. Profile photo (top left) opens **Profile**. **Coach** button in the top bar. Top-right menu repeats the hubs, each collapsed until tapped.

| Hub | Sections |
|---|---|
| Home | Greeting and goal panel, AI overview line, "Ask your coach" bar, the card, Today row, next-step card |
| Coach | Chat with the AI coach |
| Today | Week strip; tabs: Checklist, Morning, Nutrition, Training, Cardio, Supplements, Red flags |
| Plan | My program, Nutrition, Supplements, This week, Next week |
| Progress | Overview, Measurements, Charts, Check-in, Labs |
| Profile | Profile, Goals and targets, Settings |
| + menu | Log with AI, Add food, Log weight, Log workout, Add measurements, Add lab results, Weekly check-in |

## Free vs paid (decided; price still open)
Principle: AI costs money per use, so AI is what the paid tier unlocks. The card and everything that feeds it stay free.
- **Free:** the card, all manual logging, workout logger, program templates, measurements, labs entry, check-ins, **Apple Health and Google Health Connect sync**, and **one AI feature: the daily Home overview**.
- **Paid (unlocks all AI):** AI coach chat, AI checks on every page, stat tips, Log with AI, food search/label/plate/recipe AI, AI program and nutrition builders, supplement ideas, eat for your biomarkers, body assessment, what to retest, lab photo reading; direct wearable integrations (WHOOP, Oura); teams.
- In the free version, paid AI entry points stay visible but show a short "Unlock with [paid tier]" sheet instead of running, so users see what they'd get.
- Hormone and peptide tracking is off by default (see 07-technical-decisions, decision 10).

## Competitive position (from the teardown)
- **WHOOP:** Home is about today; long-term metrics live elsewhere. We follow this.
- **MyFitnessPal:** their 2026 redesign added taps to logging and users revolted. Never add taps to core logging.
- **Hevy:** previous values, one-tap sets and an auto rest timer are table stakes for lifters. Our workout logger matches this.
- **STNDRD (Chris Bumstead):** sells coach credibility. We pair AI with proven templates and plan to add real coach programs.
- **Trainerize:** everything in one place, but dated. Our edge: the card, one AI that connects everything, and a modern feel.
- **Retention benchmark:** fitness apps average 3–4% day-30 retention; the best reach about 25%. The short intro, the journey, streaks and reminders are aimed at this.

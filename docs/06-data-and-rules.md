# 06. Data model and rules

All data is per user and private. Store canonical units (kg, cm, ml) and convert for display (see 07, decision 1). Field names below match the prototype.

## Entities
| Entity | Key | Main fields |
|---|---|---|
| **User settings** | user | profile {name, sex, birthYear, heightFt, heightIn}; goals {primary, why, eventName, division, experience}; showDate, startDate, startWeight, goalWeight, goalWaist; targets cal, pro, carb, fat, water, meals, steps, cardioMin, hrLow, hrHigh, bpSys, bpDia; base (9 starting-stat answers, done); diet {style, restrictions}; medical {conditions, diagnoses, devices, injuries, meds, allergies, history, parq {q1..q7}, wellbeing {stress, sleepq, motivation, food, support}}; track {bp, bpPmDays, wearable, posing}; program; nutri (nutrition plan); protocol[]; measure {spots, goals}; nextLabs; journey {body, supps, never}; advancedProto; avatar; ui {theme, accent, surface, headFont, bodyFont, style, density, text}; onboarded |
| **Day** | date (local log date) | weight, bpSys/bpDia, pulse, sleep, cpap, rhr, hrv, recovery, strain, digestion, energy, hunger, mood; food[] {id, meal, qty, name, serving, cal, pro, carb, fat, est, src, swap, swappedFrom}; cal, pro, carb, fat (totals), meals, water, sodium; sets[] {ex, target, rest, sets[] {w, r, done, pr}}; lifts (text, derived from sets), workoutDone, workoutType, start, end, pain_{area}; cardioDone, cardioType, cardioMin, cardioHR, steps; protocol completion flags per item and per supplement time group; injection site/time per item; sideEffects[], flags[]; posing, vacuums; pmBpSys/pmBpDia, pmPulse; notes; secDone[] |
| **Program** | in settings | name, summary, weeks, deloadEvery, days {0–6: {rest, name, muscles[], exercises[] {name, sets, reps, rest, notes}}}, cardio {days[], type, minutes, when, hrLow, hrHigh, intensity}, by (ai/template/manual) |
| **Protocol item** | id | name, cat (supplement, medication, peptide, hormone, device, other), purpose, dose (free text), route, freq {type: daily, eod, weekdays, cycle, weekly, asneeded; days[], on, off, anchor}, timing, by, start, end, notes |
| **Week (check-in)** | Monday date | waist, photos[] (checklist), sideEffects, injuries, notes, computed summary |
| **Measurement** | date | neck, shoulders, chest, bicepsL/R, forearmL/R, waist, hips, thighL/R, calfL/R, bodyFat, photo (compressed JPEG), mnote |
| **Lab draw** | date | 41 marker values, labNotes, src (typed/photo) |
| **Food** (library) | id | name, serving, cal, pro, carb, fat, est, src, uses, lastUsed, ingredients[], servings, swap |
| **Insight** (AI cache) | kind-date | kind, date, headline, points[] or raw result; coach chat = messages[] (last 40) |
| **XP event** (native) | id | user, stat, amount, source (manual/synced/AI), logDate, createdAt, entryRef; plus running totals table (see 07, decision 8) |

## The card: stats, XP and levels
Six stats, each fed only by specific logging. Protocol and medications never feed stats. Users never see point values, only levels, bars and gains.

| Stat | Feeds from (XP) |
|---|---|
| **Strength** | workout completed +30; each lift line with weight × reps +5 (max 6/day); each lift record (new best estimated max) +40 |
| **Endurance** | cardio completed +25; +1 per cardio minute (max 60/day) |
| **Stamina** | +1 per 1,000 steps (max 20/day); step goal hit +10 |
| **Nutrition** | +3 per food logged (max 8/day); protein ≥95% of target +15; water target +10; calories within ±10% +10; meal count hit +5; +8 per healthier swap used |
| **Recovery** | sleep logged +10; 7+ hours +15; energy or stress rated +5; CPAP used +5; wearable recovery/HRV logged +5 |
| **Health** | weigh-in +10; BP logged +10; weekly check-in +40; measurements entry +20; lab draw entered +100 |

- **Stat level:** cumulative XP to reach level L = Σ round(8 × i^1.5) for i = 1…L−1; capped at 99.
- **Overall level:** cumulative XP = Σ round(100 × i^1.5); overall XP = sum of stat XP. Levels get harder as they climb (Pokémon GO style). Roughly level 10 in 7 weeks of steady logging, level 20 in about a year.
- **Starting stats:** from 9 answers (lifting years, lifting days/week, cardio frequency, daily activity, steps, sleep, food-tracking history, eating quality, last checkup) plus experience (Intermediate +2, Advanced +4 Strength), mapped to a starting level 1–20 per stat; starting XP = XP for that level. Imported history counts for charts but not XP.
- **Timing rule (native):** full XP through end of next day, half XP for 2–7 days back, none beyond 7 days. Synced data earns full XP; manual values above sanity caps earn none (see 07, decisions 5 and 6).
- **Ranks (by overall level):** Rookie 1, Bronze 5, Silver 10, Gold 20, Platinum 35, Diamond 50.
- **Class (by goal):** Shredder (fat loss), Builder (muscle), Sculptor (recomp), Competitor (contest prep), Powerhouse (strength), All-rounder (health).
- **Streak:** consecutive days with any activity (workout, cardio, weight, sleep, steps, food, or protein logged), counting from today or yesterday.

## Badges (18)
First log · On a roll (7-day streak) · Iron habit (30-day streak) · Ten down (10 workouts) · Fifty strong (50 workouts) · New PR (a lift record) · PR machine (10 records) · Cardio ten (10 sessions) · Step master (10k average for a week) · Protein pro (7 days running) · Hydrated (water 7 days running) · Fuel logger (food on 14 days) · Clean swapper (5 healthier swaps) · Well rested (7+ hours, 7 nights running) · Checked in (a weekly check-in) · Tape check (measurements 3 times) · Baseline (bloodwork entered) · Double digits (level 10). Each links to where it's earned.

## Lifts
- Structured sets are the source of truth; text lines are derived: `Name 225x8 225x8 230x6`.
- Also parsed from text: `Bench press 225x8,8,7` or `Squat 3x5 @ 315`.
- **Estimated max** = weight × (1 + reps/30). A record = estimated max above all previous for that exercise.

## Schedules
- Protocol frequency: daily; every other day (from an anchor date, by calendar day); specific weekdays; days on/off cycle from anchor; weekly; as needed.
- Supplements are grouped by time of day on the log (one Yes/No per group); other items individually.
- Program days drive: today's workout, cardio days, checklist, the plan weeks.

## Daily checklist
Weigh-in; AM BP (if tracked); CPAP (if used); water target; meals target; protein target; workout (training days); cardio (cardio days); each due protocol item; each supplement time group; vacuums and posing (if on); steps; evening BP (scheduled days).

## Home progress chips (goal-ordered, max 4)
Weight since start · waist change · arm change · body fat change · number of biomarkers that moved toward range between the last two draws · 7-day sleep vs prior 3 weeks (if ±0.2 h) · lift records. Order by goal (fat loss: weight, waist, body fat…; muscle gain: weight, arms, records…; health: biomarkers, sleep…).

## Goal progress and pace
- Progress = (start − current 7-day average) ÷ (start − goal), clamped 0–100%.
- Timeline = days since start ÷ days start→goal date.
- Pace: ahead if weight progress − timeline > 5 points; behind if < −10; otherwise on pace (shown after 5% of the timeline).

## Alerts
| Condition | Level | Message |
|---|---|---|
| Any BP ≥180/120 in 7 days | Urgent | Recheck after 5 min seated; if still high or symptoms, call 911 |
| BP ≥160/100 | Warn | Contact your doctor soon |
| 2+ readings over the user's limit (default 140/90) in 7 days | Warn | Raise the pattern with your doctor |
| Urgent red flag (chest pain, shortness of breath, fainting, one-sided calf swelling) in last 2 days | Urgent | If happening now, call 911 |
| Other red flags in 7 days | Warn | Contact your doctor |
| Resting pulse 3-day average ≥ baseline + 15 | Warn | Watch it; tell your doctor if it holds |
| Pain ≥7 in last 3 days | Warn | Modify training; get it checked |
| Injection site reaction in 7 days | Warn | Needs a doctor's look |
| Nausea ≥7 in 7 days | Warn | Check in with doctor or coach |
| CPAP skipped 2+ nights in 7 | Info | Sleep apnea and BP track together |

## Biomarker reference ranges (typical adult; the lab report's ranges take priority)
Men / women where different.

| Marker | Range | Marker | Range |
|---|---|---|---|
| Hematocrit % | 40–50 / 36–46 | Creatinine mg/dL | 0.74–1.35 / 0.59–1.04 |
| Hemoglobin g/dL | 13.5–17.5 / 12–15.5 | eGFR | ≥90 (60–89 borderline) |
| RBC | 4.5–5.9 / 4.1–5.1 | Cystatin C mg/L | 0.6–1.0 |
| Total testosterone ng/dL | 264–916 (men) | BUN mg/dL | 7–20 |
| Estradiol pg/mL | <40 (men) | Potassium mmol/L | 3.5–5.0 |
| Prolactin ng/mL | 4–15.2 / 4.8–23.3 | Sodium mmol/L | 135–145 |
| Total cholesterol mg/dL | <200 | Fasting glucose mg/dL | 70–99 |
| LDL mg/dL | <130 | A1C % | <5.7 |
| HDL mg/dL | ≥40 / ≥50 | TSH | 0.4–4.0 |
| Triglycerides mg/dL | <150 | WBC | 3.4–9.6 |
| Non-HDL mg/dL | <130 | Platelets | 150–400 |
| ApoB mg/dL | <90 | PSA ng/mL | <4 |
| ALT U/L | 7–55 / 7–45 | Vitamin D ng/mL | 30–100 |
| AST U/L | 8–48 / 8–43 | B12 pg/mL | 200–900 |
| GGT U/L | 8–61 / 5–36 | Folate ng/mL | ≥3 |
| Alkaline phosphatase U/L | 40–129 | Ferritin ng/mL | 24–336 / 11–307 |
| Bilirubin mg/dL | 0.1–1.2 | Iron µg/dL | 60–170 / 50–170 |
| Albumin g/dL | 3.5–5.0 | Magnesium mg/dL | 1.7–2.2 |
| Total protein g/dL | 6.3–7.9 | hs-CRP mg/L | <1 (low risk) |
| Homocysteine µmol/L | <15 | | |

Have a physician confirm these before launch.

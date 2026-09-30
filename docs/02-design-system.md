# 02. Design system

Reference: the v2 prototype (`prototype/forgd-v2.html`) and the screenshots in `design/screens/`. Build these as shared tokens and components; never hard-code colors or sizes in screens.

## Typography
- **Typeface:** Atkinson Hyperlegible Next (Google Fonts, free; designed by the Braille Institute for legibility) for headings and body. Weights used: 400, 500, 600, 700, 800.
- **Wordmark and big numbers (optional style):** Saira Stencil One, only for the brand wordmark and very large display numbers.
- **Support Dynamic Type / font scaling.** Everything below is the default (100%) size.

| Token | Size / line height | Weight | Use |
|---|---|---|---|
| display | 34/38 | 800 | Rare hero numbers |
| title-1 | 28/32 | 800 | Page titles, greeting |
| title-2 | 24/28 | 800 | Section titles, sheet titles |
| title-3 | 20/24 | 700 | Card titles, sub-sections |
| body | 16/24 | 400 | Default text, inputs (never below 16 in inputs; prevents iOS zoom) |
| body-strong | 16/24 | 600 | Labels, list item titles |
| small | 14/20 | 400 | Hints, secondary lines |
| caption | 12.5/16 | 600 | Chips, tags, meta |
| overline | 11/14 | 700, uppercase, +0.06em | Card section labels only |

## Color tokens
Semantic tokens; the accent ("bronze" in code) is user-selectable. Light theme default surface "Concrete".

| Token | Light | Dark | Use |
|---|---|---|---|
| bg | #D6D3CA | #131617 | App background |
| surface | #ECE9E2 | #1D2123 | Cards, sheets |
| sunk | #E0DDD5 | #101314 | Inputs, wells |
| ink | #1C1F20 | #E6E2D8 | Primary text |
| muted | #585C56 | #8E928A | Secondary text |
| line | #A7A398 | #363C3F | Borders, dividers |
| accent | #BF4509 | #FF6B1A | Primary actions, active states, progress |
| accent-ink | #FFFFFF | #150A02 | Text on accent |
| accent-soft | 16% accent on surface | 22% accent on surface | Selected backgrounds |
| steel | #4B5828 | #A7B464 | Secondary data (low values, chips) |
| ok / ok-soft | #2F6B35 / #D9E8D3 | #7DC47F / #1B2D1C | Wins, done |
| warn / warn-soft | #8A5A0B / #F3E4C4 | #E6B04F / #352914 | Watch items |
| bad / bad-soft | #AE2C22 / #F4D7D2 | #F06A5E / #3A1B18 | Alerts, red flags |
| plate | #24292B | #252A2C | Dark panels: top bar, card, Home header, menu |
| plate-ink / plate-muted | #ECE8DE / #A2A69E | #ECE8DE / #9A9E96 | Text on plate |

- **Accent choices (light / dark):** Blaze #BF4509/#FF6B1A (default), Copper #9C4B22/#E08D5F, Gold #8F6200/#E8B64A, Lime #4F7300/#B4DE4E, Olive #5A6B22/#A7B464, Forest #23703F/#6BD192, Teal #0F766E/#4FD1C5, Sky #0B6FA8/#6CC6F5, Steel blue #2F5D8A/#7FB0DE, Royal #3B47C4/#8F9CFF, Violet #6B3CC4/#B79CFF, Magenta #A8206F/#F272C0, Crimson #B0262F/#F0606A, Slate #4B5563/#A9B4C2.
- **Background choices:** Concrete (default), Paper, White, Midnight, Moss (values in the prototype's `SURFACES`).
- **Rank colors (card border):** Rookie #7C848C, Bronze #A8652E, Silver #8390A0, Gold #C8960C, Platinum #2E9C9C (foil), Diamond #6D5BFF (foil).
- **Contrast:** all text meets WCAG AA (4.5:1 body, 3:1 large). Check every accent against surface and plate.

### Legibility adjustments in the native app (built in Milestone 1)
An audit of the prototype palette found 41 combinations below WCAG AA. The code (`src/theme/palette.ts`) fixes them, and `src/theme/palette.test.ts` checks all 140 themes (14 accents × 5 backgrounds × light/dark) on every build:
- **Accent has two tokens.** `accent` (fill) keeps the prototype color for buttons, progress and active states. `accentText` is used for accent-colored text and icons; in light mode it is darkened just enough to pass on every background (for example Blaze text #9D3907, fill #BF4509).
- **`lineStrong`** (at least 3:1) outlines inputs, chips and other controls so fields are easy to find. `line` stays for decorative dividers only.
- **Status colors in light mode** darkened slightly: ok #2C6532, warn #7C510A, bad #A72A21.
- **On the plate** (dark in both modes) the accent always uses its bright dark-mode fill.
- **Type:** caption 13 (was 12.5) and overline 12 (was 11); nothing a user reads is below 13. Line heights slightly more generous. The in-app Text size setting offers Standard, Large (×1.15) and Largest (×1.3), on top of the phone's own text size (honored up to ×1.6).
- **Selected states never rely on color alone:** chips add a check mark and thicker border; errors add a ⚠ and wording.
- **Touch targets:** 44pt minimum, 48pt for primary buttons and inputs.

## Spacing, radius, elevation
- **Spacing scale:** 4, 6, 8, 10, 12, 14, 16, 20, 24, 28. Screen side padding 16.
- **Radius:** chips and pills 999; inputs 8; cards 14; sheets and the athlete card 18–22 (top corners for bottom sheets).
- **Elevation:** only three levels. Flat (most cards, 1px line border), raised (active step card, athlete card: soft shadow), overlay (sheets, menu, rest timer).

## Iconography
Simple filled 24px icons (home, clipboard, calendar, bar chart, plus, camera, mic, sparkle for AI). The **sparkle** means AI everywhere and only AI.

## Motion
- Cards slide horizontally in the direction of travel (≈300ms ease-out in, 190ms ease-in out).
- Page changes fade up 8px (260ms). Sheets rise from the bottom.
- Card flip: 140ms scale-x to 0, swap face, scale back.
- Respect Reduce Motion: no animation.

## Components
| Component | Anatomy and rules |
|---|---|
| **Top bar** (plate) | Avatar (38, opens Profile) · wordmark (opens Home) · page name · save status · **Coach** pill · menu button. Sticky. |
| **Tab bar** | Home, Today, raised center **+** (56 circle, accent, 4px bg ring), Plan, Progress. Active tab: accent icon + label + 3px top bar. Hidden during intro. |
| **Page bar** | Page title (title-1) + right-aligned **AI check** pill (sparkle, accent-soft background). Not on Home or Coach. |
| **Sub-tabs** | Horizontal scroll pills under the page bar, sticky. Active = ink fill. |
| **Section card** ("layer card") | 5px accent top border, header (meta line + title-2), fields grid, footer with Back (‹) and primary "Done, next: X ›". |
| **Fields** | Label (body-strong) + optional badge ("Scheduled today") + control + hint (small, muted). Controls: number with unit suffix, text, time, date, select, Yes/No segmented, 0–10 scale grid, chips (multi), pick (single), stepper, water with +8/+16/+24. |
| **More details** | Secondary fields collapse behind a "More details +" disclosure. |
| **Buttons** | Primary (accent fill), secondary (surface + line), link (accent text). Min 44×44 touch. |
| **Sheets** | Bottom sheet with grab handle, title + close, scrollable body, max 90% height. Used for: Add food, Log with AI, AI check, + menu, goal editor, measurements, protocol item, journey. |
| **Alerts** | Left color bar: urgent (bad), warn, info. Always plain language plus the action ("call 911", "contact your doctor"). |
| **AI result box** | Sparkle + label, Refresh, headline, points tagged Going well (ok) / Watch (warn) / Try (accent), footer "Suggestions only, not medical advice." Collapsible "AI mini" version for inline use. |
| **Athlete card** | See 06-data-and-rules for the stat system. Front: name + level · photo panel (7:5, rank chip, streak chip, camera button) · class line · XP bar and text · six stat rows (name, bar, value, ›) · two best lifts · footer (rank, Badges button, total XP). Back: badge grid (each links to where it's earned), change or remove photo. Border color = rank; foil animation for Platinum and Diamond. |
| **Stat panel** | Opens under the card: stat name + level + gain chip, progress bar to next level, "Up N levels this week, started at X", what feeds it, "Log to raise it" links, collapsible AI tips, "Talk it through with the coach". |
| **Week strip** | 7 day tiles (date, weekday, dot if logged), prev/next week arrows, calendar picker, Today link. Future days disabled. |
| **Workout logger** | Exercise card: name, record badge, remove; target line; rows: Set # · Previous (w × r) · weight · reps · ✓. Done rows turn ok-soft. "+ Add set" copies the last set. Add-exercise search at bottom. |
| **Rest timer** | Floating plate bar above the tab bar: "REST 1:30", −15, +15, Skip, progress line; vibrates at zero. |
| **Chat** | User bubbles right (accent), coach bubbles left (surface + border), suggestion chips, sticky input with mic and send. |

## Accessibility checklist
- Every control has an accessible name; icon buttons have labels ("Speak to your coach").
- Charts have a text summary.
- Color is never the only signal (arrows and words accompany red and green).
- Touch targets ≥ 44pt; inputs ≥ 16pt text.
- Full screen reader pass on every screen before launch.

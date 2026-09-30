# FORGD (working name)

An all-in-one fitness and health app built around a player card. iPhone and Android, built with Expo (React Native) + TypeScript, with Supabase as the backend.

- **What we're building:** start with [CLAUDE.md](CLAUDE.md), then the docs in [docs/](docs/) in order.
- **Current work:** [docs/plans/](docs/plans/) holds the approved plan for each milestone.
- **Reference prototype:** open [prototype/forgd-v2.html](prototype/forgd-v2.html) in a browser.

## Run it

Needs Node.js 24 (LTS) and Git.

```bash
npm install
npm run go
```

Then scan the QR code with your phone's camera to open the app in **Expo Go** (phone and computer on the same Wi-Fi; add `-- --tunnel` if they are not). `npm run go` picks the computer's Wi-Fi address for the QR code and tells the bundler to use Expo Go's JavaScript database instead of the native one. On Windows PowerShell, use `npm.cmd` and `npx.cmd`.

For a development build (native database, Sign in with Apple), use `npm start` instead; see [docs/plans/milestone-1-foundation.md](docs/plans/milestone-1-foundation.md), step 9.

## Before pushing

```bash
npm run check
```

Runs type checks, lint and tests. GitHub runs the same checks on every push (the Check workflow).

| Command | What it does |
|---|---|
| `npm run go` | Start for testing in Expo Go on a phone |
| `npm start` | Start the dev server for a development build |
| `npm run typecheck` | TypeScript errors |
| `npm run lint` | Code style and common mistakes (auto-fix: `npx expo lint --fix`) |
| `npm test` | Unit tests (`npm run test:watch` while working) |
| `npx expo install <pkg>` | Add a package. Always use this instead of `npm install <pkg>`, so versions match the Expo SDK |
| `npm run db:push` | Apply new database changes in `supabase/migrations/` to the Supabase project |
| `npm run db:test` | Run the privacy tests in `supabase/tests/` against the Supabase project (changes are rolled back) |

## Database (Supabase)

One-time setup on each computer: `npx supabase login` (opens the browser), then `npm run db:link` (asks for the database password; keep it in a password manager, never in git or chat).

Change the database only by adding a new file to `supabase/migrations/` and running `npm run db:push`, never by editing tables in the dashboard, so every change is reviewed in git. Every table must have row-level security; `npm run db:test` fails if one does not.

## Layout

```
src/app/         screens (Expo Router: every file is a screen)
src/core/        pure logic shared with the server: units, log dates, XP, alerts
src/config/      brand name (in one place) and app settings
src/theme/       design tokens and fonts
src/components/  shared UI pieces
src/data/        local database, sync, Supabase client
supabase/        database migrations and server functions
docs/            product spec; design/screens/ has the reference images
```

## Rules that matter

- **Never commit secrets.** API keys and passwords go in `.env` files (ignored by git) or in Supabase's secret settings. The Claude API key never goes in the app at all.
- **The brand name lives only in** `src/config/brand.ts`. The final name is still pending.
- **Do not edit `ios/` or `android/`.** They are generated; configure native behavior in `app.config.ts`.
- **Expo changes every SDK release.** Check the docs for the SDK version in `package.json`, not memory or old blog posts. See [AGENTS.md](AGENTS.md).

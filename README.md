# CometPulse · ECS 2390 Group 13

A compact, survey-informed demonstration of crowdsourced CometNet observations at UT Dallas. Built with **Svelte 5, TypeScript, Bun, and Elysia**, with self-hosted **Lexend** typography and SQLite persistence.

## Run it

Install [Bun](https://bun.com/), then:

```sh
bun install --frozen-lockfile
bun dev
```

Open **http://localhost:4173**. One command starts Vite and the Elysia API. Development includes eight explicitly labeled synthetic sample observations; these are not survey records.

For a single-server build:

```sh
bun run build
DEMO_SEED=true bun start
```

Open **http://localhost:3000**. Omit `DEMO_SEED=true` for an empty community map. `PORT` and `DATABASE_PATH` are configurable; see `.env.example`. SQLite data is stored in `data/cometpulse.sqlite`, outside Git. Keep that directory on persistent storage if hosting the demo. This is a Bun server app, not a GitHub Pages-only site.

## What to demonstrate

1. Select ECSW on **Community demo**. Sample entries are clearly labeled.
2. Share a short update. The success panel gives immediate location-based feedback, and the map updates.
3. Open the site in a separate browser profile/private window. Reports are shared through the API; other visitors refresh every 10 seconds. Confirm another browser's report with **Same experience here**.
4. Switch to **Survey snapshot** to see the actual historical Q3 counts: ECSW 30, ECSN 15, ATEC 3, JSOM 2 (n = 50).
5. Open **The research** for question-level results, denominators, limitations, and a JSON export. The **Report to UTD OIT** link opens the official CometNet support page; this demo never creates an OIT ticket.

## Deliberate demo boundaries

- Reports are unverified community observations. Sample scenarios never stand in for research findings or official outage information.
- The map is a custom schematic informed by UTD's published campus map, not a routing or geolocation service. ATEC corresponds to the ATC building on the official map.
- A random browser cookie deduplicates confirmations. It does not verify student identity or represent unique people. A simple 30-report/browser/hour cap is not production abuse protection.
- Reports are visible for up to 4 hours and deleted after 24 hours on the next API access. Server responses expose neither the browser identifier nor an owner field. Do not put personal information in notes.
- SQLite is intended for one demo server. There are no accounts, push notifications, speed tests, moderation systems, or OIT integrations.
- **Clear my contributions** removes only the current browser's reports and confirmations. Exports contain unverified demo entries, including sample labels.

## Validate

```sh
bun run check
bun test
bun run build
```

The tests cover cross-browser sharing, duplicate/self-confirmation behavior, input validation, cross-origin writes, expiration, and survey denominators. GitHub Actions runs the same checks.

## Structure

- `src/App.svelte` — map, reporting flow, and research view
- `src/app.css` — responsive Lexend design
- `src/lib/survey.ts` — supplied aggregate survey results
- `src/lib/model.ts` — report aggregation and map locations
- `server/app.ts` — Elysia API and production static serving
- `server/store.ts` — Bun SQLite storage
- `docs/research-notes.md` — interpretation and source notes

Lexend is distributed under the SIL Open Font License; see `public/fonts/OFL.txt`.

# just-train.fit — front door

The marketing landing page for **Just Train**, an athlete-first training app. One static page now;
structured so a `/blog` can grow later. **This site contains no app code and no auth** — account
creation lives in the app at `app.just-train.fit`; the primary CTA just links there.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run verify     # typecheck + lint + test + build — the CI gate
```

Individual gates: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.

## Configure the waitlist

Copy `.env.example` → `.env` and fill it. The form POSTs straight to an email service; addresses
never touch the app DB. The active service is **Buttondown** (see
`discussions/ubiquitous-language.md`, Decision D2); **Kit** and **Formspree** are registered too.

To switch services, change one value — `PUBLIC_WAITLIST_SERVICE` — and set that service's id var.
Until a form id is set the hero/footer forms render a visible "waitlist opens soon" placeholder
rather than failing the build.

## Architecture

- `src/config/` — the single source of truth for copy (`content.ts`), links (`site.ts`), and the
  waitlist service registry (`waitlist.ts`).
- `src/lib/waitlist.ts` — the pure, unit-tested core that resolves `(registry + env)` into a form spec.
- `src/components/` — one `.astro` file per piece; `Logo` and `WorkoutFlowVisual` are **placeholder
  slots** for the two pending launch assets (the hero visual is a CSS-animated mock of the capture
  flow — select exercise → log a set → circuit → session complete → body map — until a real clip lands).
- `tests/` — Vitest over the pure core and content invariants.

## Deploy (Vercel)

- Root = this repo. Framework preset: **Astro**. Build `npm run build`, output `dist/`.
- Domain: apex **`just-train.fit`**; add `www.just-train.fit` and set it to **301 → apex** in the
  Vercel domain settings.
- **No API env** here — this site doesn't call the app's backend.

## Launch gates (still open)

- Real **logo/wordmark** SVG → drop into `src/components/Logo.astro`.
- Real **workout-capture clip** (screen recording ending on the body map) → drop into
  `src/components/WorkoutFlowVisual.astro` (replace the five `.frame` blocks with a `<video>`/`<img>`).
- Waitlist **form id** for the chosen service → `.env`.

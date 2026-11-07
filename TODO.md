# TODO — just-train.fit front door

**Last step (2026-11-07):** Landing is BUILT and GREEN. Scaffold + capture-first reframe (hero wedge E;
benefit arc capture → data model → augmentation) + animated `WorkoutFlowVisual` hero (CSS 5-frame
capture flow ending on the body map) — all committed + pushed, `npm run verify` green on the Mac.

**Next step:** user is doing the **two offline checklists** (assets + deploy). Nothing code-side is
blocked. When assets land, the code moves are small (see below).

**Read first on resume:**
1. Memory `just-train-landing-session-close` (the handover) + `just-train-landing-scaffold` (status).
2. `discussions/assets-checklist.md` and `discussions/deploy-dns-hosting-checklist.md` — the two open lists.
3. `discussions/ubiquitous-language.md` — domain vocabulary + Decisions (D1 superseded → capture-first).

> **Run boundary:** the Mac owns `node_modules` (shared `/workspace` mount). Run install/dev/verify on
> the Mac; do NOT `npm install` in-container. (memory: `just-train-landing-run-boundary`)
> **Commits:** I stage, you commit; no Co-Authored-By trailer.

## Open — offline checklists (assets/decisions, not code)
- `discussions/assets-checklist.md` — logo SVG, favicon set, workout-capture clip, OG image,
  Buttondown account+username, contact email.
- `discussions/deploy-dns-hosting-checklist.md` — Cloudflare DNS → Railway `app.just-train.fit` first,
  then Vercel apex → landing, `www` 301. App env/cookie/OAuth cutover = app repo.

## Small code moves waiting on those assets
- favicon `<link>` tags + `og:image` meta → `src/layouts/Base.astro` (both currently absent — can pre-wire).
- logo → `src/components/Logo.astro`; real clip → swap the 5 `.frame` blocks in
  `src/components/WorkoutFlowVisual.astro` for `<video autoplay muted loop playsinline>` + poster.
- `PUBLIC_BUTTONDOWN_USERNAME` → `.env` (flips the waitlist form from "opens soon" to live).

## Built (reference)
- Astro 5 static one-pager, `/blog`-ready. Swappable waitlist ESP registry (`src/config/waitlist.ts`)
  + pure unit-tested resolver (`src/lib/waitlist.ts`); Buttondown active, Kit/Formspree registered.
- Content single-source (`src/config/content.ts`); role-based design tokens; Vitest + ESLint + README.

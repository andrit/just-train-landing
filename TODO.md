# TODO — just-train.fit front door

**Last step:** Scaffolded the Astro landing end-to-end and passed the full gate
(`npm run verify`: typecheck 0 err · lint clean · 16/16 tests · build OK). Session 2026-11-05.

**Setup confirmed (2026-11-06):** Mac `npm install` + `npm run verify` green; `npm run dev` run and
the site viewed in a browser. Install/run boundary resolved.

**Next step:** `git init` + stage the scaffold for the first commit (staging is mine, commit yours),
then work the launch gates (assets, Buttondown username, Vercel) as they arrive.

> **Run boundary:** the Mac owns `node_modules` (shared `/workspace` mount). Run install/dev/verify
> on the Mac; do NOT `npm install` in-container. See memory `just-train-landing-run-boundary`.

**Read first on resume:**
1. `discussions/ubiquitous-language.md` — the domain vocabulary + Decisions D1–D5 (why Buttondown,
   why numberless founding framing, wedge 0).
2. `discussions/LANDING-BRIEF.md` — the original brief.
3. `README.md` — how to run, configure the waitlist, deploy.

## Done this session
- Astro 5 scaffold, static output, one page, `/blog`-ready.
- Functional core: swappable waitlist service registry (`src/config/waitlist.ts`) + pure resolver
  (`src/lib/waitlist.ts`), unit-tested. Buttondown active; Kit/Formspree registered.
- Content single-source (`src/config/content.ts`): wedge 0 lead, 3 benefit blocks, numberless
  founding copy, meta.
- Components: Hero, BenefitBlock, FoundingStrip, SiteHeader/Footer, WaitlistForm (degrades to
  "opens soon" placeholder until a form id is set), Logo + WorkoutFlowVisual **placeholder slots**
  (hero = CSS-animated capture-flow mock ending on the body map).
- Role-based design tokens echoing the app (near-black ground, ember-red accent, Barlow Condensed).
- Tests (`tests/`), ESLint flat config, README, `.env.example`.

## Launch gates still open (not code — assets/decisions)
- Real **logo SVG** → `src/components/Logo.astro`.
- Real **workout-capture clip** (screen recording ending on the body map) → `src/components/WorkoutFlowVisual.astro` (hero is currently a CSS-animated 5-frame placeholder of the capture flow).
- Buttondown **username** → `.env` (`PUBLIC_BUTTONDOWN_USERNAME`) to make the form live.
- **Git not initialized** in this repo yet — needed before Vercel import.
- Vercel: apex `just-train.fit` + `www` 301 → apex (dashboard, see README).

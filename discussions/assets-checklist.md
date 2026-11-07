# Checklist — assets to finish the landing page

> What's still needed to take `just-train.fit` from "built with placeholders" to launch-ready. Each
> item lists the spec and exactly where it drops in. Priority: **[Launch]** = needed for a real
> launch; **[Polish]** = ships fine without it, upgrade when you can. The page already *works* with
> placeholders — none of this blocks a preview deploy.

## Brand

- [ ] **[Launch] Logo / wordmark — SVG.**
  - Spec: an SVG that reads on the near-black ground (`#0D0D0D`). Provide the **horizontal wordmark
    lockup** ("Just Train") and, ideally, a **standalone mark** (reused for favicon + OG image).
    Transparent background; dark-ground variant required, light variant optional.
  - Drops into: `src/components/Logo.astro` (replace the placeholder `JT` mark + wordmark span).

- [ ] **[Launch] Favicon set.**
  - Spec: derived from the mark — an **SVG favicon**, a **32×32 PNG**, and a **180×180
    apple-touch-icon**.
  - Drops into: `public/` + a few `<link rel="icon">` tags in `src/layouts/Base.astro` (I'll wire the
    tags once the files exist — none are set yet).

## Hero visual

- [ ] **[Launch] Workout-capture clip** (the real version of the animated placeholder).
  - Content: the capture flow, in order — **select exercise → log a set → run a circuit → session
    complete → body map**, ending on the body map (the payoff).
  - Spec: **portrait 9:16** (matches the phone mock), ~1080×1920; **8–15s**; **muted, no audio
    track**; export **MP4 (H.264)** *and* **WebM (VP9/AV1)** for size; target **< ~2–3 MB**; it will
    autoplay-muted-loop-playsinline.
  - Also provide: a **poster image** (first frame or the body map) and a **reduced-motion still**
    (one representative frame) for viewers with motion reduced.
  - Drops into: `src/components/WorkoutFlowVisual.astro` — replace the five `.frame` blocks with a
    `<video autoplay muted loop playsinline poster=...>` (sources) + `<img>` fallback.
  - Note: the CSS-animated placeholder is on-brand and can ship as-is if the clip isn't ready.

## Social / sharing

- [ ] **[Launch] Open Graph image** — 1200×630 PNG/JPG.
  - Spec: wordmark + the tagline on the brand ground, ideally featuring the body map or a hero frame.
    The page already declares `og:`/`twitter:card summary_large_image` but has **no `og:image` yet**.
  - Drops into: `public/` + an `<meta property="og:image">` (and `twitter:image`) in `Base.astro`.

## Config / accounts (not visual, but required to be "finished")

- [ ] **[Launch] Buttondown account + username.**
  - Create the account and the list; set the **confirmation/welcome email**. Grab the username.
  - Drops into: `.env` → `PUBLIC_BUTTONDOWN_USERNAME` (flips the waitlist form from "opens soon" to
    live). Switching providers later is one value — `PUBLIC_WAITLIST_SERVICE`.

- [ ] **[Launch] Contact email** — a real monitored inbox/alias.
  - Currently the placeholder `hello@just-train.fit` in `src/config/site.ts`. Confirm or change.

- [ ] **[Launch] Legal pages reachable** — the footer links to `app.just-train.fit/privacy` and
  `/terms` (D5). Confirm those exist on the app (no asset needed here; just verify the links resolve
  after the domain cutover). See `deploy-dns-hosting-checklist.md`.

## Polish (nice-to-have)

- [ ] **[Polish] Self-hosted fonts.** Barlow Condensed (weights 500/600/700) is loaded from Google
  Fonts today. Self-host the `woff2` for perf + privacy → `public/fonts/` + update the `@font-face` /
  preload in `Base.astro`.
- [ ] **[Polish] Higher-fidelity hero frames** — real screenshots behind the phone mock if you keep
  any static framing.
- [ ] **[Polish] Decide the founding "— first N" slot** — copy supports adding a count later if you
  ever want urgency (currently numberless by D3).

---

**Not on this list (covered elsewhere):** domain/DNS/hosting → `deploy-dns-hosting-checklist.md`;
the lead headline/wedge and all page copy → decided, in `src/config/content.ts`.

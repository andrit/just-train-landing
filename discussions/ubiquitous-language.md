# Ubiquitous Language & Decisions — just-train.fit front door

> Foundation note (roadmap step 0). Names the domain concepts before building, and records the
> decisions settled in the first session (2026-11-05). Source of truth for copy lives in
> `src/config/content.ts`; this doc explains the *why*.

## Domain concepts (the shared vocabulary)

- **Front door** — the single marketing page at the apex `just-train.fit`. Not the app. Contains no
  auth, no account creation, no API calls.
- **Wedge** — the chosen angle for the hero lead. Five candidates (0/A/B/C/D) exist in config; exactly
  one is *active* and supplies the headline. Swapping the lead = changing one value.
- **Hero** — the top section: headline (from the active wedge) + sub-hook + **primary CTA** + the
  **waitlist** capture, beside the **body-map slot**.
- **Benefit block** — one of three value sections below the hero (neglect / glance / honest).
- **Founding group** — the small early cohort shaping v1. The **waitlist** *is* the invite list.
- **Waitlist** — email capture. The form POSTs straight to an external **waitlist service**; the
  address never touches the app DB.
- **Waitlist service (ESP)** — the external email provider the form targets. A *registry* of services
  with one *active* id, resolved by a pure function so a different provider is a one-line swap.
- **Primary CTA** — "Open the app" → `app.just-train.fit/register`. The only link into the product.
- **Logo slot** / **Body-map slot** — placeholder regions for the two pending launch assets (real
  wordmark SVG, real body-heat-map screenshot/clip). Built as slots, not baked-in.

## Decisions (session 2026-11-05)

- **D1 — Lead wedge = 0 (Progress).** Headline: *"A training app that tells you whether you're
  actually moving forward."* Sub-hook: *"It lights up the muscles you've trained — and the ones
  you've been skipping."* Other wedges kept in config as swappable alternates.
- **D2 — Active ESP = Buttondown; registry keeps others swappable.** Chosen over Kit and Mailchimp on
  three grounds weighed this session: (a) **data control** — Buttondown collects/tracks far less,
  of-a-piece with Just Train's honest, no-ads thesis; (b) **cost** — Kit gates drip+tagging behind
  ~$39/mo, while Buttondown's tagging + light sequences sit on much cheaper tiers (its only risk is a
  ~100-sub free cap, a volume step, not a feature paywall); (c) **voice** — Buttondown is the quiet,
  privacy-first sibling; Mailchimp/Intuit is the loud, extractive end. **Kit stays a candidate** — may
  win later if sign-ups are high or a real post-beta campaign (drips/segmentation) is wanted. The
  swap is a single config value (+ that service's form id), nothing else.
- **D3 — Founding framing, no number.** "Join the founding group" / "a small founding group." No hard
  count: it keeps the exclusivity signal without a dead-counter risk and stays on the under-selling
  voice. "Founding" is deliberate — it casts early users as co-creators, which implies a real
  contract (listen + iterate, durable acknowledgment, some grandfathering/perks). Honor that in the
  app; the page only writes the check. A "— first N" slot is left for later if urgency is wanted.
- **D4 — Logo + body-map are placeholder slots.** Real assets drop in without touching layout.
- **D5 — Footer /privacy, /terms point at the app domain** (the app already hosts them), configurable
  in `src/config/site.ts`. Keeps one canonical copy.

## Non-goals (explicit)

No login/signup/auth. No app API calls (`PUBLIC_API_URL` etc. absent by design). No social feed, no
analytics-ad pixels. One page now; structured so a `/blog` can grow later.

# LANDING-BRIEF — just-train.fit front door

> **Drop this at the root of the `just-train-landing` project.** It is self-contained: a fresh Claude
> session in that project can build the landing from this alone, no trainer-repo context needed.
> Authored 2026-11-05 from the Just Train content-marketing work.

## What you're building
A **single marketing page** at the apex **`just-train.fit`** (Astro; blog-ready to grow later). Its job:
1. Say what Just Train is, well, to someone seeing the link for the first time (incl. beta recruits).
2. Capture **waitlist emails**.
3. Send ready users to the app.

**The app itself lives at `app.just-train.fit`** — this site does NOT contain the app or any auth.
**Do not build login/signup here.** Account creation happens in the app (its refresh cookie is
domain-scoped to `app.`). Primary CTA just links out to `https://app.just-train.fit/register`.

## The product (context for voice + copy)
**Just Train** is an athlete-first training PWA. Thesis: **Capture → Compare → Communicate** — every
screen answers *"is this person moving forward?"* It's not a logging ledger; it turns logged sets into
a picture of progress. Differentiators (all real, shipped): a **body heat-map** that shows which
muscles you've trained and which you've been neglecting; **colour + icon coding** so you can read a
session's shape at a glance; a design philosophy of **honest representation** (it never flatters your
numbers — a light week shows up light). Offline-first; no social feed, no ads.

## Hero — recommended lead (swap the wedge in one place)
**Headline (recommended):** *A training app that tells you whether you're actually moving forward.*
**Sub-hook (the visceral proof):** *It lights up the muscles you've trained — and the ones you've been
skipping.*
Pairs the meaning (wedge 0) with the concrete, demo-able hook (wedge B). **To swap the lead, pick a
different wedge below — it's the only line that changes.**

### Wedge options (if you want a different lead)
- **0 · Progress** — "…tells you whether you're actually moving forward." *(recommended)*
- **A · Glanceable** — "See your training. Don't read it."
- **B · Whole-body** — "Train everything — not just the mirror."
- **C · Craft** — "A training app built like a good tool."
- **D · Tool, not platform** — "Your training. Offline. No feed, no ads."

## One-liner bank (for subheads / benefit bullets / meta description)
1. A training app that answers one question: *are you actually moving forward?*
2. Every set you log lights up the muscles you worked — and greys out the ones you've been skipping.
3. Read your whole session at a glance: colour says what *kind* of work, the figure says *where* it landed.
4. Capture your training, compare it over time, see the story your logs are telling.
5. Most trackers are spreadsheets with a rest timer. This one has a point of view.
6. A logbook you look *at*, not just write *in*.
7. Find out which muscles you've quietly been avoiding for three weeks.
8. Built like a good piece of gym equipment — nothing extra, nothing that breaks.
9. Your training, on your phone, offline — no feed, no ads.
10. It never flatters your numbers. A light week shows up light.

## Page structure (one page, top → bottom)
1. **Hero** — headline + sub-hook + **primary CTA "Open the app"** (→ `app.just-train.fit/register`) +
   **waitlist email field** ("Join the beta — N founding spots"). A product visual (body map) beside/below.
2. **Three benefit blocks** (one each, pull copy from the one-liners):
   - **See what you're neglecting** — the body heat-map (#2/#7).
   - **Read your session at a glance** — colour + icon coding (#3).
   - **Honest tracking** — no flattery, no feed, offline (#10/#9).
3. **Founding-beta strip** — "Shaping v1 with a small founding group. Join the waitlist for an invite."
   (ties to the beta plan; the waitlist IS the invite list.)
4. **Footer** — links to `/privacy`, `/terms` (the app already has these), a one-line about, contact.

## CTAs + waitlist
- **Primary:** "Open the app" / "Get started" → `https://app.just-train.fit/register`.
- **Waitlist:** email field → an **email-list service** (Buttondown / ConvertKit / Formspree). **Keep
  it OFF the app DB** — the form POSTs straight to the service; the list doubles as the beta-invite
  sender. *(Pick the service before beta — sub-decision.)*
- No other interactive state; no auth.

## Brand + look (make it feel of-a-piece with the app)
- **Wordmark:** "Just Train" as a **placeholder** — real logo/wordmark SVG is pending (a launch gate).
  Build so the logo drops in later (a slot, not baked-in).
- **Design language to echo** (from the app): near-black ground (`#0D0D0D`), card surface `#1E1E1E`,
  a crosshatch texture motif, **Barlow Condensed** for display headings (gym-poster energy), clean
  sans for body. Accent: the app's command-blue / ember-red (`#D91B1B`) — use sparingly. The landing
  should feel like the app's quiet, honest sibling, not a loud SaaS splash.
- **Visual:** the **body heat-map** is the screenshot-ready differentiator — use a real screenshot or a
  short clip of it as the hero visual (placeholder until you have the asset).

## Voice
Plain, confident, honest — the app's own voice. No hype, no "revolutionary." Short sentences. It
earns trust by *under*-selling (see one-liner #10).

## Tech / deploy (detail in the workbench runbook `task-plan-landing-project-setup.md` → #30)
- **Astro**, one page now, structured so a `/blog` can grow later.
- Vercel project (root = this repo) → domain **apex `just-train.fit`**, `www` → 301 to apex.
- **No API env here** (no `VITE_API_URL`, no proxy) — this site doesn't call the app's API; signup is
  in the app.
- The app's domain/env cut-over (`app.just-train.fit`, Railway `CORS_ORIGIN`/`APP_URL`) is the app
  project's job, covered in #30 — not this repo's.

## Still-open (fill as you build)
- Which **wedge** leads (default = 0; above).
- Which **waitlist service**.
- **N founding spots** number.
- Real **logo** + **body-map asset**.

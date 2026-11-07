# Checklist — move the app to `app.just-train.fit` and host the landing at the apex

> A migration runbook. Order matters: we **stand up the app on its new subdomain first**, verify it,
> then repoint the apex to the landing — so the app is never offline during the switch.
>
> **Assumptions (correct before you start):**
> - DNS is managed in **Cloudflare**.
> - The **app** is hosted on **Railway**; the **landing** deploys to **Vercel**.
> - The app may currently be served at the apex `just-train.fit` (if so, see the redirect note in Phase 4).
> - The app's refresh cookie must be scoped to **`app.just-train.fit`** (host-only), NOT `.just-train.fit`,
>   so the apex/landing never receives it.
>
> **Platform specifics** (IPs / CNAME targets) change — always use the exact value each dashboard
> shows you rather than trusting a value written here.

---

## Phase 0 — Prep
- [ ] Confirm you control the Cloudflare zone for `just-train.fit` and have admin on the Railway + Vercel projects.
- [ ] Note the app's **current** public URL (apex? a `*.up.railway.app` URL?) — determines whether redirects are needed later.
- [ ] Lower the TTL on any record you're about to change to ~5 min (300s) a few hours ahead, so cutover propagates fast.
- [ ] Decide Cloudflare proxy posture: **start DNS-only (grey cloud)** for both the Vercel and Railway records (below). Proxying (orange cloud) in front of Vercel/Railway invites TLS/redirect loops unless carefully configured; enable it later if you want Cloudflare's CDN/WAF, with SSL mode **Full (strict)**.

## Phase 1 — Stand up the app on `app.just-train.fit` (app stays live on its current URL)
- [ ] In **Railway** → the app service → **Settings → Networking → Custom Domain**, add `app.just-train.fit`.
- [ ] Railway shows a **CNAME target** (e.g. `<id>.up.railway.app`). Copy it.
- [ ] In **Cloudflare DNS**, add: `CNAME` **app** → *(the Railway target)*, **Proxy status: DNS only (grey cloud)**.
- [ ] Wait for Railway to show the domain as **Active** and issue its TLS cert (can take a few minutes).
- [ ] Verify: `https://app.just-train.fit` loads the app over valid HTTPS. (`dig app.just-train.fit`, then load in a browser.)

## Phase 2 — Cut over the app's config, then verify login (app repo — this is #30's territory)
- [ ] Set the app's env on Railway:
  - [ ] `APP_URL` (public base URL) → `https://app.just-train.fit`
  - [ ] `CORS_ORIGIN` → include `https://app.just-train.fit` (and `https://just-train.fit` only if the landing ever calls the API — it does not today)
  - [ ] Any other absolute-URL env (email links, callbacks) → the new subdomain.
- [ ] **Cookie domain:** confirm the refresh/session cookie sets `Domain=app.just-train.fit` (host-only), `Secure`, `SameSite=Lax` (or `Strict`). It must NOT be `.just-train.fit`.
- [ ] **OAuth (if used, e.g. Google):** add the new redirect/callback URIs under `https://app.just-train.fit/...` in the provider console (Google Cloud → Credentials), and the new JavaScript origin `https://app.just-train.fit`. Keep the old ones until cutover is done.
- [ ] Redeploy the app so the new env takes effect.
- [ ] **Verify end-to-end on the new subdomain:** register/login works, the session cookie is set on `app.just-train.fit`, a refresh/token renewal succeeds, OAuth round-trips.

## Phase 3 — Deploy the landing to Vercel (verify before any apex DNS change)
- [ ] Push this repo to its Git remote; import it into **Vercel** (Framework preset: **Astro**, build `npm run build`, output `dist/`).
- [ ] Set the landing's env in Vercel: `PUBLIC_WAITLIST_SERVICE=buttondown`, `PUBLIC_BUTTONDOWN_USERNAME=<your-handle>` (flips the form from the "opens soon" placeholder to live). No API env.
- [ ] Verify the build succeeds and the page renders on the Vercel preview URL (`*.vercel.app`): hero, benefit blocks, founding strip, CTA → `app.just-train.fit/register`, footer links.

## Phase 4 — Point the apex + `www` at the landing (the actual cutover)
- [ ] In **Vercel** → the landing project → **Settings → Domains**, add `just-train.fit` and `www.just-train.fit`. Vercel shows the exact records to create and marks them valid once DNS matches.
- [ ] In **Cloudflare DNS**, for the **apex** `just-train.fit`:
  - [ ] Add the record Vercel specifies — typically `A` **@** → `76.76.21.21` (Cloudflare flattens), or a `CNAME` **@** → `cname.vercel-dns.com` via CNAME flattening. **Proxy: DNS only (grey cloud).**
  - [ ] Remove/replace any old apex record that pointed at the app.
- [ ] For **`www`**: `CNAME` **www** → `cname.vercel-dns.com`, **DNS only**. In Vercel, set **`www` → redirect (301) to `just-train.fit`**.
- [ ] **If the app used to live at the apex:** add a redirect so old deep links don't 404 on the landing — either a Cloudflare Redirect Rule (`just-train.fit/app/*` or the old app paths → `app.just-train.fit/...`) or accept that only known paths need handling. Decide and implement.
- [ ] Wait for propagation (TTL you lowered in Phase 0). Confirm Vercel shows both domains **valid** with issued certs.

## Phase 5 — Go-live verification & rollback
- [ ] `https://just-train.fit` serves the **landing** over valid HTTPS; `https://www.just-train.fit` 301s to the apex.
- [ ] `https://app.just-train.fit` still serves the **app**; login + refresh still work (the cookie is on `app.`, unaffected by the apex change).
- [ ] From the landing, the primary CTA opens `https://app.just-train.fit/register`.
- [ ] Waitlist form submits to Buttondown (test with a real address; confirm it lands in the Buttondown list).
- [ ] No mixed-content or CORS errors in the browser console on either site.
- [ ] `dig`/`nslookup` apex, `www`, and `app` all resolve to the intended targets.
- [ ] **Rollback plan:** if the apex cutover misbehaves, revert the apex/`www` DNS records to the previous target (TTL is low, so it's quick). The app subdomain is independent and unaffected.

## Post-cutover (optional)
- [ ] Restore normal TTLs.
- [ ] If you want Cloudflare's CDN/WAF in front, flip records to **proxied (orange)** one at a time with SSL mode **Full (strict)**, re-verifying each.
- [ ] Remove the app's old OAuth redirect URIs and any old-domain env once nothing uses them.
- [ ] Pin the launch-gate items still open: real logo SVG, real body-map asset (both in this repo).

# AGENTS.md — CTA ecosystem operating guide

**This file is the source of truth for running the Christian Transhumanist Association (CTA) digital ecosystem.** Any agent — Codex, Claude, or other — picking up CTA work starts here. It covers the website, Google Ads, page creation/writing, deployment, and the membership funnel, and points to the deeper docs for each.

> Maintained as the agent-facing index. Human dev setup is in `README.md`; this file is the *operations + orchestration* layer. Cross-system context (how CTA fits the broader infra) lives in the owner's vault at `~/Dropbox/1/Notational/agent-framework/INFRA/FLEET.md` (§Off-fleet systems) — but **this directory is the source of truth for the CTA project itself.**

## 1. What the ecosystem is — the funnel

CTA's growth runs as one funnel; the pieces move together:

```
Google Ad Grant (acquisition)
   → CTA site landing pages  /topics/*  +  /join/*   (this repo → Netlify → christiantranshumanism.org)
   → conversion tracking  (GA4 `membership_signup_intent` + Google Ads `Membership`)
   → Mailchimp (free membership)  /  Stripe (voting membership)
   → measurement: cta-report.js  (Mailchimp members + Stripe subs → reporting sheet)
```

**Imperative:** drive *qualified* membership intent — turn ad clicks into confirmed free/voting members — and prove it converted. Optimizing ads is pointless if the site's conversion tags aren't firing; they are one system.

## 2. The website (this repo)

- **Stack:** [Eleventy](https://www.11ty.dev/) 3.x static site, **Node 22+**. Source in `src/`. Output in `_site/` (generated — never edit).
- **Repo:** `git@github.com:christian-transhumanism/site.git` (branch `main`). Local clone: `~/Sites/cta-site`.
- **Deploy:** **Netlify, auto-deploy on push to `main`.** A push triggers a build + publish to **https://www.christiantranshumanism.org**.
  - **Known failure mode:** the Netlify connector occasionally **500s on upload**, and freshly-pushed `/…/` pages can **404 until the deploy settles**. After pushing, verify the live URL returns 200 before relying on it or wiring ads to it.
- **Local dev:** `npm install` once, then `npm run dev` (→ http://localhost:8080, skips remote feeds) or `npm run dev:remote` (live feeds). Production check: `npm run build` (offline-safe, uses `.cache/`).
- **Key structure:**
  - `src/join/` — `free.njk`, `voting.njk`, `future.njk` — the **conversion handoff pages** (kept on-domain long enough to fire tracking, then redirect to Mailchimp/Stripe). **Do not** add raw external redirects that bypass tracking.
  - `src/topics/` — informative landing pages that ad groups route to (e.g. `ai-human-flourishing`, `brain-computer-interfaces`, `radical-longevity`, `dominion-and-the-future-of-values`, `is-religion-rational`).
  - `src/cta-wiki/` — an Obsidian vault mirrored into `/wiki/` + `/board/`; also holds blog posts (`tags: post`). See `README.md` for the wikilink/permalink rules.
  - `src/_includes/` layouts, `src/_data/` global data, `src/_redirects.njk` / `src/_headers.njk`.

## 3. Page creation & writing

- **Topic pages** are written in CTA's voice via the **`/cta-page` skill** (defined in `~/Dropbox/1/Notational/.claude/skills/cta-page/`, with companion `VOICE.md` + `BACKLOG.md`). It produces an **unsigned, informative `/topics/<slug>/` page** and delivers it as a **git branch + PR** for review — it does not push to `main` directly.
- **Voice/guardrails:** informative, not preachy; unsigned (no personal byline); routes readers to `/join/future`, `/join/free`, `/join/voting`. Content/messaging strategy for the homepage lives in the vault: `~/Dropbox/1/Notational/00_Project_CTA_Homepage.md`.
- **The hero / messaging layer** (problematization-forward, "AI could remake the world — or end it", Expansive Human Futures) is locked in `00_Project_CTA_Homepage.md`. Keep "transhumanism" below the fold; "apologetics" is used deliberately (do not soften).

## 4. Google Ads ($10k/mo Ad Grant)

The grant is **use-it-or-lose-it** — unspent budget is wasted. **Operated by Codex** today (incl. a `weekly-cta-google-ads-growth-review` automation). **Source-of-truth docs in `docs/`:**

- **`docs/google-ads-operations.md`** — account + navigation working notes. **CTA Google Ads customer ID: `459-256-2474`.**
- **`docs/google-ads-growth-plan.md`** — the operating plan (north star = qualified membership intent: views → free signups → paid memberships).
- **`docs/google-ads-thinker-topic-map.md`** — campaign → thinker/topic → landing-page map + the operating rules.

**Hard guardrails (compliance — a violation can suspend the grant):**
- Use **Search intent + contextual landing pages**, not custom audiences or remarketing by religion.
- **Never** write ad copy implying the visitor has a religious identity, belief, medical status, disability, or political identity.
- Don't enable dynamic images without confirmed rights to all landing-page images.

## 5. Integrations & conversion tracking

- **Free membership → Mailchimp; voting membership → Stripe.** Access notes (env vars, how each is counted) live in the vault: `~/Dropbox/1/Notational/agent/capabilities/cta-integrations-access.md`. Secrets are in `agent/.env` there — never inline.
- **Conversion tags:** GA4 `membership_signup_intent` + Google Ads `Membership`, fired on the `/join/*` handoff pages. **Open gap:** the conversion currently counts *intent / outbound handoff*, **not** confirmed Mailchimp/Stripe completion — so the growth metric is a proxy. Closing it (a completion webhook) is the highest-leverage funnel improvement.
- **Measurement:** `~/Dropbox/1/Notational/agent/tools/cta-report.js` pulls Mailchimp members + Stripe active subs into the ED-report sheet (Facebook + Google Ads columns still hand-entered).

## 6. Who operates what — and how to hand off

- **Codex** runs the **live funnel**: Google Ads changes, site deploys, growth work. It has the Ads auth and the live-site context.
- **The `/cta-page` skill** writes topic pages (branch + PR).
- **The vault's Claude agent** (in `~/Dropbox/1/Notational`) holds the cross-system map and **hands CTA tasks off** to the above. When it has a CTA task, it: (a) writes it up referencing this file, (b) routes Ads/deploy/live-funnel work to Codex, (c) routes new-topic-page writing to `/cta-page`. It does **not** make live Ads changes or push to the site `main` itself.

**Common tasks → where they go:**
| Task | Owner / how |
|---|---|
| New topic landing page | `/cta-page` skill → PR |
| Ad campaign / keyword / bid changes | Codex (live Ads), per `docs/` |
| Deploy / verify a page is live | push to `main` → Netlify; verify URL 200 |
| Conversion-tag / funnel wiring | Codex; keep `/join/*` tracking intact |
| Membership numbers | `cta-report.js` (vault) |

## 7. Guardrails recap
- Don't break `/join/*` conversion tracking or the Stripe voting path.
- Verify Netlify deploys actually went live (200) — the connector is flaky.
- Respect the Ads compliance rules in §4 — the grant is the kill-switch.
- Secrets stay in the vault's `agent/.env`; never commit credentials here.

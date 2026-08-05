# AGENTS.md — CTA ecosystem operating guide

**This file is the source of truth for running the Christian Transhumanist Association (CTA) digital ecosystem.** Any agent — Codex, Claude, or other — picking up CTA work starts here. It covers the website, Google Ads, page creation/writing, deployment, and the membership funnel, and points to the deeper docs for each.

> Maintained as the agent-facing index. Human dev setup is in `README.md`; this file is the *operations + orchestration* layer. **This repo is the source of truth for the CTA project.**

**Mission: this repo is a standalone, self-documenting project for running the CTA.** Four layers: (1) the public site, (2) the quasi-public board wiki, (3) succession + task docs in `docs/` (never compiled to the site), (4) this AI operating layer. The map is `docs/README.md`; continuity is `docs/succession-plan.md`. An agent's job here is not only to execute tasks but to **coach newcomers** (walk a new operator through `docs/README.md` → this file → `docs/backlog.md`) and to **keep these docs true** — when you learn something operational that isn't written down, write it down.

**Standalone rule:** this repo is CTA-facing and must be handoff-ready — a successor (e.g. the CTA VP) with only this repo + Bitwarden access must be able to carry on. Never make a doc here depend on the current operator's private notes, machines, or personal agent infrastructure. Where something *currently* runs on operator-side infrastructure, say so and track it as a migration item in `docs/succession-plan.md` §6.

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
- **Repo:** `git@github.com:christian-transhumanism/site.git` (branch `main`).
- **Deploy:** **Netlify, auto-deploy on push to `main`.** A push triggers a build + publish to **https://www.christiantranshumanism.org**.
- **Podcast pages (`/podcast/<n>/`):** generated at build time from the show's RSS feed (`https://brickcaster.com/christiantranshumanist.rss`, hydrated by `src/_data/podcast.js`). The feed is owned by the separate `micahredding/brickcaster` repo — when a new episode lands there, these pages appear on this site's **next deploy**; push an empty `chore: rebuild` commit to `main` to trigger one immediately.
  - **Known failure mode:** the Netlify connector occasionally **500s on upload**, and freshly-pushed `/…/` pages can **404 until the deploy settles**. After pushing, verify the live URL returns 200 before relying on it or wiring ads to it.
- **Local dev:** `npm install` once, then `npm run dev` (→ http://localhost:8080, skips remote feeds) or `npm run dev:remote` (live feeds). Production check: `npm run build` (offline-safe, uses `.cache/`).
- **Key structure:**
  - `src/join/` — `free.njk`, `voting.njk`, `future.njk` — the **conversion handoff pages** (kept on-domain long enough to fire tracking, then redirect to Mailchimp/Stripe). **Do not** add raw external redirects that bypass tracking.
  - `src/topics/` — informative landing pages that ad groups route to (e.g. `ai-human-flourishing`, `brain-computer-interfaces`, `radical-longevity`, `dominion-and-the-future-of-values`, `is-religion-rational`).
  - `src/cta-wiki/` — an Obsidian vault mirrored into `/wiki/` + `/board/`; also holds blog posts (`tags: post`). See `README.md` for the wikilink/permalink rules. **Content dependency:** a large share of the live site's content is this wiki (**491 notes**), and **~176 are stubs (<~400 bytes) — completing them is standing work** (`docs/backlog.md` → Content; find them with `find src/cta-wiki -name "*.md" -size -400c | grep -v templates`). *Undocumented:* where the *source* Obsidian vault lives and how it syncs into `src/cta-wiki/` — record that pipeline when known.
  - `src/_includes/` layouts, `src/_data/` global data, `src/_redirects.njk` / `src/_headers.njk`.

## 3. Page creation & writing

- **Topic pages** are written in CTA's voice via the **`/cta-page` skill** — defined **in this repo** at `.claude/skills/cta-page/` (with companion `VOICE.md` + `BACKLOG.md`). It produces an **unsigned, informative `/topics/<slug>/` page** and delivers it as a **git branch + PR** for review — it does not push to `main` directly.
- **Voice/guardrails:** informative, not preachy; unsigned (no personal byline); routes readers to `/join/future`, `/join/free`, `/join/voting`. The full voice reference is `.claude/skills/cta-page/VOICE.md`.
- **The hero / messaging layer** (problematization-forward, "AI could remake the world — or end it", Expansive Human Futures) is locked in **`docs/homepage-messaging.md`**. Keep "transhumanism" below the fold; "apologetics" is used deliberately (do not soften).

## 4. Google Ads ($10k/mo Ad Grant)

The grant is **use-it-or-lose-it** — unspent budget is wasted. Operated by **an AI agent with Ads-account auth, run by the ED** (including a weekly growth-review automation). *That automation currently runs on the ED's personal infrastructure — a migration item in `docs/succession-plan.md` §6; the docs below are written so any agent with Ads access can resume.* **Source-of-truth docs in `docs/`:**

- **`docs/google-ads-current-state.md`** — start here for the current Ads resume point: account/campaign IDs, recent changes, pending reviews, live landing pages, and next actions.
- **`docs/google-ads-operations.md`** — account + navigation working notes. **CTA Google Ads customer ID: `459-256-2474`.**
- **`docs/google-ads-growth-plan.md`** — the operating plan (north star = qualified membership intent: views → free signups → paid memberships).
- **`docs/google-ads-thinker-topic-map.md`** — campaign → thinker/topic → landing-page map + the operating rules.

**Hard guardrails (compliance — a violation can suspend the grant):**
- Use **Search intent + contextual landing pages**, not custom audiences or remarketing by religion.
- **Never** write ad copy implying the visitor has a religious identity, belief, medical status, disability, or political identity.
- Don't enable dynamic images without confirmed rights to all landing-page images.

## 5. Integrations & conversion tracking

- **Free membership → Mailchimp; voting membership → Stripe.** How each is wired and counted: **`docs/integrations.md`**. **Credentials live in Bitwarden** — never in this repo.
- **Conversion tags:** GA4 `membership_signup_intent` + Google Ads `Membership`, fired on the `/join/*` handoff pages. **Open gap:** the conversion currently counts *intent / outbound handoff*, **not** confirmed Mailchimp/Stripe completion — so the growth metric is a proxy. Closing it (a completion webhook) is the highest-leverage funnel improvement.
- **Measurement:** a small report script (`cta-report.js`) pulls Mailchimp members + Stripe active subs into the ED-report sheet (Facebook + Google Ads columns still hand-entered). Details + its known weekly-auth failure: `docs/integrations.md`. *Currently runs on the ED's machine — migration item.*

## 6. Who operates what — and how to hand off

Think in **roles**, not specific tools — any capable agent (or human) holding the right access can fill each one:

- **Funnel operator** — runs the live funnel: Google Ads changes, site deploys, growth work. Needs Ads-account auth (via Bitwarden) and the `docs/google-ads-*.md` context. *Currently: an AI agent run by the ED.*
- **Page writer** — the in-repo `/cta-page` skill writes topic pages (branch + PR); it never merges or deploys.
- **Coordinator** — whoever routes work: writes the task up referencing this file, sends live-Ads/deploy work to the funnel operator, sends new-topic-page writing to `/cta-page`. The coordinator does **not** make live Ads changes or push to `main` itself.

**Open project tasks / backlog:** `docs/backlog.md` — the canonical surfaced-work list (email-platform/Mailchimp decision, the intent→confirmed conversion webhook, Netlify reliability, orchestration). Check it before picking up CTA work.

**Common tasks → where they go:**
| Task | Owner / how |
|---|---|
| New topic landing page | `/cta-page` skill → PR |
| Ad campaign / keyword / bid changes | funnel operator (live Ads), per `docs/google-ads-*.md` |
| Deploy / verify a page is live | push to `main` → Netlify; verify URL 200 |
| Conversion-tag / funnel wiring | funnel operator; keep `/join/*` tracking intact |
| Membership numbers | `cta-report.js` — see `docs/integrations.md` |

## 7. Guardrails recap
- Don't break `/join/*` conversion tracking or the Stripe voting path.
- Verify Netlify deploys actually went live (200) — the connector is flaky.
- Respect the Ads compliance rules in §4 — the grant is the kill-switch.
- Secrets live in **Bitwarden**; never commit credentials here. Automation may hold working copies in a local gitignored `.env`, but Bitwarden is canonical.
- Keep the repo standalone: no dependence on the current operator's private notes or machines (see the Standalone rule at the top).
- Board material is quasi-public and belongs in `src/cta-wiki/board/`; operational docs that shouldn't be served at all belong in `docs/` (which never compiles to the site).

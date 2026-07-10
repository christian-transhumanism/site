# CTA documentation map

**Mission: this repo is a standalone, self-documenting project for running the Christian Transhumanist Association.** Anyone — a successor (e.g. the CTA VP), a new volunteer, or an AI agent — should be able to carry on from this repo plus Bitwarden access alone, with no access to the current operator's private notes or infrastructure.

The documentation has four layers, with different visibility:

| Layer | What | Where | Visibility |
|---|---|---|---|
| 1 | The public site | `src/` → built to `_site/` → christiantranshumanism.org | Public |
| 2 | The internal wiki: board meetings + board information | `src/cta-wiki/board/` → `/board/*` pages | Quasi-public (published but noindexed, hidden from search/backlinks, not in sitemap — findable only if you have the URL) |
| 3 | Succession plan + operational task docs | `docs/` (this directory) | Repo-only (never compiled — Eleventy's input dir is `src/`) |
| 4 | AI operating guide: how an agent executes all of this, coaches newcomers, and runs the succession plan | `AGENTS.md` (index) + `docs/` + `.claude/skills/` (e.g. the `/cta-page` page-writing skill) | Repo-only |

## Contents of `docs/`

- [succession-plan.md](succession-plan.md) — continuity plan: systems inventory, access, cadence, what a successor does first, operator-infra migration list.
- [backlog.md](backlog.md) — canonical open-work list for the CTA project.
- [integrations.md](integrations.md) — Mailchimp/Stripe wiring, how the official membership numbers are counted, reporting.
- [legal.md](legal.md) — incorporation, officers, EIN/tax status, banking pointers (treasurer).
- [homepage-messaging.md](homepage-messaging.md) — the locked homepage messaging strategy (hero copy, skeleton, design direction).
- [google-ads-current-state.md](google-ads-current-state.md) — Ads resume point: IDs, recent changes, next actions.
- [google-ads-operations.md](google-ads-operations.md) — Ads account + navigation working notes.
- [google-ads-growth-plan.md](google-ads-growth-plan.md) — the Ads operating plan.
- [google-ads-thinker-topic-map.md](google-ads-thinker-topic-map.md) — campaign → topic → landing-page map.

## Ground rules

- **This repo is CTA-facing and standalone.** No private-to-the-operator information, and no load-bearing references to the operator's personal notes, machines, or agent infrastructure. Where something currently runs operator-side, the doc says so and `succession-plan.md` §6 tracks migrating it.
- **Secrets live in Bitwarden, never in this repo.** No credentials, API keys, or tokens in any file here — docs reference *which* Bitwarden entry to use, not the value.
- **Board material lives in the wiki** (`src/cta-wiki/board/`), not in `docs/` — it is quasi-public by design. `docs/` is for operational material that shouldn't be served at all.
- **`docs/` and `AGENTS.md` never compile to the public site.** If you add operational docs, put them here, not under `src/`.
- Human dev setup for the site itself is in the repo root [README.md](../README.md).

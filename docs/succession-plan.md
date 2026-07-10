# CTA succession plan

**Purpose:** if the current operator (Micah Redding) is unavailable — temporarily or permanently — this document lets a successor (human, assisted by an AI agent reading `AGENTS.md`) take over running the CTA's digital operations without archaeology.

Items marked **❑ NEEDS OWNER INPUT** are gaps only Micah can fill. Filling them is the standing work of this document.

---

## 1. Access — start here

**All credentials live in Bitwarden.** Nothing in this repo or the wiki contains secrets.

- ❑ NEEDS OWNER INPUT: which Bitwarden account/organization/collection holds CTA credentials, and how a successor gains access to it (emergency access grant? shared org? a board member with access?).
- ❑ NEEDS OWNER INPUT: who besides Micah currently has admin access to each system below.
- The recovery root for most services is **admin@christiantranshumanism.org** (Google Workspace). Whoever controls that mailbox can recover most other accounts — securing succession to Google Workspace admin is the single most important step.

## 2. Systems inventory

What the CTA runs on. The wiki's [[CTA Admin Accounts]] note (`src/cta-wiki/board/CTA Admin Accounts.md`) has the fuller social-accounts list; entries below are the operationally critical core.

| System | Purpose | Notes |
|---|---|---|
| Google Workspace (admin.google.com) | Org email, admin@ account, Google for Nonprofits | Root of account recovery. Nonprofit status gates the Ad Grant. |
| Namecheap (account: **micahreddingcta**) | All domains (christiantranshumanism.org + ~12 others) | A dedicated CTA account, separate from the ED's personal Namecheap. Renewal lapse = site + email outage. ❑ confirm auto-renew + payment method. |
| GitHub `christian-transhumanism` org | This repo (`site`, branch `main`) | Push to `main` auto-deploys. |
| Netlify | Hosts the site; auto-deploy on push to `main` | Known-flaky uploads — verify pages return 200 after deploy. |
| Google Ads (customer ID 459-256-2474) | $10k/mo Ad Grant — use-it-or-lose-it | See `google-ads-*.md` in this directory. Compliance violations can suspend the grant (see `AGENTS.md` §4). |
| GA4 | Analytics + `membership_signup_intent` conversion | Paired with the Ads `Membership` conversion. |
| Mailchimp | Free-membership list + email sends (~$45/mo, pause/unpause toil) | See backlog — platform under evaluation. |
| Stripe | Voting-membership subscriptions | Revenue-critical; don't break the `/join/voting` path. |
| Cloudinary | Image CDN for the site | Account: christian-transhumanist-association. |
| Social accounts | Facebook, Twitter/X, Discord, Telegram, Instagram, Reddit, YouTube, etc. | Full list in wiki [[CTA Admin Accounts]]. ❑ that note predates the Eleventy site (still lists Heroku/Roam) — audit which entries are live. |

## 3. Operating cadence — what has to keep happening

| Rhythm | Task | How |
|---|---|---|
| Continuous | Netlify deploys on push; verify live URLs return 200 | `AGENTS.md` §2 |
| Weekly | Google Ads growth review (currently an automation on the ED's infrastructure — see §6) | `docs/google-ads-current-state.md` is the resume point |
| Weekly | Re-auth of `cta-report.js` measurement (OAuth app in testing mode → token dies every 7 days) | backlog `[risk]` — fix by publishing the OAuth app |
| Monthly | Mailchimp pause/unpause around sends | backlog — being replaced by platform decision |
| Ongoing | Board meetings → notes into `src/cta-wiki/board/meetings/` | Quasi-public by design |
| Annual | **TN Annual Report — due April 1** (~$20, TNBEAR) + **IRS Form 990-N** | `legal.md` → Recurring filings |
| Annual-ish | Domain renewals, nonprofit re-verification | ❑ confirm dates/status |

## 4. Who operates what today

- **Micah Redding (Executive Director)** — everything digital, ultimately. State-required officers: chair, secretary, treasurer (see `legal.md` and wiki [[Board members]]).
- **Emily Redding (Treasurer, since 2014)** — banking and finances flow through her; a successor gets banking information from the treasurer (see `legal.md`).
- **Funnel-operator AI agent** (run by the ED) — live Google Ads changes, deploys, growth work (has Ads auth).
- **`/cta-page` skill** (in this repo, `.claude/skills/cta-page/`) — writes new `/topics/*` pages as PRs.
- **Board** — listed in wiki [[Board members]]. ❑ which board members could/should assume operations, and what have they agreed to?

## 5. If succession is triggered

1. **Gain access:** Bitwarden (§1) → Google Workspace admin → everything else recovers from there.
2. **Read, in order:** `docs/README.md` → `AGENTS.md` → `docs/backlog.md` → `docs/google-ads-current-state.md`.
3. **First week — keep-alive only:** confirm the site is up, domains aren't lapsing, Stripe payouts flow, the Ad Grant is spending compliantly (or pause campaigns if unsupervised — a compliance strike is worse than idle budget).
4. **First month:** re-establish the weekly Ads review, decide the Mailchimp question (backlog), take over or re-point the `cta-report.js` measurement, and introduce yourself to the membership/board.
5. **Use the AI layer:** any capable AI agent pointed at this repo and told to read `AGENTS.md` can execute or coach most of the above. That is the design intent — the docs are written for it.

## 6. Operator-infrastructure dependencies (migration list)

The repo must be **standalone**: a successor with only this repo + Bitwarden carries on. These pieces currently run on the ED's personal infrastructure and must either migrate into the repo, be re-creatable from docs here, or be consciously retired:

| Dependency | What it does | Standalone status |
|---|---|---|
| Weekly Google Ads growth-review automation | Keeps the grant spending compliantly + growing | Not migrated. Interim: `google-ads-current-state.md` is a manual resume point; any agent with Ads auth can continue. ❑ re-home as a documented runbook/scheduled agent. |
| `cta-report.js` (ED-report measurement) | Mailchimp + Stripe counts → reporting sheet | Mechanics documented in `integrations.md`. ❑ move the script into this repo's `scripts/` with env-var auth from Bitwarden. |
| Wiki source vault sync | How the source Obsidian vault syncs into `src/cta-wiki/` | ❑ undocumented — record where the source vault lives and the sync procedure (or declare `src/cta-wiki/` in-repo canonical). |
| "Expansive Human Futures" one-page + Road to Emmaus essay | Content the locked homepage hero links to (`homepage-messaging.md`) | ❑ drafts live in the ED's notes; publish or copy into the repo before the homepage build. |

## 7. Open gaps in this plan

- ❑ Bitwarden access path for a successor (§1) — **blocking; without it nothing else works.**
- ❑ Named successor(s) and what they've agreed to.
- ❑ Legal/financial layer: mostly documented in **`legal.md`** (EIN, TN annual report, 990-N, F&E exemption); still to fill: 501(c)(3) determination letter location, banking shape (from Emily Redding, Treasurer).
- ❑ Audit of the wiki [[CTA Admin Accounts]] note against reality (stale Heroku/Roam entries).

# CTA agent technical plan

**What this is:** how the agent system in `docs/agent-plan.md` gets built and run:
where agents run, how they get credentials, where their work and records live, how
the approval tiers are enforced, and the technical design for each of the five
capabilities. `agent-plan.md` says *what* and *why*; this file says *how*.

**Design goal:** everything runs on **CTA-owned accounts** (the `christian-transhumanism`
GitHub org, CTA's Google Workspace, Netlify, Bitwarden), so a successor inherits a
working system rather than a description of one. Nothing load-bearing should depend
on one person's laptop, home servers or personal AI subscriptions.

_Established 2026-10-31. Items marked **(verify)** are assumptions about third-party
pricing or limits to confirm before building._

---

## 1. Architecture at a glance

```
                ┌──────────────── Bitwarden (canonical secrets) ────────────────┐
                │  synced to: GitHub Actions secrets · Netlify env vars          │
                └───────────────────────────────────────────────────────────────┘
 Humans (ED, VP, board)
   │  approve = review/merge PRs, label issues
   ▼
 GitHub org: christian-transhumanism
   ├─ site  (PUBLIC)  ── docs, plan, skills, site source, prompts ──► Netlify ──► christiantranshumanism.org
   │                                                                   └─ Netlify Functions:
   │                                                                       chat API · webhooks (Stripe/Mailchimp)
   └─ ops   (PRIVATE) ── scheduled agent workflows, social queue + log,
                         reports, chat transcripts (if kept), eval results
                         │
                         ▼ GitHub Actions (cron + on-merge)
                     agent jobs (Claude via API) ──► Google Ads / GA4 / Sheets APIs
                                                 ──► social platform APIs
                                                 ──► opens PRs / issues back into site + ops
```

Four building blocks:

1. **Git and GitHub are the control plane.** Work queue = issues. Approval = PR review
   and merge. Audit trail = commit history. No separate dashboard to maintain.
2. **GitHub Actions is the scheduler and runner.** Cron jobs and merge-triggered jobs
   in the org. No always-on server for anything except chat (and chat uses Netlify
   Functions).
3. **Netlify Functions** handle anything that must answer a request: the chat
   endpoint and incoming webhooks. Netlify already hosts the site, so this adds no new
   vendor.
4. **Bitwarden is canonical for secrets.** GitHub and Netlify hold working copies.

### 1.1 Why two repos

`site` is **public**. That's right for the site, the docs and this plan, but **GitHub
Actions logs on a public repo are public**, and agent runs log what they read: ad
performance, member counts, draft posts, sometimes personal data. So:

- **`site` (public, existing):** site source, `docs/`, `AGENTS.md`, skills, chat-agent
  prompt *sources* and eval *questions*, and CI that touches nothing secret (the build
  check).
- **`ops` (private, new):** every workflow that uses credentials or reads private
  data, plus the operational records: the social queue and post log, weekly reports,
  eval results, and incident notes.

`docs/` in `site` stays the source of truth for *how* things work. `ops` holds *state*.
`ops/README.md` points back to `site/AGENTS.md`.

---

## 2. Shared foundations

### 2.1 Accounts and access

| Need | Recommendation |
|---|---|
| Runner | GitHub Actions in the `christian-transhumanism` org. Free minutes for private repos are limited **(verify)**; these jobs are short and mostly weekly or daily. |
| Model access | A **CTA-owned Anthropic API key** (an org account under admin@christiantranshumanism.org, billed to CTA), not anyone's personal subscription. Check nonprofit pricing **(verify)**. One env var sets the model per job, so models can be upgraded without code changes. |
| Agent harness | `anthropics/claude-code-action` for jobs that work on the repo (reviews, drafts, PRs); the Claude Agent SDK, or plain API calls from Node scripts, for jobs that call outside APIs. Same key either way. |
| Bot identity | A **GitHub App** owned by the org (for example "CTA Agent"), so agent commits and PRs are clearly attributed, can't push to protected `main`, and survive any one person leaving. |
| Google APIs | A **Google Cloud project on CTA's Workspace** with a **service account** for Sheets, GA4 Data API and (later) Google Ads API. A service account has no 7-day token expiry, which fixes the `cta-report.js` problem (backlog). |
| Human access | Branch protection on `main` in both repos: merging requires a human approval. That one setting enforces most of the approval tiers. |

### 2.2 Secrets

- **Bitwarden stays canonical.** Each secret has a Bitwarden item; `ops/SECRETS.md`
  lists every secret by **name, purpose, Bitwarden item, where it's copied to, and
  rotation date**. It never holds values.
- Copies live in **GitHub Actions secrets** (in `ops`) and **Netlify environment
  variables** (for functions).
- Better, once set up: **Bitwarden Secrets Manager** with its GitHub Action, so
  workflows fetch secrets at run time and Bitwarden is the only place to rotate
  **(verify plan/pricing)**.
- Rule: no secret in a public repo's workflow, and no workflow in `site` that reads a
  secret, except the build itself.

### 2.3 How the approval tiers are enforced

| Tier (`agent-plan.md` §3) | Mechanism |
|---|---|
| 0: Read and analyze | Read-only credentials where the platform offers them (GA4 viewer, Ads read access). Output goes to `ops/reports/` or an issue. |
| 1: Draft | The agent opens a PR (site content, social posts, prompt changes) or an issue. It cannot merge. |
| 2: Routine, reversible | Pre-approved action types listed in `ops/policy/tier2.yml` (for example "deploy a merged PR", "reschedule an approved post", "pause an ad with CTR under X"). The workflow checks the list before acting and logs every action. Anything not listed falls to Tier 3. |
| 3: Human approval | PR review from a human in the `approvers` GitHub team; `CODEOWNERS` requires that team on `ops/social/queue/`, `site/src/`, chat prompts and policy files. |

**Kill switch:** a repository variable `AGENTS_ENABLED=false` in `ops` stops every
scheduled job at its first step. Document it at the top of `ops/README.md`.

### 2.4 Shared prompt core

Every agent, whether drafting, posting or chatting, builds its instructions from the
same files in `site`, so they can't drift apart:

- `docs/agent-plan.md` §2 (commitments, positions, canonical examples, checklist);
- `.claude/skills/cta-page/VOICE.md`;
- `AGENTS.md` §4 and §7 (compliance guardrails);
- a facts sheet, `docs/cta-facts.md` (new): what CTA is, links, how to join.

A small script, `scripts/build-agent-prompt.js` (new), assembles these into a
generated prompt file for each job type. Chat and posting jobs use the generated file;
Claude Code jobs read the source docs directly.

### 2.5 Logging and observability

- Every job writes a one-line JSON record to `ops/logs/YYYY-MM.jsonl`: job, time,
  actions taken, links, errors.
- A failed job opens (or comments on) an issue labelled `agent-failure` in `ops`.
  Watching that label is how humans learn something broke. No separate monitoring
  stack.
- A weekly digest job summarizes the logs, the funnel numbers and open approvals into
  one issue, labelled `weekly-review`.

---

## 3. Capability by capability

### 3.1 Website

Mostly in place; three additions.

- **PR build check (in `site`, public, no secrets):** `.github/workflows/build.yml`
  runs `npm ci && npm run build` on every PR. This catches broken builds before
  Netlify does. (`npm run verify` currently just builds; add link checking later.)
- **Post-deploy verification (in `ops`):** listen for Netlify's "deploy succeeded"
  notification (a deploy notification webhook calling a `repository_dispatch` into
  `ops`), or poll every hour. Then request every URL in `ops/checks/urls.txt`: the
  homepage, `/join/*`, every `/topics/*`, and every live ad's final URL. Any non-200
  opens an `agent-failure` issue. This automates the "verify 200" rule in `AGENTS.md`
  and gives evidence for the Netlify-reliability backlog item.
- **Agent site work:** the `/cta-page` skill and Claude Code continue as now, opening
  PRs. Later, `claude-code-action` can pick up issues labelled `agent:site` and open a
  PR for each.

### 3.2 Social accounts

**Approach: posts are files, approval is a merge, publishing is a scheduled job.**

```
ops/social/
  accounts.yml          # audited inventory: platform, handle, live?, Bitwarden item, API method
  queue/2026-11-03-fall-reading.md   # one file per post
  log/2026-11.jsonl     # what actually went out + post IDs
  metrics/2026-11.jsonl # engagement pulled back
```

A queued post's front matter:

```yaml
---
platforms: [x, bluesky, facebook]
publish_at: 2026-11-03T15:00:00-06:00
source: docs/agent-plan.md#example-1   # or a URL / page / episode
checklist: passed      # set by the drafting agent after running agent-plan.md §2.2
variants:
  x: "…"               # optional per-platform text
---
Body text (default for all platforms)
```

- **Drafting job** (daily or on demand): reads the identified-needs list (issues
  labelled `content-need`, recent site and podcast content, the post log). It drafts
  posts into `queue/`, runs the §2.2 checklist as a separate review pass, and opens a
  PR. **The PR merge is the Tier 3 approval.**
- **Publishing job** (every 15 to 30 minutes): publishes merged posts that are due, via
  each platform's adapter. It writes post IDs to `log/` and moves the file to
  `queue/published/`.
- **Metrics job** (daily): pulls engagement for recent posts into `metrics/`, which
  feeds the weekly digest and future drafting.
- **Adapters** in `ops/social/adapters/`, one small module per platform, all with the
  same interface (`publish(post) → {id, url}`, `metrics(id)`):

| Platform | Method | Effort / cost |
|---|---|---|
| Bluesky | AT Protocol with an app password | Easy, free. **Start here.** |
| Discord (announcements) | Channel webhook | Easy, free |
| Telegram (channel) | Bot API | Easy, free |
| Facebook page | Meta Graph API with a long-lived page token (Meta app on a CTA business account) | Moderate; may need Meta app review **(verify)** |
| Instagram | Graph API; needs a business account linked to the Facebook page, and an image for every post | Moderate |
| X | X API; low-volume posting tiers have changed repeatedly **(verify current price and limits)** | Cost decision |
| Reddit `r/christianityplus` | Reddit API with a script app | Moderate; post sparingly, community norms |
| YouTube | Out of scope for automation at first (podcast pipeline owns video) | n/a |

  The alternative is a scheduler (Buffer or similar) with one API for all platforms.
  That's less code, but adds a subscription and a dependency **(verify current API
  availability)**. Recommendation: native adapters for the free, easy platforms first;
  decide X and Meta once there is a posting record.

- **Replies and mentions:** read-only at first. A job collects mentions into the weekly
  digest, or into an issue if something needs attention. Agents draft replies as PRs or
  issue comments. No autonomous replies (Tier 3).

### 3.3 Chat agents

Shared engine, several front-ends.

- **Engine:** a Netlify Function, `netlify/functions/chat.js` (new, in `site`). It
  loads the generated chat prompt (§2.4), calls the Claude API with streaming, and
  enforces limits: messages per session, sessions per IP per day, and a monthly spend
  ceiling. Every response is grounded in the prompt core and, later, retrieval over
  the site's own pages (§3.3.1).
- **Front-ends, in order:**
  1. **Discord slash command** `/ask`. Discord interactions arrive as HTTPS requests,
     so they can be handled by a Netlify Function with no always-on bot. Discord
     requires an answer within 3 seconds, so the function acknowledges immediately
     and posts the full answer as a follow-up **(verify Netlify function time limits
     for that follow-up)**. Discord is a contained, community-facing pilot.
  2. **Website widget**, for example on `/topics/*` pages: "Ask about this topic". A
     small script calling the same function.
  3. **Drafting assistant for humans:** the same engine, used from Claude Code or a
     private page, to draft replies to emails and comments.
- **Transcripts:** off by default. If kept for evaluation, store only the text (no IP
  addresses or account IDs), in `ops` or a private store, deleted after 90 days, and
  say so in the widget. Never store transcripts in the public repo.
- **Evaluation:** questions live in `site/docs/chat-evals.yml` (public is fine, since
  they're just questions). A job in `ops` runs the full set whenever the prompt core
  changes, and has a second model call grade each answer against the §2.2 checklist.
  Results go into the PR as a comment. A human reads the full set before any
  front-end goes live, and again before major prompt changes.
- **Abuse and cost controls:** a rate limit, a maximum response length, a spend cap
  set in the Anthropic console, and a `CHAT_ENABLED` environment variable kill switch
  in Netlify.

#### 3.3.1 Retrieval (later)

At build time, Eleventy can write a JSON index of topic pages and posts (title, URL,
text chunks) to `_site/agent-index.json`. The chat function searches it with simple
keyword or embedding search and cites CTA pages in its answers. That keeps answers
anchored to published material and sends readers to the site.

### 3.4 Content creation and remixing

- **Need intake:** issues labelled `content-need` (opened by humans or by other jobs).
  For example, the Ads job opens one when an ad group has no good landing page, the
  metrics job when a topic is performing, the digest when a podcast episode hasn't
  been promoted.
- **Skills, all in `site/.claude/skills/`, all following the `/cta-page` pattern
  (draft → §2.2 checklist pass → PR):**
  - `/cta-page`: exists, for topic pages.
  - `/cta-social` (new): posts and threads into `ops/social/queue/`.
  - `/cta-remix` (new): turns one source into several formats (tweet → article,
    episode → posts, page → thread or email).
- **Separate review pass:** after drafting, a second, separate model call reviews the
  draft *only* against the checklist and the compliance rules, and writes its verdict
  into the PR. Separating writer and reviewer catches more than self-checking.
- **Images:** existing Cloudinary assets only, until image rights and a generation
  policy are decided (the Ad Grant rule on image rights in `AGENTS.md` §4 applies).

### 3.5 Google Ads and the funnel

1. **Reporting first (Tier 0).** Apply for a **Google Ads API developer token**
   (basic access) for CTA's account **(verify the process for Ad Grant accounts)**. A
   weekly job in `ops` then pulls campaign, ad group and keyword metrics (GAQL) plus
   GA4 conversions, and writes `ops/reports/ads/YYYY-WW.md`. A model call compares it
   with the previous weeks and with `docs/google-ads-growth-plan.md`, and proposes
   changes. Until the token is approved, the existing browser-driven workflow
   continues.
2. **Changes (Tier 2, later):** a small whitelist in `ops/policy/tier2.yml` (for
   example add negative keywords, pause ads under the CTR floor, adjust within budget
   caps). Everything else goes into the weekly issue as a proposal for a human to
   approve. Every change is appended to `docs/google-ads-current-state.md` through a
   PR, so the resume point stays true.
3. **Grant-compliance check:** before submitting any new ad text, the job runs the
   `AGENTS.md` §4 rules as an automated check (no implied religious, health or
   political identity) and refuses anything that fails.

**Closing the conversion gap** (the highest-leverage backlog item):

```
ad click (gclid) → /join/free or /join/voting
   ├─ store gclid + GA client id in a first-party cookie
   ├─ pass them on: Mailchimp merge field  /  Stripe Checkout client_reference_id or metadata
   ▼
Mailchimp "subscribe" webhook ─┐
Stripe "checkout.session.completed" / "customer.subscription.created" webhook ─┤
                                                                               ▼
                         netlify/functions/membership-webhook.js
                           ├─ verify the signature
                           ├─ GA4 Measurement Protocol: event `membership_confirmed`
                           └─ Google Ads offline conversion upload (gclid) → conversion `Membership (confirmed)`
```

Then switch Ads bidding and reporting from intent to confirmed. Keep the existing
`/join/*` intent tags as a secondary signal (`AGENTS.md` §7: don't break them).

### 3.6 Measurement (`cta-report.js`)

Move it into `site/scripts/cta-report.js` (code is fine in public). Run it from an
`ops` workflow weekly, with the Google service account (§2.1) for Sheets, and
`MAILCHIMP_API_KEY` and `STRIPE_API_KEY` from secrets. This retires both the
personal-machine dependency and the 7-day re-auth (`succession-plan.md` §6).

---

## 4. Build order

Each step is useful on its own. Do them in order.

| Step | Work | Unblocks |
|---|---|---|
| 1 | Create `ops` (private), the GitHub App, branch protection and `CODEOWNERS`, `ops/SECRETS.md`, the kill switch, the `agent-failure` label | Everything |
| 2 | CTA Anthropic API key, Google Cloud project and service account | Every agent job |
| 3 | `build.yml` in `site`; URL checks in `ops` | Reliable deploys; Netlify backlog item |
| 4 | Move `cta-report.js` into the repo and run it from `ops` | Measurement survives; first migration item done |
| 5 | Social: audit accounts into `accounts.yml`; queue, publish and log with the Bluesky, Discord and Telegram adapters; `/cta-social` | Capabilities 2 and 4 |
| 6 | Weekly digest issue (logs, funnel numbers, posts, open approvals) | One place for humans to supervise |
| 7 | Membership webhook + gclid passthrough | Real outcome metric for capability 5 |
| 8 | Google Ads API reporting job; then the Tier 2 whitelist | Ads review migrated off personal infrastructure |
| 9 | Chat engine + eval set; Discord `/ask` pilot | Capability 3 |
| 10 | Facebook, Instagram and X adapters; site chat widget; retrieval index | Breadth |

**Rough running cost:** GitHub, Netlify Functions, and the Bluesky, Discord and
Telegram APIs are likely free at CTA's volume **(verify)**. The variable costs are
model usage (capped in the Anthropic console), possibly the X API, and possibly
Bitwarden Secrets Manager.

---

## 5. Decisions needed

Recommendations first; each needs a human decision.

1. **Create the private `ops` repo?** Recommended, because Actions logs on public repos
   are public.
2. **Who are the `approvers`?** At least two people (the ED plus the VP or a board
   member), so approval doesn't stall when one is away.
3. **Anthropic billing:** a CTA-owned API account, with a monthly cap to set.
4. **X and Meta:** pay for X API access and do Meta app setup now, or start with
   Bluesky, Discord and Telegram and add them later? Recommended: later.
5. **Chat transcripts:** keep none (simplest), or keep for 90 days for evaluation?
6. **The wiki source vault:** declare `src/cta-wiki/` canonical in-repo, so content
   agents read one source (`succession-plan.md` §6).

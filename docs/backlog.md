# CTA — backlog (surfaced work)

Canonical task list for the CTA project: each cluster has an **imperative** (what it
serves) and each item a category tag. This is the CTA-project source of truth for open
work. See `../AGENTS.md` for how the ecosystem runs.

Tags: `[fix]` broken · `[risk]` will-break · `[improve]` new value · `[unify]` consolidate · `[decision]`

---

## Email platform — capture signups + send periodically, *cheaply*

**Imperative:** CTA needs to (a) capture email signups **and** (b) send periodic email to members — *cheaply*.
**Current state:** Mailchimp ~**$45/mo**, used almost entirely for *capture*; to mail without waste we
manually **pause/unpause** the monthly plan (toil + mistiming risk). Free membership = a Mailchimp list
subscription. Access/how-counted: `integrations.md` (this directory).

- `[decision/improve]` **Evaluate Mailchimp vs competitors** (Kit / MailerLite / Loops / Beehiiv / Resend) against the $45/mo + pause-toil — is there a tier that does capture + light sending *without* the hack? Bar to switch is "clearly better," since Mailchimp is already wired into the funnel (`/join/free` handoff + ED-report member count) and the Stripe (voting) tier must stay intact.
- `[improve]` **Welcome email on signup** — automate via the chosen platform. *(soft-dep: best after the platform eval, to avoid a rebuild — not blocked by it. Done = a test signup receives a welcome email.)*
- `[improve]` **Eliminate the pause/unpause toil** — automate it, or pick a plan that doesn't need it.
- `[risk]` **Plan mistiming** — a fumbled pause = wasted spend, or can't-send-when-needed.
- `[unify]` **Fold conversion-capture quality** (see below) into the platform decision — the signup endpoint and its tracking are one question.

## Conversion tracking — make the growth metric real

**Imperative:** prove a click became a **confirmed** member, not just an intent.

- `[improve]` **Fire the conversion on real Mailchimp/Stripe *completion* (a webhook)**, not just the outbound `/join/*` handoff. **Highest funnel leverage** — today GA4 `membership_signup_intent` + Ads `Membership` count *intent*, so the whole Ads→site→signup funnel is optimizing against a **proxy**. Closing this makes every other funnel effort real.

## Site reliability

- `[fix]` **Netlify deploy reliability** — recurring **500-on-upload / 404-after-push** silently breaks freshly-pushed landing pages (so ads can point at a dead URL). Always verify 200 after a push; find + fix the root cause (connector vs config).
- `[risk]` **Dependency vulnerabilities — the flattened `package.json` is the disease.** `package.json` pins ~300 *transitive* packages as direct dependencies (a historical flattening), so old pins keep resurfacing as Dependabot alerts: as of 2026-08-05, ~26 open (≈18 high) across `ws`, `socket.io-parser`, `liquidjs`, `js-yaml`, `markdown-it`, `brace-expansion`, `immutable`, etc. — mostly browser-sync's dependency tree. The June 2026 fix (PR #5) bumped a few pins but treated symptoms. Real fix: prune `package.json` down to the genuine direct dependencies (Eleventy, browser-sync, the data-loader libs), regenerate `package-lock.json`, and verify with `npm run build` + `npm run verify`. All alerts are in dev/build-time tooling — the published site is static — so this is hygiene, not an emergency.

## Orchestration

- `[risk/decision]` **The Ads automation and its observability run on the ED's personal infrastructure** — the weekly Ads growth-review automation, its monitoring, and the ED-report tooling all live outside this repo. That is itself a succession risk (see `succession-plan.md` §6): decide how to make the automation CTA-transferable — e.g. re-home it as a documented runbook + scheduled agent that any operator with Bitwarden access can re-create. *(Interim mitigation: `docs/google-ads-current-state.md` is kept as the resume point so any agent with Ads auth can continue manually.)*

## Measurement — keep the numbers alive

**Imperative:** CTA's membership numbers must stay current and trustworthy.

- `[risk]` **The ED-report measurement breaks every ~7 days.** `cta-report.js` (Mailchimp + Stripe → reporting sheet; runs on the ED's machine — see `integrations.md`) authenticates via the **Google Workspace OAuth app, still in *testing* mode → its refresh token expires every 7 days.** So CTA's membership *measurement* silently dies weekly unless re-authed, and the funnel can end up optimizing against **stale numbers**. Fix: publish/verify the OAuth app (move it out of testing), or add a re-auth reminder.

## Content — cta-wiki stub completion (standing work)

**Imperative:** the cta-wiki (mirrored into `/wiki/` + `/board/`) should be substantive, not stubs.

**Policy:** `src/cta-wiki/` is a **human-edited area**. AI must **not** write or expand cta-wiki articles (stubs included) — only *identify* thin notes and flag them for a human to write. AI **may** read cta-wiki content and use it as source material for other site pages (e.g. `/topics/*`).

- `[improve]` **Surface cta-wiki stubs for human authoring (detection only).** ~**176 of 491** notes in `src/cta-wiki/` are under ~400 bytes (likely stubs). Any agent working in cta-site can *list* these and flag them for a human — **AI does not write the content**:
  ```bash
  find src/cta-wiki -name "*.md" -size -400c | grep -v templates
  ```
  Confirm a candidate is genuinely thin (not a legitimately short note/quote/definition) before flagging. **Suggestion:** add a `stub: true` frontmatter marker as notes are touched, so stub-detection becomes reliable over time instead of a size heuristic. Expansion itself is human work.

## Upcoming — CTA retreat (Oct 16–18, 2026)

- `[improve]` **Retreat site work** (fixed date **Oct 16–18, 2026**; planning now, ~116 days out). A retreat typically needs a site presence: an event/info page, **registration + payment (Stripe)**, and promotion. Build the concrete pages before it's last-minute.

---

*Topic-page ideas (new `/topics/*` content) are tracked separately in the `/cta-page` skill's `BACKLOG.md`.*

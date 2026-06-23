# CTA — backlog (surfaced work)

Canonical task list for the CTA project. Organized the way the owner's infra surfaces work:
each cluster has an **imperative** (what it serves) and each item a category tag. This is the
CTA-project source of truth for open work; the vault's `FLEET.md` (§Off-fleet → CTA) holds a
"register view" of the same items. See `../AGENTS.md` for how the ecosystem runs.

Tags: `[fix]` broken · `[risk]` will-break · `[improve]` new value · `[unify]` consolidate · `[decision]`

---

## Email platform — capture signups + send periodically, *cheaply*

**Imperative:** CTA needs to (a) capture email signups **and** (b) send periodic email to members — *cheaply*.
**Current state:** Mailchimp ~**$45/mo**, used almost entirely for *capture*; to mail without waste we
manually **pause/unpause** the monthly plan (toil + mistiming risk). Free membership = a Mailchimp list
subscription. Access/how-counted: vault `agent/capabilities/cta-integrations-access.md`.

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

## Orchestration

- `[decision]` **Keep Ads + site in Codex, or bring under the agent-framework fleet** for observability (so they show up in the owner's `status` board). Cross-cuts every CTA off-fleet system; affects who can see/operate the funnel.

---

*Topic-page ideas (new `/topics/*` content) are tracked separately in the `/cta-page` skill's `BACKLOG.md`.*

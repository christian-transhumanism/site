# CTA integrations — Mailchimp, Stripe, reporting

How the CTA's membership integrations work and how the official numbers are counted.
These are the **signup endpoints + measurement data sources** of the growth funnel
(Google Ads → site → **Mailchimp/Stripe** → ED report). Credentials live in
**Bitwarden** — names of env vars are documented here, never values.

## Mailchimp — free membership / email list

- **Role in funnel:** the `/join/free` landing path hands off to Mailchimp. **Free
  membership = a Mailchimp list subscription.** The ED-report "members" metric is the
  `member_count` of the **first (main) list** (`lists.getAllLists()[0].stats.member_count`).
- **SDK:** `@mailchimp/mailchimp_marketing` (Node).
- **Auth:** env var **`MAILCHIMP_API_KEY`**. Key format is `<key>-<dc>`; the reporting
  code splits on `-` to derive the datacenter/server prefix.
- **Caveat:** "main list" is assumed to be index 0 — if more lists are added, confirm
  the right one is still first, or the members count silently tracks the wrong audience.
- **Cost/toil:** ~$45/mo, used mostly for capture; the monthly plan is manually
  paused/unpaused around sends. Platform under evaluation — see `backlog.md`.

## Stripe — voting (paid) membership

- **Role in funnel:** the `/join/voting` landing path hands off to Stripe. **Voting
  membership = an active Stripe subscription.** The ED-report "voting members" metric
  is the count of `subscriptions.list({ status: 'active' })`, paged at limit 100.
- **SDK:** `stripe` (Node).
- **Auth:** env var **`STRIPE_API_KEY`**.

## Reporting (the ED report)

- A small Node script (`cta-report.js`) reads both metrics above and inserts a row at
  the top of the ED-report Google Sheet. **It currently runs on the ED's personal
  machine, not from this repo** — a standalone-repo migration candidate (see
  `succession-plan.md` §6).
- **`SPREADSHEET_ID`** env var identifies the sheet; sheet auth is a Google Workspace
  OAuth app. **Known risk:** that OAuth app is still in *testing* mode, so its refresh
  token expires every ~7 days and the measurement silently dies weekly (see
  `backlog.md` → Measurement).
- Columns: date · voting · members · facebook (manual) · adwords
  impressions/clicks/conversions (manual). **The Facebook and Google Ads columns are
  still hand-entered.**

## Conversion-tracking caveat (whole funnel)

The site's Google Ads `Membership` conversion fires on *signup intent / outbound
handoff* to Mailchimp/Stripe, **not** on confirmed list-join or payment completion.
These two integrations hold the *confirmed* numbers; closing the loop (a
Stripe/Mailchimp completion webhook back to Ads/GA4) is the open item that would make
the growth metric real. See `backlog.md` → Conversion tracking.

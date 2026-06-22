# CTA Google Ads Growth Plan

Operating plan for increasing qualified views, free signups, and paid memberships for the Christian Transhumanist Association through Google Ad Grants and related website work.

## North Star

Increase qualified membership intent:

- Primary conversion: tracked outbound handoff to free membership or voting membership.
- Secondary conversions: newsletter/media engagement, topic-page depth, podcast/video engagement, and returning visitor activity.
- Guardrails: keep the Ad Grants account compliant, avoid sensitive-identity targeting, avoid misleading domain or organization presentation, and maintain landing-page quality.

## Current Strategy

1. Keep the main CTA domain as the authoritative identity.
2. Build neutral, topic-specific landing pages under the CTA site first.
3. Use tightly matched Search campaigns around future-facing topics, thinkers, and questions.
4. Route visitors from topic pages to `/join/future/`, `/join/free/`, and `/join/voting/`.
5. Use the weekly review cadence to prune weak queries, expand winners, and add new landing pages.

## Domain Decision

Do not switch away from `christiantranshumanism.org` as the main Ads destination right now.

Reasons:

- Ad Grants requires the nonprofit to own and control any domain used for ads. A second domain would need to meet the same website-quality standard and may require additional domain approval.
- Google Ads destination policy expects the displayed site and final destination to match. A neutral domain that disguises CTA ownership would create trust and policy risk.
- The word `Christian` in the domain may contribute to sensitive-category review, but the bigger issue is usually the combination of ad copy, assets, audiences, and landing-page content.
- A new domain would split authority, add deployment/tracking overhead, and delay the work that most directly improves performance: better pages, better query matching, and cleaner conversion data.

Acceptable later test:

- Create a clearly CTA-owned sub-brand or publication domain only if we have repeated evidence that the current domain is depressing eligibility after policy-clean copy and topic pages are live.
- The domain must be transparent about CTA ownership, must contain substantial original content, and must not be only a redirect or thin lead-capture site.
- Candidate positioning should be topic-first, not identity-obscuring. Examples: future-values, human-flourishing, technology-and-hope, moral-futures.

Preferred near-term alternative:

- Use neutral URL paths on the current site, such as `/topics/ai-human-flourishing/`, `/topics/brain-computer-interfaces/`, `/topics/radical-longevity/`, and `/topics/dominion-and-the-future-of-values/`.

## Policy Position

Google's personalized advertising policy treats religious belief as a sensitive interest category. Therefore:

- Do not use remarketing, customer match, similar/lookalike audiences, or other advertiser-curated audiences for campaigns whose ads or landing pages are religiously sensitive.
- Prefer Search intent and predefined/contextual targeting.
- Do not write ad copy that says or implies the user is Christian, religious, spiritually searching, disabled, sick, politically aligned, or otherwise in a sensitive category.
- It is acceptable to advertise educational or editorial content about theology, values, ethics, technology, and the future when the query itself expresses that topic, but the copy should describe the content rather than the user.

Safe copy pattern:

- "Explore ideas on AI, values, and the future."
- "A resource hub on technology and human flourishing."
- "Essays and talks on moral history and future-building."

Avoid:

- "For Christians interested in transhumanism."
- "Your Christian future community."
- "Are you a Christian who believes..."
- Any ad copy that attributes religion, disability, medical status, or distress to the searcher.

## Campaign Architecture

### Tier 1: Scalable Non-Sensitive Search

Goal: grow views and conversion volume with lower policy risk.

Initial ad groups:

- AI and human flourishing
- Brain-computer interfaces
- Radical longevity ethics
- Technology and human flourishing
- Human enhancement ethics
- Future of values / moral history

Landing pages:

- `/topics/ai-human-flourishing/`
- `/topics/brain-computer-interfaces/`
- `/topics/radical-longevity/`
- `/topics/technology-human-flourishing/`
- `/topics/human-enhancement-ethics/`
- `/topics/dominion-and-the-future-of-values/`

### Tier 2: Thinker-Led Editorial Search

Goal: piggyback on specific thinkers and CTA guests without implying endorsement.

Initial ad groups:

- Ray Kurzweil
- David Deutsch
- Aubrey de Grey
- Noland Arbaugh / Neuralink
- Tom Holland / Dominion
- Nick Bostrom
- Peter Thiel and progress

Landing pages:

- `/topics/ray-kurzweil/`
- `/topics/david-deutsch/`
- `/topics/aubrey-de-grey/`
- `/topics/brain-computer-interfaces/`
- `/topics/dominion-and-the-future-of-values/`
- `/topics/simulation-and-ai-risk/`
- `/topics/peter-thiel-progress/`

Rules:

- Use non-affiliation notes on person pages.
- Keep ad copy to commentary/resources, not endorsement.
- Add negatives for gossip, personal life, net worth, controversy, PDF, torrent, and low-intent searches.

### Tier 3: Direct CTA / Religious Transhumanism Search

Goal: capture explicit direct-intent queries while accepting higher policy sensitivity.

Initial ad groups:

- Christian transhumanism basics
- Christianity and transhumanism compatibility
- Religious transhumanism
- Resurrection and technology
- Image of God and technology

Rules:

- Search only.
- No custom audiences or remarketing.
- Educational ad copy only.
- Keep landing pages substantive and transparent.

## Website Roadmap

### Immediate

1. Keep `/join/future/` and the tracked membership handoff pages live and monitored.
2. Build the first three topic landing pages:
   - `/topics/ai-human-flourishing/` (implemented June 22, 2026)
   - `/topics/brain-computer-interfaces/`
   - `/topics/radical-longevity/`
3. Add clear CTA ownership and mission context to topic pages.
4. Ensure CTAs route through tracked handoff pages.

### Next

1. Build `/topics/dominion-and-the-future-of-values/`.
2. Build thinker pages for David Deutsch and Ray Kurzweil.
3. Add structured internal links from topic pages to podcast, video, wiki, and join pages.
4. Add reusable topic-page templates and data so future pages are fast to create.

### Later

1. Test a neutral CTA-owned publication sub-brand only if account evidence supports it.
2. Add comparison pages for major topic clusters.
3. Add an email-course or "future technology and human flourishing" lead magnet if we can track the signup cleanly.

## Measurement

Required:

- Verify that the Google Ads `Membership` conversion fires from `/join/free/` and `/join/voting/`.
- Ensure at least one meaningful conversion per month.
- Keep homepage visits and generic time-on-site out of account-default conversions.
- Use UTM parameters for new campaigns and landing-page experiments.

Useful event taxonomy:

- `membership_signup_intent`
- `paid_membership_intent`
- `topic_page_cta_click`
- `media_engagement`
- `newsletter_signup`
- `donation_intent`

## Operating Cadence

Daily:

- Check Gmail for Google Ads policy emails.
- Fix urgent disapprovals that block serving.

Weekly:

- Review policy issues, conversion status, spend, impressions, CTR, clicks, and conversions.
- Pause or tighten low-CTR / low-relevance keywords.
- Add negatives from search-term reports.
- Expand winners with new exact/phrase terms.
- Pick one landing page or ad group improvement to ship.

Monthly:

- Review account-level CTR and Ad Grants compliance.
- Review conversion quality and whether Smart Bidding has enough data.
- Decide whether to increase spend through new campaigns, broader match experiments, or more landing pages.

## First 30 Days

1. Fix remaining business-name / business-logo policy issues at the source.
2. Verify conversion tracking in Google Ads diagnostics.
3. Deploy and verify `/join/future/`.
4. Build three topic landing pages.
5. Launch or rebuild Tier 1 Search campaigns around those pages.
6. Add negatives and prune search terms after the first week of data.
7. Build the Dominion page as the first bridge from values/history into future-facing CTA membership.

## Decision Log

- 2026-06-17: Do not buy or switch to a neutral domain yet. Keep `christiantranshumanism.org` as the main destination, use neutral topic paths, and revisit a CTA-owned sub-brand only after the current domain has been tested with policy-clean campaigns and landing pages.
- 2026-06-22: Verified `/join/future/`, `/join/free/`, and `/join/voting/` return `200` in production. Verified both handoff pages contain the Google Ads conversion destination `AW-856723569/b4ANCLq5oXEQ8aDCmAM` and the GA4 `membership_signup_intent` event. Implemented and deployed the first Tier 1 landing page at `/topics/ai-human-flourishing/`.

# CTA Google Ads Current State

_Last updated: 2026-06-23 17:57 CDT._

This file is the compact resume point for CTA Google Ads growth work. A fresh agent should be able to start in this repo, read `AGENTS.md`, then this file, and continue without depending on the Notational vault for recent Ads state.

## Read Order

1. `AGENTS.md` — CTA ecosystem operating guide.
2. This file — current campaign state and immediate next actions.
3. `docs/google-ads-operations.md` — detailed Ads working log, policy notes, URLs, campaign/ad group build notes, deployment lessons.
4. `docs/google-ads-thinker-topic-map.md` — thinker/topic/podcast inventory and landing-page campaign map.
5. `docs/google-ads-growth-plan.md` — broader strategy.
6. `docs/backlog.md` — canonical surfaced work list.

CTA Google Ads work should now be documented in this repo first. The Notational vault may contain historical/cross-system context, but it is no longer the center of operations for Ads execution.

## Live Account

- Google Ads customer ID: `459-256-2474`.
- Active Search campaign: `USA`.
- Campaign ID: `802881820`.
- Current in-app browser URL when this checkpoint was made: `https://ads.google.com/aw/adgroups?campaignId=802881820&ocid=217504736&authuser=0&__u=2228876330&__c=4238000864`.
- Goal: increase qualified views and membership/signup conversions, using the Google Ad Grant without triggering sensitive-interest policy issues.

## Current USA Campaign Snapshot

The `USA` campaign currently has 19 ad groups.

Enabled ad groups observed in the campaign table:

- `AI and Human Flourishing` — eligible.
- `AI Ethics and Future` — eligible.
- `Brain-Computer Interfaces` — eligible.
- `Christianity & Transhumanism` — eligible; currently one of the only groups with recent clicks.
- `David Deutsch Progress` — pending / all ads under review after recent creation.
- `David Pearce Ending Suffering` — pending / all ads under review after recent creation.
- `Dominion and Future Values` — eligible.
- `Future of Christianity` — eligible; currently one of the only groups with recent clicks.
- `Human Enhancement Ethics` — eligible.
- `Kevin Kelly Technology` — eligible.
- `Radical Longevity` — eligible.
- `Ray Kurzweil Singularity` — pending / all ads under review after recent creation.
- `Robin Hanson Futurism` — pending / all ads under review after recent creation.
- `Technology and Human Flourishing` — eligible.
- `Zero to One Future` — eligible.

Paused or already inactive legacy/sensitive groups:

- `Christianity and Technology` — paused; zero clicks in the last checked period.
- `God & AI` — paused; zero clicks.
- `Religion and Technology` — paused; zero clicks.
- `Science & Faith & Spirituality` — already paused due to low activity.

Legacy groups `Christianity & Transhumanism` and `Future of Christianity` remain enabled for now because they were the only recent click sources. Revisit them after the neutral topic clusters get enough impressions and clicks to compare.

Last live check, 2026-06-23 13:51 CDT: campaign totals still showed `5` clicks, `36` impressions, `$8.20` cost, and `0.00` conversions for the visible reporting period.

## Recent Ad Group Expansion

Recently created neutral/topic and thinker-backed ad groups:

- `AI and Human Flourishing` -> `/topics/ai-human-flourishing/`
- `AI Ethics and Future` -> `/topics/ai-human-flourishing/`
- `Brain-Computer Interfaces` -> `/topics/brain-computer-interfaces/`
- `Radical Longevity` -> `/topics/radical-longevity/`
- `Dominion and Future Values` -> `/topics/dominion-and-the-future-of-values/`
- `Technology and Human Flourishing` -> `/topics/technology-and-human-flourishing/`
- `Human Enhancement Ethics` -> `/topics/human-enhancement-ethics/`
- `Ray Kurzweil Singularity` -> `/wiki/the-singularity-is-near-when-humans-transcend-biology/`
- `David Deutsch Progress` -> `/wiki/the-beginning-of-infinity-explanations-that-transform-the-world/`
- `Zero to One Future` -> `/wiki/zero-to-one-notes-on-startups-or-how-to-build-the-future/`
- `Kevin Kelly Technology` -> `/wiki/what-technology-wants/`
- `David Pearce Ending Suffering` -> `/podcast/41/`
- `Robin Hanson Futurism` -> `/podcast/37/`

All were started with focused exact/phrase keyword sets, neutral ad copy, UTM-tagged final URLs, and roughly `$2.00 (enhanced)` bids. The detailed keywords and ad copy are in `docs/google-ads-operations.md`.

## Landing Pages and Deploy State

Production pages verified as returning HTTP 200:

- `https://www.christiantranshumanism.org/topics/ai-human-flourishing/`
- `https://www.christiantranshumanism.org/topics/brain-computer-interfaces/`
- `https://www.christiantranshumanism.org/topics/radical-longevity/`
- `https://www.christiantranshumanism.org/topics/dominion-and-the-future-of-values/`
- `https://www.christiantranshumanism.org/topics/technology-and-human-flourishing/`
- `https://www.christiantranshumanism.org/topics/human-enhancement-ethics/`

Recent local source pages include:

- `src/topics/technology-and-human-flourishing.njk`
- `src/topics/human-enhancement-ethics.njk`
- `src/topics/brain-computer-interfaces.njk`
- `src/topics/radical-longevity.njk`
- `src/topics/dominion-and-the-future-of-values.njk`
- `src/topics/ai-human-flourishing.njk`

Netlify project caution:

- Live domain is served by Netlify project `christian-transhumanism`, project ID `1ecf40b9-9df1-415f-ab0f-125cdeae0ca8`.
- A different project named `cta-site` has caused deploy confusion before. Verify deploy target before relying on `netlify deploy`.
- Local `.netlify/state.json` is ignored by git, so do not assume a fresh clone has the right Netlify project linked.

## Policy Guardrails

Google has treated some religiously specific wording as sensitive-interest or personalized-attribute risk. Ads should avoid implying that the viewer has a religious identity or belief.

Use neutral/contextual framing:

- Good: `Explore Human Flourishing`, `Technology and Meaning`, `Future-Focused Community`, `AI Ethics and Society`, `Longevity and Values`.
- Risky in ad copy: `Are you Christian?`, `Christian futurists`, `What does God want?`, `Bible answers for AI`, or copy that implies the viewer's faith.

Important Google Ads UI behavior: Google may auto-fill or preserve religion-forward generated copy in editable fields or preview text. Do not save ads while phrases like `Christianity & Transhumanism`, `What does the Bible say?`, `God's plan`, or similar sensitive personalized copy appear in editable fields or the rendered ad preview.

## Current Policy / Asset Issues

Live check on 2026-06-23 13:51 CDT:

- `Admin` -> `Policy` -> `Ads` shows `Business Name Irrelevance` as `Disapproved` for `Extensions (1)`.
- The affected business-name association report renders three campaign-level rows after opening the `Download` menu:
  - `USA` — business name `CTA`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:58 PM`.
  - `Noland-Arbaugh-Video-1` — business name `CTA`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:23 PM`.
  - `dale-allison-miracles-1` — business name `CTA`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:25 PM`.
- `Religious belief in personalized advertising` remains `Approved (limited)` for business-name/logo assets, not a blocking disapproval.
- The earlier attempted ad-group-level `Join Free` / `Voting Membership` sitelinks were not verified as active. On 2026-06-23, new campaign-level `USA` sitelinks were created and verified in the associations table:
  - `Join Free` — descriptions `Free membership` / `Join the CTA community`, level `Campaign`, status `Pending / Under review`, last updated `Jun 23, 2026, 5:57 PM`.
  - `Voting Membership` — descriptions `Support CTA work` / `Help guide the association`, level `Campaign`, status `Pending / Under review`, last updated `Jun 23, 2026, 5:57 PM`.

Likely next fix: `CTA` may be too abbreviated for Google's business-name relevance check. The visible `CTA` wordmark update was deployed to production on 2026-06-23, and live homepage/topic-page HTML now contains `site-nav__wordmark` and `footer-brand` with visible `CTA` text. Google Ads still listed `Business Name Irrelevance` under `Extensions (1)` immediately after deploy, so the next move is to wait for policy recrawl/review or manually edit/resubmit the affected business-name assets if the issue remains.

## Conversion Tracking State

Current tracking measures membership intent on the `/join/*` handoff pages:

- GA4 event: `membership_signup_intent`.
- Google Ads conversion: `Membership`.
- Free membership redirects to Mailchimp.
- Voting membership redirects to Stripe.

Known measurement gap: this records intent/outbound handoff, not confirmed Mailchimp or Stripe completion. A server-side completion webhook remains one of the highest-leverage funnel improvements because it would let Ads optimize against real members rather than only click-through intent.

## Immediate Next Actions

1. Recheck the `Business Name Irrelevance` policy issue after Google has had time to recrawl/review the newly deployed `CTA` wordmark. If it remains, manually edit/resubmit the affected business-name assets or test a longer landing-page-visible business name.
2. Continue monitoring approval status for the recent pending ad groups: `Ray Kurzweil Singularity`, `David Deutsch Progress`, `David Pearce Ending Suffering`, and `Robin Hanson Futurism`.
3. Monitor the new campaign-level `Join Free` and `Voting Membership` sitelinks until they move from `Pending / Under review` to eligible or policy-limited.
4. Let the new neutral ad groups collect enough impression/click data, then compare against `Christianity & Transhumanism` and `Future of Christianity`.
5. Build the next podcast-backed landing pages and ad groups from `docs/google-ads-thinker-topic-map.md`. Highest near-term candidates: Taryn Southern / Derek Webb, Katharine Hayhoe, Steve Fuller, Liz Parrish, Frank Tipler, Calvin Mercer / Ron Cole-Turner.
6. Add confirmed-conversion tracking for Mailchimp and Stripe completions, or at minimum document exactly why it is blocked.
7. Continue pruning zero-click, policy-risky, or disapproved legacy assets.

## Repo Safety

At the time this file was created, local `main` was ahead of `origin/main` by 9 commits and had uncommitted docs changes. Do not push blindly from this checkout; review unrelated local commits before publishing.

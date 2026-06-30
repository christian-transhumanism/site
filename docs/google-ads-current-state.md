# CTA Google Ads Current State

_Last updated: 2026-06-30._

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

Live check on 2026-06-23 21:28 CDT:

- `Admin` -> `Policy` -> `Ads` shows `Business Name Irrelevance` as `Disapproved` for `Extensions (1)`.
- The affected business-name association report renders three campaign-level rows:
  - `USA` — business name `CTA`, level `Campaign`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:58 PM`.
  - `Noland-Arbaugh-Video-1` — business name `CTA`, level `Campaign`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:23 PM`.
  - `dale-allison-miracles-1` — business name `CTA`, level `Campaign`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:25 PM`.
- `Religious belief in personalized advertising` remains `Approved (limited)` for business-name/logo assets, not a blocking disapproval.
- The earlier attempted ad-group-level `Join Free` / `Voting Membership` sitelinks were not verified as active. On 2026-06-23, new campaign-level `USA` sitelinks were created and verified in the associations table:
  - `Join Free` — descriptions `Free membership` / `Join the CTA community`, level `Campaign`, status `Pending / Under review`, last updated `Jun 23, 2026, 5:57 PM`.
  - `Voting Membership` — descriptions `Support CTA work` / `Help guide the association`, level `Campaign`, status `Pending / Under review`, last updated `Jun 23, 2026, 5:57 PM`.

Manual appeal/resubmission attempt on 2026-06-23: selecting all three affected `CTA` business-name rows exposed only `Remove`, `Pause`, `Enable`, and `Add to`; no `Appeal` or edit/resubmit action appeared. `Admin` -> `Policy` -> `Ads` and `Appeal history` also exposed no appeal action. Re-saving a campaign-scoped `CTA` business-name asset on `USA` appeared to dedupe/no-op and did not create a fresh pending row or change the last-updated timestamp.

Support escalation attempt: the Google Ads support form at `https://support.google.com/google-ads/contact/approvals` accepted a request for manual review. The support assistant said `CTA` is likely failing because business names usually need to strictly match the verified legal name (`Christian Transhumanist Association`) or domain (`christiantranshumanism.org`). The support handoff is blocked on Google's shared-browser login/confirm step, which needs a human session.

Update after user completed the Google shared-browser login/confirm step: the Google Ads support assistant reported that it successfully filed an appeal for the `CTA` business-name asset associated with the `USA` campaign. Appeal ID: `56380626`. Google stated the review typically takes `24 to 48 hours` and can be tracked in `Policy Manager` -> `Appeal history`.

Follow-up on 2026-06-24 19:53 CDT: `Policy Manager` still shows `Business Name Irrelevance` as `Disapproved` for business-name `Extensions (1)`. `Appeal history` shows the June 24 `Business Name Irrelevance` appeal as `Not reviewed` with result `Failed`; the row lists `1 ad group: Science & Faith & Spirituality`, which suggests the support-bot appeal did not produce a successful review of the active `USA` business-name asset. `Religious belief in personalized advertising` remains `Approved (limited)` for extensions/business-name and logo assets. The live homepage still returns `HTTP 200` and still includes visible `CTA` text in both header and footer.

Update 2026-06-29: confirmed there is NO self-serve appeal control for a disapproved business-name asset anywhere in the Ads UI (verified manually via the bulk-select toolbar, the row status dropdown, the status cell, and the `Add to` menu — all expose only `Remove`/`Pause`/`Enable`/`Add to`). The Google Ads support assistant, driven through its shared browser, independently confirmed the same: it stated that "the standard automated appeal tools often require an ad group association," which is the structural reason the campaign-level `CTA` asset cannot be cleanly appeal-scoped and why prior appeal `56380626` mis-attached to the `Science & Faith & Spirituality` ad group. As the only path to a correctly-scoped human review, a manual policy-review case was filed via the support `ad_review_request` Email form (channel scoped to account param `4592562474` = CTA), `Assets` review type, campaign `USA` (`802881820`), ad-group field left blank, with a summary explicitly requesting NOT to appeal via any ad group. Confirmation email from `ads-support@google.com`, **Case ID `1-2059000040983`** (received 2026-06-29 ~12:25 CDT). Caveat: the form warns it is intended for ads "under review," not disapprovals, so Google may still redirect it. Note: the support form showed a generic "you canceled your account" banner, but the live CTA account overview confirmed the account is Enabled/active (16 clicks, 260 impressions, $16.09 over the last 30 days), so that banner was stale/generic, not a real account-cancellation signal.

## Conversion Tracking State

Current tracking measures membership intent on the `/join/*` handoff pages:

- GA4 event: `membership_signup_intent`.
- Google Ads conversion: `Membership`.
- Free membership redirects to Mailchimp.
- Voting membership redirects to Stripe.

Known measurement gap: this records intent/outbound handoff, not confirmed Mailchimp or Stripe completion. A server-side completion webhook remains one of the highest-leverage funnel improvements because it would let Ads optimize against real members rather than only click-through intent.

## Immediate Next Actions

1. Monitor support Case ID `1-2059000040983` (manual policy-review for the campaign-level `CTA` business-name asset on `USA`, filed 2026-06-29). 2026-06-30: an email update was received from Google, but it contained NO determination yet (still in progress). If Google declines it or redirects it as a disapproval inquiry, stop pursuing `CTA` via appeal: either switch the `USA` business-name asset to `Christian Transhumanist` (23 chars, fits the 25-char limit, closer to the verified legal name) or pursue formal brand verification/trademark evidence. Do not re-save duplicate `CTA` assets (no-op) and do not appeal via any ad group (that caused the failed `56380626`).
2. DONE (2026-06-30): the 4 ad groups that had NO ADS now each have an `Eligible` Responsive Search Ad: `Technology and Human Flourishing`, `Radical Longevity`, `Zero to One Future`, `Kevin Kelly Technology`. See `docs/google-ads-operations.md` -> `June 30, 2026 Recreated the 4 Missing Ads`. Next: watch that they clear review and start collecting impressions now that they can serve.
3. Monitor the `AI Ethics and Future` keyword-broadening test (8 new phrase-match keywords + 37 campaign negatives added 2026-06-29). Watch ACCOUNT-level CTR over 7 days; if it holds >=5%, replicate phrase-broadening on `AI and Human Flourishing` and `Brain-Computer Interfaces`. Do not use broad match until conversion tracking works (Ad Grants 5% account CTR rule, no bid-strategy exemption).
4. All four formerly-pending ad groups are now `Eligible` (`Ray Kurzweil Singularity`, `David Deutsch Progress`, `David Pearce Ending Suffering`, `Robin Hanson Futurism`) — no longer need approval monitoring.
5. Monitor the new campaign-level `Join Free` and `Voting Membership` sitelinks until they move from `Pending / Under review` to eligible or policy-limited.
6. Add confirmed-conversion tracking for Mailchimp and Stripe completions, or at minimum document exactly why it is blocked. This is the highest-leverage unlock: it is the prerequisite for safely using broad match + Smart Bidding to actually spend the Ad Grant.
7. Build the next podcast-backed landing pages and ad groups from `docs/google-ads-thinker-topic-map.md`. Highest near-term candidates: Taryn Southern / Derek Webb, Katharine Hayhoe, Steve Fuller, Liz Parrish, Frank Tipler, Calvin Mercer / Ron Cole-Turner.
8. Continue pruning zero-click, policy-risky, or disapproved legacy assets.

## Repo Safety

At the time this file was created, local `main` was ahead of `origin/main` by 9 commits and had uncommitted docs changes. Do not push blindly from this checkout; review unrelated local commits before publishing.

# CTA Google Ads Operations Notes

Working notes for managing the Christian Transhumanist Association Google Ads / Ad Grants account.

## Account and Navigation

- CTA Google Ads customer ID: `459-256-2474`.
- Google Ads may show a manager/context `ocid` in browser URLs. On June 17, 2026, the working signed-in account URLs used `ocid=217504736` with `__e=4592562474`.
- Email links to the old Policy Manager route can 404 after sign-in. If that happens, open the account Overview first, then navigate through the UI:
  - `Admin` -> `Policy` -> `Ads` for policy issues.
  - `Assets` -> `Associations` for account/campaign assets.
- Google has renamed Policy Manager to `Ads` inside `Admin` -> `Policy`. The direct route observed in the UI was `/aw/policy/ads/issues`.

## Policy Issue Workflow

1. Search Gmail for recent Google Ads policy notifications:
   - `newer_than:14d ("Google Ads" OR "Google Ad Grants" OR "Ad Grants" OR ads-noreply OR googleads) -in:spam -in:trash`
2. Open Google Ads, then `Admin` -> `Policy` -> `Ads`.
3. Match the policy name, affected count, and asset type from the email to the policy group in the UI.
4. Open the generated asset-type link from the policy group. Google will apply a `tableState` filter for the specific policy topic.
5. If the row cells do not render in the browser automation text, open the table `Download` menu. This can force the virtualized row to render and expose the asset text, final URL, and policy metadata.
6. Fix the asset or destination. Editing an asset resubmits it for review automatically.
7. Do not apply for a certification unless CTA actually offers the regulated product or service covered by the certification.

## June 17, 2026 Free Desktop Software Issue

Email details:

- Subject: `Policy issues (1)`
- Customer ID: `459-256-2474`
- Status: `Disapproved`
- Policy: `Free desktop software`
- Detail: `Certificate required: Free desktop software`
- Impacted type in Google Ads: `Extensions (1)` -> `Sitelinks`

Fix applied in Google Ads:

- Campaign: `USA`
- Original sitelink: `Blog`
- Original final URL: `https://www.christiantranshumanism.org/blog/`
- Original descriptions: `Read CTA essays and updates` / `Faith, science, and future`
- Policy metadata exposed by the row: `FREE_DESKTOP_SOFTWARE`, `globalCertificateMissing`, `FULLY_AUTOMATED`
- Updated sitelink: `Media`
- Updated final URL: `https://www.christiantranshumanism.org/media/`
- Updated descriptions: `Articles, talks, podcasts` / `Ideas on tech and future`

Result: after saving, the `Free desktop software` sitelink issue no longer appeared on `Admin` -> `Policy` -> `Ads`. Remaining policy items were separate business-name/business-logo issues related to religious-belief personalization and name prominence.

## Policy-Sensitive Advertising Rules

- Avoid ad text that implies a user's religious identity or other sensitive trait.
- Use topic and resource framing: "Explore future-focused resources" is safer than identity-targeted phrasing.
- Prefer first-party CTA landing pages with clear editorial intent over broad indexes when Google flags a destination.
- For false software/download classifications, first remove or reroute the suspicious destination. Certification is the wrong path unless CTA is actually distributing desktop software.

## Business Name / Logo Policy Issues

On June 17, 2026, the remaining policy issues included:

- `Religious belief in personalized advertising`
- `Business Information - Name Prominence`

The actionable business-name association rows were:

- `Interviews & Celebrities` -> `Christian Transhumanism`
- `Noland-Arbaugh-Video-1` -> `Christian Transhumanism`
- `dale-allison-miracles-1` -> `Religious Transhumanism`

The `Interviews & Celebrities` association was removed from the filtered `Assets` -> `Associations` report. The other two rows remained visible afterward.

Operational caveat: the `Assets` -> `Associations` toolbar is unreliable for this asset type. Bulk `Remove` and `Pause` on business-name assets produced Google's warning that assets cannot be removed across multiple pages and that some asset types do not support bulk operations. Scoping the report to a single campaign and selecting the one visible row still triggered the same bulk-operation warning for `Remove`, and `Pause` returned `Your change was not applicable to any selected assets`.

June 22 source-level fix:

- The remaining two disapproved rows were Performance Max campaign-level brand-guideline assets, not ordinary removable asset associations.
- Source route:
  - Open `Assets` -> `Associations` with the policy-filtered business-name report.
  - Click the affected campaign name.
  - Open `Campaign settings`.
  - Scroll to `Brand guidelines` -> `Brand identity`.
  - Edit `Business name`.
- Updated `Noland-Arbaugh-Video-1` from `Christian Transhumanism` to `CTA`.
- Updated `dale-allison-miracles-1` from `Religious Transhumanism` to `CTA`.
- After saving both changes and refreshing the policy-filtered business-name report, Google Ads showed `No assets match your filters`.
- `Admin` -> `Policy` -> `Ads` no longer showed the `Business Information - Name Prominence` disapproval. It still showed one `Religious belief in personalized advertising` item as `Approved (limited)` for business names/logos, which appears to be a serving limitation/review state rather than a blocking disapproval.

Current rule: for Performance Max campaigns, fix sensitive or non-prominent business-name policy issues in campaign `Brand guidelines`, not from the asset association toolbar.

## Deployment Notes

- Site changes are committed and pushed to GitHub, but Git pushes did not trigger a production deploy during the June 22 review. Netlify still reported the June 17 deploy for commit `d0988c9` after commit `b13ecd1` was pushed.
- The connected Netlify project is `cta-site`, site ID `e9773937-90f4-411c-b900-7cb77166ee0f`. A production source upload through the Netlify connector created deploy `6a3942941692430bae82291d` and published the AI landing page.
- Until Git auto-deploy is repaired, verify the current production deploy after each site push and trigger an explicit Netlify production deploy when needed.
- On June 22, 2026, `/join/future/`, `/join/free/`, and `/join/voting/` all returned `200` in production. The earlier `/join/future/` deployment blocker is resolved.
- Live HTML verification found the Ads destination `AW-856723569/b4ANCLq5oXEQ8aDCmAM` and GA4 event `membership_signup_intent` on both membership handoff pages.
- Google Ads conversion diagnostics still need to confirm that Google has received a real event; code presence alone does not prove recorded conversions.

## June 22, 2026 Membership Conversion Diagnosis

Google Ads reported the website conversion action `Membership` as `Needs attention` with `Tag inactive`. Its last recorded tag activity was November 30, 2022. The action remained enabled, primary, included in the account-level Sign-up goal, and assigned to all eight campaigns.

The production pages contained the correct destination, `AW-856723569/b4ANCLq5oXEQ8aDCmAM`, but `/join/free/` and `/join/voting/` fired the event immediately on page load and redirected off-domain after 1.2 seconds. Tag Assistant initially lost its live connection when the page redirected, but its completed session detected the GA4/Google Ads tag and recorded both the `Membership` Ads hit and `membership_signup_intent` event. This proves the Ads ID and conversion label are valid. The remaining problem was stale activity, while the page-load trigger also counted page arrival rather than the visitor's membership handoff action.

Fix: retain the external URL as the no-JavaScript fallback, but fire `ctaReportMembershipConversion` only when the visitor clicks `Continue`. The event callback still performs the external navigation, with the existing timeout as a fallback. After production deployment, run Tag Assistant against each handoff page, click `Continue`, and refresh Google Ads diagnostics. Google may take several hours to update the tracking status.

Later June 22 browser check: `Goals` -> `Summary` showed the account-default `Sign-up` goal as `Active`, assigned to `8 of 8` campaigns, with `1` primary conversion action. This suggests Google Ads has accepted the conversion setup at the goal level. Continue monitoring actual conversion counts separately; the last 30-day campaign report still showed `0.00` conversions.

## June 23, 2026 AI and Human Flourishing Search Ad Group

Created a new Search ad group in the `USA` campaign for the live landing page:

- Campaign: `USA`
- Campaign ID: `802881820`
- Ad group: `AI and Human Flourishing`
- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/topics/ai-human-flourishing/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=ai_human_flourishing`
- Display path: `/ai/human-flourish`
- Business name: `CTA`

Keyword set:

```text
[ai human flourishing]
"ai human flourishing"
[artificial intelligence ethics]
"artificial intelligence ethics"
[technology and human flourishing]
"technology and human flourishing"
[ai and human values]
"ai and human values"
[responsible ai future]
"responsible ai future"
```

Ad copy:

- `AI and Human Flourishing`
- `Explore Responsible AI`
- `Technology Serving Life`
- `AI, Dignity and Purpose`
- `Ideas for Humanity Future`
- `Responsible Progress in AI`
- `Human-Centered AI Futures`
- `Essays and resources on AI, responsibility, and the future worth building.`
- `Explore thoughtful resources on technology, human dignity, and long-term hope.`

Important setup detail: Google prefilled the new ad draft with religion-forward suggestions such as `What does the Bible say?`, `Christianity & Transhumanism`, and a description about `God's plan`. These were overwritten before saving. After saving, the ad group table showed `AI and Human Flourishing` as `Eligible`.

Follow-up: the campaign still inherits older sitelinks such as `Join`, `FAQ`, and `About Us`. If the new ad group gets limited by religious-belief policy or low relevance, create neutral campaign/ad-group-level sitelinks for the topic page and membership handoff instead of relying on the inherited sitelinks.

Created a second Search ad group in the `USA` campaign using the same AI landing page:

- Campaign: `USA`
- Campaign ID: `802881820`
- Ad group: `AI Ethics and Future`
- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/topics/ai-human-flourishing/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=ai_ethics_future`
- Display path: `/ai/ethics-future`
- Business name: `CTA`

Keyword set:

```text
[ai ethics]
"ai ethics"
[ethical ai]
"ethical ai"
[responsible artificial intelligence]
"responsible artificial intelligence"
[responsible ai]
"responsible ai"
[future of ai]
"future of ai"
[ai and human values]
"ai and human values"
```

Ad copy:

- `AI Ethics and Future`
- `Responsible AI Ideas`
- `Explore Ethical AI`
- `AI and Human Values`
- `Build Better AI Futures`
- `Technology Serving Life`
- `Future of Responsible AI`
- `Essays on AI ethics, responsibility, and the future worth building.`
- `Explore resources on technology, human dignity, and human-centered AI.`

After saving, the ad group table showed `AI Ethics and Future` as `Eligible`. The `USA` campaign then showed `8` ad groups.

## June 23, 2026 Brain-Computer Interfaces Landing Page

Added a second Tier 1 topic landing page for future Search traffic:

- Local source: `src/topics/brain-computer-interfaces.njk`
- URL: `/topics/brain-computer-interfaces/`
- Positioning: brain-computer interfaces, assistive technology, human agency, privacy, restorative priority, and responsible interface design.
- Resource links: Noland Arbaugh interview, Brain-Computer Interfaces wiki, Brain Augmentation Bill of Rights, and Super-Embodiment.
- Membership CTAs: `/join/future/`, `/join/free/`, and `/join/voting/`.

Local build verification passed with `npm run build`; Eleventy wrote `_site/topics/brain-computer-interfaces/index.html`.

Deploy status: commit `444a258` was pushed to `main`. A Netlify source-upload deploy was started as deploy `6a39fbd318a625a1a59ca6ae`, but it remained in `new` / `building` state for several minutes and production initially returned `404` for `/topics/brain-computer-interfaces/`. On June 23, 2026, production returned `200` for the page.

Created the matching Search ad group after production returned `200`:

- Ad group: `Brain-Computer Interfaces`
- Final URL: `https://www.christiantranshumanism.org/topics/brain-computer-interfaces/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=brain_computer_interfaces`
- Display path: `/bci/human-agency`
- Status after save: `Eligible`
- Initial bid: `$2.00 (enhanced)`
- Business name: `CTA`

Final keyword set:

```text
[brain computer interface]
"brain computer interface"
[brain-computer interfaces]
"brain-computer interfaces"
[bci ethics]
"bci ethics"
[neurotechnology ethics]
"neurotechnology ethics"
[neural interface technology]
"neural interface technology"
[neural interface ethics]
"neural interface ethics"
```

Ad copy:

- `Brain-Computer Interfaces`
- `Explore BCI Ethics`
- `Neurotech and Agency`
- `Human-Centered Interfaces`
- `Assistive Tech Futures`
- `BCI and Human Agency`
- `Responsible Neurotech`
- `Resources on brain-computer interfaces, agency, privacy, and responsible design.`
- `Explore neurotechnology, assistive tech, and the future of embodied action.`

Policy note: Google blocked the keyword `assistive technology future` under `Health in personalized advertising`. Do not use health-, disability-, injury-, or medical-condition-adjacent keyword phrasing in BCI ad groups unless intentionally pursuing a policy review. The final saved keyword set removed that term and returned to the campaign table as `Eligible`.

## June 23, 2026 Next Topic Landing Pages

Added two additional topic landing pages for future Search traffic expansion:

- `/topics/radical-longevity/`
  - Source: `src/topics/radical-longevity.njk`
  - Positioning: longevity research, healthspan, aging ethics, access, agency, and the purpose of longer lives.
  - Resource links: Super-Longevity, CTA Statement on Radical Life Extension, BBC Why Factor interview, Christianity Today anti-aging article, Ending Aging, and CTA beliefs on longevity.
  - Suggested future ad group themes: `Radical Longevity`, `Life Extension Ethics`, `Healthy Longevity Research`.
  - Policy caveat: avoid ad copy and keywords that imply the user is old, sick, afraid of death, seeking medical treatment, or has a medical condition. Prefer broad research/ethics language such as `life extension ethics`, `radical longevity`, `healthspan research`, and `longevity debate`.
- `/topics/dominion-and-the-future-of-values/`
  - Source: `src/topics/dominion-and-the-future-of-values.njk`
  - Positioning: Tom Holland's `Dominion`, moral history, human dignity, rights, progress, institutions, and future values.
  - Resource links: Christianity is the origin, Religious concepts as civilizational infrastructure, Christianity and the Scientific Revolution, Christian history of transhumanism, and CTA worldview.
  - Suggested future ad group themes: `Dominion and Moral History`, `Future of Values`, `Human Dignity and Technology`.
  - Policy caveat: ad copy should not imply the viewer has a religious identity. Safer framing: `Explore moral history`, `Human dignity and future values`, `Tom Holland Dominion themes`, `Technology needs moral memory`.

Both pages use the same topic landing page structure as the existing AI and BCI pages and route visitors toward `/join/future/`, `/join/free/`, and `/join/voting/`.

Deploy status: commit `b6fe889` was pushed to `main`; production initially returned `404` for both URLs while Netlify remained on older deploy `6a3a7b3b91db7a0008d3b960` from commit `ae8212c`. A Netlify source-upload deploy was also started as deploy `6a3a7d50fa3c1e6988b01dbf`, but the API stayed inconsistent while production updated separately. Final verification on June 23, 2026: both `/topics/radical-longevity/` and `/topics/dominion-and-the-future-of-values/` returned `200` in production, with the expected headings, resource links, and membership CTAs. Netlify project state showed current ready deploy `6a3a7d04475cfa0009a334ef`.

Created matching Search ad groups in the `USA` campaign after both pages were live:

### Radical Longevity

- Campaign: `USA`
- Campaign ID: `802881820`
- Ad group: `Radical Longevity`
- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/topics/radical-longevity/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=radical_longevity`
- Display path: `/longevity/healthspan`
- Business name: `CTA`

Keyword set:

```text
[radical longevity]
"radical longevity"
[life extension ethics]
"life extension ethics"
[healthspan research]
"healthspan research"
[longevity ethics]
"longevity ethics"
[future of longevity]
"future of longevity"
[ending aging debate]
"ending aging debate"
```

Ad copy:

- `Radical Longevity`
- `Life Extension Ethics`
- `Explore Healthspan`
- `Longevity and Purpose`
- `Future of Longer Life`
- `Responsible Longevity`
- `Healthspan Research`
- `Explore resources on longevity research, healthspan, ethics, and longer flourishing lives.`
- `Longer life raises questions about access, agency, purpose, and the future.`

Operational note: saving the ad triggered Google reauth for `AD_FINAL_URL`. After Micah completed passkey verification, returning to the campaign table showed `Radical Longevity` persisted and was `Eligible`.

Policy note: keep this ad group away from personalized medical language. Avoid phrasing that implies the searcher is old, sick, has a medical condition, fears death, or is seeking treatment. The saved keyword set uses research, ethics, and future-oriented terms instead.

### Dominion and Future Values

- Campaign: `USA`
- Campaign ID: `802881820`
- Ad group: `Dominion and Future Values`
- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/topics/dominion-and-the-future-of-values/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=dominion_future_values`
- Display path: `/values/future`
- Business name: `CTA`

Keyword set:

```text
[tom holland dominion]
"tom holland dominion"
[dominion tom holland]
"dominion tom holland"
[moral history]
"moral history"
[future of values]
"future of values"
[human dignity technology]
"human dignity technology"
[technology and values]
"technology and values"
```

Ad copy:

- `Tom Holland Dominion`
- `Future of Values`
- `Explore Moral History`
- `Human Dignity Future`
- `Technology and Values`
- `Values for the Future`
- `Moral Memory Matters`
- `Explore moral history, human dignity, rights, and future values in a tech age.`
- `Resources on Dominion themes, humane progress, and values for the future.`

Policy note: Google again prefilled the ad draft with religion-forward suggestions such as `Christianity & Transhumanism`, `What does the Bible say?`, and a description about `God's plan`. These were overwritten before saving. Keep ad copy about moral history, human dignity, values, and Tom Holland's `Dominion`; do not write copy implying the viewer is Christian, religious, deconstructing, doubting, or otherwise in a sensitive religious category.

After both ad groups were saved, the `USA` campaign table showed `Ad groups (11)`, with both `Radical Longevity` and `Dominion and Future Values` present as `Eligible`.

## June 23, 2026 Ad-Group Sitelink Attempt

Attempted to add ad-group-level sitelinks for the five new topic expansion ad groups:

- `AI and Human Flourishing`
- `AI Ethics and Future`
- `Brain-Computer Interfaces`
- `Radical Longevity`
- `Dominion and Future Values`

Workflow used:

1. Opened `Assets` -> `Associations` filtered to `assetType=sitelink` for the `USA` campaign.
2. Clicked `Create asset`.
3. Changed `Add to` from `Campaign` to `Ad group`.
4. Selected the five target ad groups in the `Select ad groups` dialog.
5. Added two neutral membership sitelinks:
   - `Join Free` -> `https://www.christiantranshumanism.org/join/free/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=sitelink_join_free`
   - `Voting Membership` -> `https://www.christiantranshumanism.org/join/voting/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=sitelink_voting`

Result: after saving, Google Ads returned to the sitelink associations report. However, after refreshing the report, the visible page text did not include `Join Free` or `Voting Membership`, and the rows were not visible in the virtualized table. Treat this as an inconclusive / not verified mutation. Do not assume the new sitelinks are active until a later browser check confirms the rows in `Assets` -> `Associations` or in each ad group's asset view.

Operational caveat: the sitelink creation form has a horizontally scrollable layout and accordion panels that can collapse or hide fields while browser automation is interacting with it. For future attempts, add one or two sitelinks at a time and verify the association rows immediately after save. If the association report remains unreliable, try adding sitelinks from the ad creation/edit flow for one ad group at a time.

## June 23, 2026 Next Landing Page Batch

Added two more topic landing pages for the next Search expansion batch:

- `/topics/technology-and-human-flourishing/`
  - Source: `src/topics/technology-and-human-flourishing.njk`
  - Positioning: responsible technology, human dignity, shared flourishing, stewardship, access, and accountable hope.
  - Resource links: Ethical Technology, Creation Mandate, Christian Transhumanist Affirmation, Ethical Technology wiki, Books, and Media.
  - Suggested future ad group themes: `Technology and Human Flourishing`, `Responsible Technology`, `Technology Serving Life`.
  - Policy caveat: keep ad copy about technology, dignity, flourishing, stewardship, and future-building. Avoid copy that infers the viewer's religious identity.
- `/topics/human-enhancement-ethics/`
  - Source: `src/topics/human-enhancement-ethics.njk`
  - Positioning: human enhancement ethics, embodiment, agency, dignity, justice, access, and transhuman flourishing.
  - Resource links: CTA beliefs on enhancement, Super-Embodiment, Brain Augmentation Bill of Rights, Religion and Human Enhancement, Religion and the Technological Future, and Technologies of the Future Self.
  - Suggested future ad group themes: `Human Enhancement Ethics`, `Technology and Human Enhancement`, `Transhuman Flourishing`.
  - Policy caveat: avoid ad copy implying a user's disability, medical condition, body dissatisfaction, or health status. Use ethics/research language rather than problem-solution language about the viewer's body.

Local build verification passed with `npm run build`; Eleventy wrote both `_site/topics/technology-and-human-flourishing/index.html` and `_site/topics/human-enhancement-ethics/index.html`. The changes were committed to `main` and pushed to GitHub as `831e4ce` (`Add next topic landing pages`). Production initially returned `404` because the local `.netlify/state.json` pointed at the non-production `cta-site` project (`e9773937-90f4-411c-b900-7cb77166ee0f`). The live domain is served by the `christian-transhumanism` project (`1ecf40b9-9df1-415f-ab0f-125cdeae0ca8`). After Netlify auth was refreshed, production served both URLs with `HTTP 200` on June 23, 2026. Use the live-domain project ID for future deploys.

## June 23, 2026 Technology and Enhancement Search Ad Groups

After verifying both new landing pages returned `HTTP 200` in production, added two more Search ad groups to the `USA` campaign (`campaignId=802881820`).

### Technology and Human Flourishing

- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/topics/technology-and-human-flourishing/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=technology_human_flourishing`
- Business name: `CTA`

Keyword set:

```text
[technology and human flourishing]
"technology and human flourishing"
[responsible technology]
"responsible technology"
[technology ethics]
"technology ethics"
[human dignity technology]
"human dignity technology"
[technology for human flourishing]
"technology for human flourishing"
[future of technology ethics]
"future of technology ethics"
```

Ad copy:

- `Responsible Technology`
- `Human Dignity and Tech`
- `Future Tech Ethics`
- `Technology Serving Life`
- `Build Humane Futures`
- `Ethics for New Tech`
- `Shared Flourishing`
- `Explore responsible technology, human dignity, and shared flourishing in a tech age.`
- `Resources on future-building, ethics, and technology that serves human life.`

Operational note: saving the ad triggered Google reauth for `AD_FINAL_URL`. After Micah completed passkey verification, the post-auth redirect stayed on Google's loading page, but returning to the `USA` campaign ad-group table showed `Ad groups (12)` and `Technology and Human Flourishing` present as `Eligible`.

### Human Enhancement Ethics

- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/topics/human-enhancement-ethics/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=human_enhancement_ethics`
- Business name: `CTA`

Keyword set:

```text
[human enhancement ethics]
"human enhancement ethics"
[human enhancement technology]
"human enhancement technology"
[enhancement ethics]
"enhancement ethics"
[future of human enhancement]
"future of human enhancement"
[transhumanism ethics]
"transhumanism ethics"
[technology and human enhancement]
"technology and human enhancement"
```

Ad copy:

- `Human Enhancement Ethics`
- `Enhancement and Dignity`
- `Future Enhancement Ethics`
- `Technology and Agency`
- `Transhumanism Ethics`
- `Responsible Enhancement`
- `Human Flourishing Tech`
- `Explore human enhancement ethics, dignity, agency, access, and responsible futures.`
- `Resources on enhancement technology, justice, and human flourishing in a tech age.`

Policy note: Google again prefilled both ad drafts with religion-forward suggestions such as `Christianity & Transhumanism`, `What does the Bible say?`, and a description about `God's plan`. These were overwritten before saving. For `Human Enhancement Ethics`, also avoid copy implying the viewer has a disability, medical condition, body dissatisfaction, or health concern. Keep future copy framed around ethics, agency, dignity, access, justice, and research.

After both ad groups were saved, the `USA` campaign table showed `Ad groups (13)`, with both `Technology and Human Flourishing` and `Human Enhancement Ethics` present as `Eligible`.

## June 23, 2026 Legacy Religion-Forward Ad Group Audit

Audited the older religion-forward `USA` ad groups after adding the neutral topic expansion set. The campaign's last-30-days table showed `5` clicks, `36` impressions, `$8.20` spend, and `0.00` conversions. The only older religion-forward groups with recent clicks were:

- `Christianity & Transhumanism`: `3` clicks, `8` impressions, `37.50%` CTR, `$4.37` cost.
- `Future of Christianity`: `2` clicks, `11` impressions, `18.18%` CTR, `$3.83` cost.

Decision: leave those two enabled temporarily because they account for all recent campaign clicks. Revisit once the seven neutral topic expansion groups have enough impressions and search-term data to compare.

Paused these zero-click / higher-policy-risk legacy ad groups:

- `Christianity and Technology`: `0` clicks, `17` impressions.
- `God & AI`: `0` clicks, `0` impressions.
- `Religion and Technology`: `0` clicks, `0` impressions.

`Science & Faith & Spirituality` was already paused due to low activity. This trims sensitive/religion-forward inventory that was not producing traffic, while preserving current traffic sources during the transition to neutral topic campaigns.

## June 23, 2026 Thinker / Book Search Test Batch

Added three more fast-learning Search ad groups to the `USA` campaign (`campaignId=802881820`) using existing production `wiki` pages that already returned `HTTP 200`. These are test lanes for named thinker / book search intent. The ads are framed as CTA resources/commentary and do not imply endorsement by the named figures.

### Ray Kurzweil Singularity

- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/wiki/the-singularity-is-near-when-humans-transcend-biology/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=ray_kurzweil_singularity`
- Business name: `CTA`

Keyword set:

```text
[ray kurzweil singularity]
"ray kurzweil singularity"
[the singularity is near]
"the singularity is near"
[kurzweil ai future]
"kurzweil ai future"
[kurzweil longevity]
"kurzweil longevity"
[singularity ai future]
"singularity ai future"
[future of humanity ai]
"future of humanity ai"
```

Ad copy:

- `Ray Kurzweil Future`
- `The Singularity Is Near`
- `AI and Humanity Future`
- `Explore Future Tech`
- `Kurzweil and AI`
- `Singularity Resources`
- `Longevity and AI`
- `Explore resources on Kurzweil, AI, longevity, and the future of humanity.`
- `CTA commentary and links on the Singularity and future-facing technology.`

### David Deutsch Progress

- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/wiki/the-beginning-of-infinity-explanations-that-transform-the-world/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=david_deutsch_progress`
- Business name: `CTA`

Keyword set:

```text
[david deutsch beginning of infinity]
"david deutsch beginning of infinity"
[david deutsch optimism]
"david deutsch optimism"
[david deutsch progress]
"david deutsch progress"
[beginning of infinity]
"beginning of infinity"
[universal explainers]
"universal explainers"
[optimism progress philosophy]
"optimism progress philosophy"
```

Ad copy:

- `David Deutsch Progress`
- `Beginning of Infinity`
- `Explore Optimism`
- `Universal Explainers`
- `Progress and Knowledge`
- `Explanations Transform`
- `Knowledge and Progress`
- `Explore resources on David Deutsch, progress, knowledge, and the future of humanity.`
- `CTA commentary and links on optimism, explanations, and future-building.`

### Zero to One Future

- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/wiki/zero-to-one-notes-on-startups-or-how-to-build-the-future/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=zero_to_one_future`
- Business name: `CTA`

Keyword set:

```text
[zero to one future]
"zero to one future"
[zero to one peter thiel]
"zero to one peter thiel"
[how to build the future]
"how to build the future"
[startups build the future]
"startups build the future"
[progress and innovation]
"progress and innovation"
[future building technology]
"future building technology"
```

Ad copy:

- `Zero to One Future`
- `Build the Future`
- `Progress and Innovation`
- `Future-Building Ideas`
- `Technology and Progress`
- `Startups and Progress`
- `Future Tech Ideas`
- `Explore resources on Zero to One, innovation, technology, and future-building.`
- `CTA commentary and links on progress, startups, and responsible technology.`

Operational notes:

- Google again prefilled all ad drafts with religion-forward suggestions such as `Christianity & Transhumanism`, `What does the Bible say?`, and a description about `God's plan`. These were overwritten before saving.
- For `David Deutsch Progress` and `Zero to One Future`, the editable fields updated before the ad preview did. The stale preview still showed the religion-forward template until the last headline/description fields were nudged. Do not save until both editable fields and preview are clean.
- Google showed an optional `Confirm it's you` dialog after saving `Zero to One Future`; using `Skip` returned to the campaign table, and the ad group persisted.
- After this batch, the `USA` campaign table showed `Ad groups (16)` with `Ray Kurzweil Singularity`, `David Deutsch Progress`, and `Zero to One Future` all present as `Eligible`.

## June 23, 2026 Podcast-Backed Guest Search Test Batch

After adding the full podcast interview inventory to `docs/google-ads-thinker-topic-map.md`, added three more small Search tests from the highest-priority podcast-backed lanes with live production URLs.

### Kevin Kelly Technology

- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/wiki/what-technology-wants/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=kevin_kelly_technology`
- Business name: `CTA`

Keyword set:

```text
[kevin kelly technology]
"kevin kelly technology"
[what technology wants]
"what technology wants"
[kevin kelly what technology wants]
"kevin kelly what technology wants"
[technology wants]
"technology wants"
[technology as life]
"technology as life"
[future technology trends]
"future technology trends"
```

Ad copy:

- `Kevin Kelly Technology`
- `What Technology Wants`
- `Explore Future Tech`
- `Technology and Life`
- `Future Tech Resources`
- `The Inevitable Future`
- `Tech Evolution Ideas`
- `Explore CTA resources on Kevin Kelly, technology, life, and future trends.`
- `Commentary and links on technology evolution, AI, and human futures.`

Operational note: saving triggered Google `AD_FINAL_URL` passkey reauth. After Micah completed verification, the campaign table showed `Kevin Kelly Technology` present as `Eligible`.

### David Pearce Ending Suffering

- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/podcast/41/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=david_pearce_ending_suffering`
- Business name: `CTA`

Keyword set:

```text
[david pearce ending suffering]
"david pearce ending suffering"
[david pearce paradise engineering]
"david pearce paradise engineering"
[paradise engineering]
"paradise engineering"
[ending suffering ethics]
"ending suffering ethics"
[hedonistic imperative]
"hedonistic imperative"
[engineering paradise]
"engineering paradise"
```

Ad copy:

- `David Pearce Interview`
- `Ending Suffering Ethics`
- `Paradise Engineering`
- `Engineering Paradise`
- `Future Ethics Resources`
- `Explore Humane Futures`
- `Technology and Suffering`
- `Listen to CTA conversation on ending suffering, ethics, and future technology.`
- `Resources and commentary on humane futures, suffering, and responsible progress.`

### Robin Hanson Futurism

- Initial bid: `$2.00 (enhanced)`
- Status after save: `Eligible`
- Final URL: `https://www.christiantranshumanism.org/podcast/37/?utm_source=google&utm_medium=cpc&utm_campaign=usa_search&utm_content=robin_hanson_futurism`
- Business name: `CTA`

Keyword set:

```text
[robin hanson futurism]
"robin hanson futurism"
[robin hanson elephant in the brain]
"robin hanson elephant in the brain"
[elephant in the brain]
"elephant in the brain"
[great filter robin hanson]
"great filter robin hanson"
[simulation argument futurism]
"simulation argument futurism"
[human uploads future]
"human uploads future"
```

Ad copy:

- `Robin Hanson Futurism`
- `Elephant in the Brain`
- `Great Filter Futures`
- `Simulation and Motives`
- `Human Uploads Future`
- `Futurism Interview`
- `Explore Future Motives`
- `Listen to CTA conversation on futurism, motives, simulation, and human futures.`
- `Resources and commentary on the ideas shaping long-term human possibilities.`

Operational notes:

- The same Google-generated religion-forward draft pattern appeared. No ad was saved while `Christianity & Transhumanism`, `What does the Bible say?`, or `God's plan` appeared in editable fields or preview.
- The preview can lag after editing; verify the rendered preview, not just the editable fields.
- After this batch, the `USA` campaign table showed `Ad groups (19)`. `Kevin Kelly Technology`, `David Pearce Ending Suffering`, and `Robin Hanson Futurism` were all present as `Eligible`. `Ray Kurzweil Singularity` and `David Deutsch Progress` had moved to `Pending / All ads under review`, which is expected after recent ad creation.

## June 23, 2026 Live Status Recheck

Opened the saved `USA` campaign ad-group URL in Google Ads:

`https://ads.google.com/aw/adgroups?campaignId=802881820&ocid=217504736&authuser=0&__u=2228876330&__c=4238000864`

The account loaded without requiring another passkey challenge. The campaign still showed `Ad groups (19)`.

Visible reporting-period totals remained:

- Clicks: `5`
- Impressions: `36`
- CTR: `13.89%`
- Average CPC: `$1.64`
- Cost: `$8.20`
- Conversions: `0.00`

Status changes from the previous checkpoint:

- `David Deutsch Progress` — `Pending / All ads under review`.
- `Ray Kurzweil Singularity` — `Pending / All ads under review`.
- `David Pearce Ending Suffering` — now also `Pending / All ads under review`.
- `Robin Hanson Futurism` — now also `Pending / All ads under review`.

The other recently created topic/search-test groups visible in the table remained `Eligible`: `AI and Human Flourishing`, `AI Ethics and Future`, `Brain-Computer Interfaces`, `Dominion and Future Values`, `Human Enhancement Ethics`, `Kevin Kelly Technology`, `Radical Longevity`, `Technology and Human Flourishing`, and `Zero to One Future`.

Checked `Admin` -> `Policy` -> `Ads`. Current policy issues:

- `Business Name Irrelevance` — `Disapproved`, `Extensions (1)`.
- `Religious belief in personalized advertising` — `Approved (limited)`, `Extensions`; still appears to be a serving limitation/review state rather than a blocking disapproval.

Opened the `Business Name Irrelevance` business-name association report. The virtualized table initially rendered no rows; opening the `Download` menu forced the rows to appear. Affected rows:

- `USA` — asset `CTA`, level `Campaign`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:58 PM`.
- `Noland-Arbaugh-Video-1` — asset `CTA`, level `Campaign`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:23 PM`.
- `dale-allison-miracles-1` — asset `CTA`, level `Campaign`, status `Not eligible / Disapproved (Business Name Irrelevance)`, last updated `Jun 22, 2026, 9:25 PM`.

Interpretation: changing campaign brand names to `CTA` cleared the earlier sensitive/name-prominence problem, but likely made the business name too abbreviated for Google's destination relevance check. First attempt to make `CTA` a more prominent on-site brand signal, then recheck policy. If the relevance disapproval remains after production deploy and review, the fallback is to test a longer landing-page-visible business name and accept that it may be limited under religious-belief policy.

Sitelink verification:

- Opened the sitelink associations report with `assetType=sitelink`.
- The report did not contain `Join Free` or `Voting Membership`.
- The table showed `No assets match your filters`, even though totals reflected inherited/other sitelink performance.

Conclusion: the previous bulk attempt to add ad-group-level `Join Free` and `Voting Membership` sitelinks did not create visible active associations. If sitelinks are still desired, recreate them one ad group at a time and verify immediately from that ad group's asset view.

## June 23, 2026 CTA Wordmark Site Update

To support the `CTA` business-name asset without reverting to a religion-forward business name, added a visible `CTA` wordmark to the global site chrome:

- Header: the existing logo link now includes visible text `CTA` beside the logo image.
- Footer: the global footer now starts with a brand block: `CTA` plus `Christian Transhumanist Association`.

This is intended to make `CTA` a prominent on-site brand signal for Google's business-name relevance review while keeping the shorter `CTA` business name available as the less religion-forward Ads asset.

Verification:

- `npm run build` passed.
- Generated HTML for `_site/index.html` and `_site/topics/technology-and-human-flourishing/index.html` contains `site-nav__wordmark` and `footer-brand` with visible `CTA` text.
- Local responsive browser checks passed at `1280x720` and `390x844`; the mobile `CTA` wordmark does not overlap the nav toggle.

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

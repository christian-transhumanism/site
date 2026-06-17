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

## Deployment Notes

- Site changes are committed and pushed to GitHub, but production availability still depends on Netlify deployment.
- On June 16, 2026, Netlify connector deploy attempts returned `500 Internal Server Error`, and local Netlify CLI was not logged in.
- The `/join/future/` page exists in the repo but was still 404 on production until deployment is resolved.

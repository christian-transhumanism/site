---
name: cta-page
description: Draft an unsigned, informative topic page for the CTA website (christiantranshumanism.org) in CTA's characteristic voice and worldview, then deliver it as a git branch + PR for review. Use when the user says "cta page", "write a CTA page", "new topic page", or invokes /cta-page.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# /cta-page — write a CTA topic page in voice, deliver as a PR

Arguments passed: `$ARGUMENTS` (optional. Either a topic phrase / slug, "backlog" or
"next" to pick the best candidate from the backlog, or empty to be offered candidates.)

## What this skill is for

The CTA website hosts **informative topic pages** at `/topics/<slug>/` — pages that
teach and frame a question (AI, longevity, the rationality of faith, …) in CTA's
characteristic voice and worldview. They are **unsigned**: no author byline, spoken in
CTA's institutional voice. This skill produces one such page, end to end, and hands it
off as a PR.

All paths below are relative to this repo's root.

The prototype is **`src/topics/ai-human-flourishing.njk`** — the quality bar and the
rendering reference, not a rigid template. Page structure follows the topic's own
content (loose reference); reuse the real `topic-landing__*` CSS classes so it renders.

### Boundaries (read before acting)

- **This skill drafts and opens a PR; it does not merge or deploy.** Netlify deploys
  from `main`; a PR branch stays off production (and may get a Netlify deploy preview
  for review). `/topics/*` pages are Google Ads funnel landing pages, so they intersect
  the live growth work — the PR-and-review handoff is deliberate.
- **Never `git add -A` in this repo.** The working tree routinely carries the site
  operator's uncommitted work (e.g. `docs/google-ads-*.md`, board notes). Stage
  **only** the new page file path. See Step 6.
- **Voice and worldview are not freelance.** Follow `VOICE.md` (in this skill dir) —
  especially the terminology guardrails. When in doubt, ground in the corpus, don't
  invent CTA positions.

## Step 1 — Load context

Read into context before drafting:

1. **`VOICE.md`** (this skill dir) — definitions, mottos, the Three Conversions, the
   Three Audiences, terminology guardrails, voice characteristics. The source of truth
   for how the page sounds.
2. **`BACKLOG.md`** (this skill dir) — candidate topics + their worldview anchors +
   audience leads + status.
3. **`src/topics/ai-human-flourishing.njk`** — the prototype: frontmatter shape,
   section vocabulary, the `topic-landing__*` classes, the unsigned voice in practice.
4. Skim **`guidelines.txt`** (repo root) and
   **`src/cta-wiki/CTA Communications Styleguide.md`** only if you need deeper
   grounding than VOICE.md gives (it distills both).

## Step 2 — Choose the topic (name-or-pick)

- **If `$ARGUMENTS` names a topic/slug:** confirm the slug (`/topics/<slug>/`, short,
  hyphenated, stable) and which of the Three Audiences it leads with. If it's already
  in BACKLOG.md, use that row's anchors.
- **If "backlog" / "next" / empty:** read BACKLOG.md, propose the 1–2 strongest
  `idea` candidates with a one-line reason each, and let the user pick. Don't silently
  pick — surface the choice.
- **Check it doesn't already exist:** `ls src/topics/` and
  `git branch -a | grep topic-page` — don't duplicate a live page or an open PR branch.

## Step 3 — Research the worldview corpus

The page must pull from CTA's actual positions, not generic content.

1. From the topic's BACKLOG anchors (or a fresh search), read the relevant
   `src/cta-wiki/*.md` concept notes. Use `rg -l` to find them, e.g.
   `rg -l -i "longevity|life extension" src/cta-wiki`.
2. For CTA's overall messaging frame (problematization-forward hero, Expansive Human
   Futures), see `docs/homepage-messaging.md`.
3. Collect: the specific CTA claims, the right terminology (cross-check VOICE.md §5),
   any scripture CTA actually cites, and 3–5 **real** "go deeper" destinations.
   **Verify each link target exists** before using it — check for a matching
   `src/.../*.njk`, a `src/cta-wiki/<Note>.md` (renders at `/wiki/<slug>/`), or a known
   route (`/beliefs/`, `/mission/`, `/podcast/`, `/join/*`). A dead link is worse than
   no link.

## Step 4 — Draft the page

Write `src/topics/<slug>.njk`.

**Frontmatter** (match the prototype):
```yaml
---
title: <Title Case>
description: <one-sentence meta description, ~150 chars, plain and inviting>
layout: default
permalink: /topics/<slug>/
body_classes: topic-landing-page topic-<slug>-page
---
```

**Structure** — follow the topic, don't fill a fixed mold. Recombine these real
section types (all defined in `src/stylesheets/all.css`, no new CSS needed):

- `topic-landing__hero` — eyebrow ("Christian Transhumanist Association"), `<h1>`,
  `topic-landing__lede`, `topic-landing__actions` (CTAs), and an optional
  `topic-landing__signal` aside for a compact framework/list.
- `topic-landing__band` — a "why it matters" split (`topic-landing__split` with a
  `topic-landing__section-label` + `<h2>` on one side, `topic-landing__prose` on the
  other). `topic-landing__band--ink` is the dark variant for emphasis.
- `topic-landing__principles` — numbered cards (`topic-landing__number` 01–04) for a
  named framework.
- `topic-landing__links` — the "go deeper" resource grid (verified links from Step 3).
- `topic-landing__cta` — closing call to action (`/join/free/`, `/join/voting/`,
  `/join/future/`).

Wrap everything in `<div class="topic-landing topic-landing--<slug>">`. Use the prior
section's IDs/`aria-labelledby` pattern for accessibility.

**Layout: text-native by default (no images).** These pages have no artwork, and the
site has none for them. So **do not use the asymmetric two-column layouts** —
`topic-landing__hero-grid` (parks the signal box in a side column),
`topic-landing__split`, and `__split--resources`. Their near-empty side column reads as
a missing image. Instead **stack everything single-column** inside `.container`:
section-label → `<h2>` → prose. For the hero, drop `__hero-grid` and let the
`topic-landing__signal` card stack *below* the hero copy as a callout (give it a
`margin-top` in the page style block). The `.container` runs up to ~1170px, too wide
for body text, so constrain the reading measure: add a small page-scoped `<style>`
block at the top of the page —
`.topic-landing--<slug> .topic-landing__measure { max-width: 44rem; }` (and optionally
cap `h2` at ~38rem) — and put `topic-landing__measure` on each prose / links wrapper.
Keep the hero's `topic-landing__signal` aside (a real bordered card, not an image slot),
the `topic-landing__principles` cards (balanced 2-col), and the `__cta-inner` (text +
buttons) — those are genuine content and look intentional. If topic pages adopt the
measure pattern widely, propose promoting it into `all.css` as its own PR rather than
repeating the style block.

**Voice rules (from VOICE.md):**
- Unsigned, CTA institutional voice. No "I"; no named author.
- Lead for the chosen audience (§4). Plain language up top, richer worldview underneath.
- Apply the terminology guardrails (§5) — Creation Mandate, Superhuman, Space
  Exploration, likeness-of-Christ language, "working towards," the faith/works
  distinction, the deliberate "apologetics" framing.
- Disciplined hope: name the risks honestly; never naive, never doom.
- A concrete framework (named principles, sharp questions) beats abstraction.

## Step 5 — Verify it renders

From the repo root:
- Run `npm run build` (offline-safe per the README) and confirm the page compiles with
  no template error and the permalink resolves to `/topics/<slug>/`.
- Re-check that every "go deeper" link resolves to a real route.
- Read the rendered prose once more against VOICE.md for terminology slips.

## Step 6 — Deliver as a branch + PR (do NOT merge/deploy)

Stage **only** the new page. The working tree carries the site operator's uncommitted
work — do not sweep it in.

```bash
git fetch origin
git checkout -b topic-page/<slug> origin/main   # branch off latest main; leaves the working tree's other dirty files untouched and uncommitted
git add src/topics/<slug>.njk                    # ONLY this path — never `git add -A`
git commit -m "Add /topics/<slug>/ topic page"
git push -u origin topic-page/<slug>
gh pr create --title "Topic page: <Title>" --body "<see below>" --base main
```

PR body should include: the topic + audience, a one-line summary of the angle, the
worldview anchors used, the "go deeper" links, and an explicit **"site operator:
review before merge — touches the live site funnel"** note. Return the PR URL to the
user.

If `git checkout -b ... origin/main` complains about overwriting local changes (it
shouldn't for untracked/unrelated dirty files), **stop and report** rather than
stashing or discarding — the site operator's work is in that tree.

## Step 7 — Update the backlog

- In **`BACKLOG.md`** (this skill dir): set the topic's status to `drafted` (or add
  the row if it was a named topic not yet listed). Flip to `live` only after the PR
  merges.
- Add any new topic ideas surfaced during research to BACKLOG.md.

## Notes for a cold agent

- **Where this lives in the system:** the page is content for the CTA membership
  website — the landing+conversion half of the Google Ads funnel (see `AGENTS.md` §1;
  messaging layer in `docs/homepage-messaging.md`). `/topics/*` pages are funnel
  landing pages, so they intersect the live growth work — hence the PR-and-review
  handoff.
- **Why unsigned:** these are CTA's institutional voice, by design — not personal
  essays.
- **Companion files are the source of truth:** `VOICE.md` (how it sounds), `BACKLOG.md`
  (what to write next). Read them before judgment calls.

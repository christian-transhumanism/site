# CTA homepage messaging (locked strategy)

New homepage messaging for christiantranshumanism.org, built on the **Expansive Human
Futures** conceptual layer with problematization-forward hero copy. This is the
messaging source of truth for the homepage and the reference frame for topic-page
tone (see `.claude/skills/cta-page/VOICE.md`).

Status: copy locked (hero) / drafted (sections); design direction set, no comps; not
yet built. Migrated into this repo 2026-07-10 from the ED's planning notes.

## Positioning decisions (locked)

- **Hero leads with the problem, not the brand.** The messaging layer (the fork AI
  poses) sits above the brand layer (Expansive Human Futures).
- **Stakes are stated HOT.** "End the world" language stays. Warm or cool hedging will
  read as evasion to anyone already alive to the AI moment.
- **"Transhumanism" does NOT appear above the fold.** It shows up when "we" is
  introduced in Section 2 ("the Christian Transhumanist Association"). The hero
  welcomes; the brand name specifies.
- **Road to Emmaus / Faith-Renewing depth content stays behind a click** — linked from
  Section 4, not the hero.
- **The word "apologetics" is used deliberately, not softened.**

## Final hero copy (locked 2026-05-16)

```
AI could remake the world — or end it.

We are building toward Expansive Human Futures — a vision of human life,
faith, and technology that is larger, not smaller, than what we've been handed.

[ Read our vision ]   [ Join us ]
```

### Underlying sub-claims (visible in Section 1, not hero)

**Christianity is a story of progress.**
It calls humanity towards transformation.

**Christianity is an engine of progress.**
It called forth the scientific revolution and it compels us forward even now.

**Christianity is key to the future.**
It solves the coordination problem.

- `[ Read our vision ]` → the Expansive Human Futures one-page (content not yet in
  this repo — an ED-side draft; see the dependency list in `succession-plan.md`).
- `[ Join us ]` → membership / newsletter / community entry point (current `/join/*`
  signup flow).

## Page skeleton

```
[SECTION 0 — HERO]
  Copy above (locked).

[SECTION 1 — What science-and-faith-together looks like]
  Three short blocks, using the Expansive family as a rhetorical device
  (without naming the three-audience framework explicitly):

    EXPANSIVE FAITH        EXPANSIVE FLOURISHING    EXPANSIVE FUTURES
    Faith that grows       A human life that        A future worthy of
    with what we learn     widens instead of        what we're capable
    about the universe.    narrows.                 of becoming.

  These are the *answer* to the hero's problem. Not the brand intro.

[SECTION 2 — Who we are]
  One paragraph. "We are the Christian Transhumanist Association."
  Explain the brand name here, now that the invitation has landed.
  Keep it short — no history, no manifesto.

[SECTION 3 — What we're doing]
  3-4 tiles, clickable:
    - Writing / Substack
    - Community / membership
    - Annual retreat (next: Oct 16-18, 2026)
    - Resources / readings

[SECTION 4 — The deeper invitation]
  Soft handoff into Road to Emmaus / Faith-Renewing territory.
  Pull quote, e.g.: "The shape of progress has always been the face of Christ."
  CTA: [ Read the deeper story → ]  (links to the Emmaus long-form once written)

[SECTION 5 — Join]
  Newsletter · Membership · Retreat signup.
  Single clean call-to-action block. No noise.
```

## Design direction

**Primary register: "Contemporary Futurism with sacred weight."**

- Saturated gradient accents per pillar (if pillars are tiled in Section 1/3).
- Clean sans-serif for body.
- Slightly weighty serif or display face for hero headline and pull quotes — this
  carries the "sacred" register without going medieval.
- Plenty of whitespace. Don't crowd the hero.
- Photography/illustration: avoid generic stock. Prefer images of *people*
  (multigenerational, diverse, active) over abstract tech.

## Open decisions (for the ED/board to call before build)

1. **Section 1 — are the three blocks labeled (Faith / Flourishing / Futures) or
   unlabeled?** Labeled is clearer; unlabeled feels less brand-forward.
2. **Section 3 tile set** — confirm the four tiles and their destinations.
3. **Section 4 handoff** — ship with a placeholder link to the draft Road to Emmaus
   essay, or hold Section 4 until the essay is public?
4. **Existing homepage content** — this is a replacement. What from the current
   homepage needs to be preserved elsewhere (footer, about page, archive)? A
   content-audit pass is needed before cutover.

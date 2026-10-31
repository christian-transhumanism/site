# CTA agent plan

**What this is:** the overall plan for AI agents working on the Christian Transhumanist
Association. It covers what an agent working from this repo should be able to do, the
intellectual commitments every piece of CTA output has to meet, how much an agent may
do on its own, and what is still missing.

**How it fits with the other docs:** `AGENTS.md` is the operating index: the stack,
the funnel, roles and guardrails. This file is the *plan and the direction*: the target
capabilities and the worldview those capabilities serve. Where they overlap, the
guardrails in `AGENTS.md` §7 and the compliance rules in §4 win.

_Established 2026-10-31._

---

## 1. Mandate: five capabilities

An agent working in this repo, holding the right Bitwarden access, should be able to:

1. **Manage, maintain and update the CTA website.**
2. **Manage, maintain and update CTA's social accounts.**
3. **Spawn chat agents that represent CTA well.**
4. **Create or remix content to meet identified needs**: social posts, web articles,
   topic pages, email, ad copy.
5. **Manage systems like Google Ads to optimize for outcomes**, with confirmed
   membership as the target, not clicks.

All five serve the funnel in `AGENTS.md` §1 and the mission behind it. The rest of
this section describes each capability: its current state, what the agent does, and
the gaps.

### 1.1 Website

- **Today:** works. The stack, deploy and verification steps are in `AGENTS.md` §2.
  New topic pages go through the `/cta-page` skill as a branch plus PR.
- **The agent:** fixes broken things, keeps dependencies healthy, builds and revises
  pages, publishes blog posts, keeps `/join/*` tracking intact, and confirms every
  deploy returns 200.
- **Limits:** `src/cta-wiki/` is human-written. Agents *flag* stubs and never write
  wiki articles (`docs/backlog.md` → Content). The homepage hero copy is locked
  (`docs/homepage-messaging.md`).
- **Gaps:** Netlify reliability, dependency pruning, the confirmed-conversion webhook.
  All are tracked in `docs/backlog.md`.

### 1.2 Social accounts

- **Today:** no agent workflow exists. The account list is in the wiki note
  `src/cta-wiki/board/CTA Admin Accounts.md`: Facebook page and group, X
  (`twitter.com/xianityplus`), Bluesky (handle blank), Reddit `r/christianityplus`,
  Discord, Telegram, Instagram, YouTube, and a Google Group. Buffer and Zapier are
  listed under "Social Feeds" but their current status is unknown. That note predates
  the current site and needs auditing (`docs/succession-plan.md` §7).
- **The agent:** keeps the account inventory accurate (which accounts are live, who
  holds admin, which Bitwarden entry), drafts and schedules posts, remixes site and
  podcast content into platform-native posts, watches replies and mentions, and
  reports what is resonating.
- **Gaps (to build):**
  - A `docs/social.md` covering the audited account list, the Bitwarden entry for
    each, posting tools and cadence, and each platform's norms.
  - A posting mechanism agents can actually reach: platform APIs, or a scheduler such
    as Buffer, decided once and documented.
  - A **post log**: what was posted, where, when, from which source, and how it
    performed. Content work learns from it (§1.4).

### 1.3 Chat agents that represent CTA

- **Today:** none exist.
- **The goal:** an agent can *spawn* a conversational agent, for example in Discord,
  on the website, or as a drafting assistant for replies, that speaks for CTA
  faithfully to §2 below.
- **How a chat agent is built:** its system prompt is assembled from this repo only:
  - §2 of this file (the commitments and the canonical examples);
  - `.claude/skills/cta-page/VOICE.md` (definitions, terms, audiences);
  - a facts sheet (what CTA is, how to join, links to `/join/*`, the podcast and
    topic pages);
  - the rules below.

  Keep the assembled prompt, or the script that builds it, in the repo, so a
  successor can rebuild it.
- **Rules every CTA chat agent follows:**
  - **Say it's an AI.** It speaks as "an AI assistant for the CTA", never as a named
    person, a board member or the ED.
  - **Separate settled from open.** "CTA's view is…" only for the commitments (§2.1)
    and positions documented as CTA's in this repo. Readings like Example 1 (§2.3)
    are offered as *available* positions: "one reading consistent with both the
    tradition and science is…", alongside others, never as the only option for a
    Christian or a member. Everything else is an honest "that's an open question".
  - **Principled, not partisan.** It may explain CTA's support for decentralized,
    accountable power (§2.1), but never takes sides on parties, candidates, campaigns
    or legislation.
  - **Not pastoral care.** If someone is in distress, grieving, or in danger, respond
    with care, point them to real people and, where relevant, crisis resources, and do
    not theologize at them. This matters especially for the death and Fall framing in
    §2.3: it is about humanity's collective calling, never about blaming a person for
    an illness or a loss.
  - **Don't collect** personal, health or religious-identity data beyond what the
    conversation needs, and don't store it.
  - **Persuade by explaining, not by winning.** Steelman objections. A critic should
    come away thinking "that's coherent", even if unconvinced.
  - **Invite, don't push.** Offer `/join/free` (or `/join/future`) when it fits
    naturally.
- **Evaluation before deployment:** keep a test set of prompts covering friendly,
  curious, hostile, and edge cases. Examples: a Young Earth Creationist objection; an
  atheist asking "isn't this just wishful thinking?"; "is this heresy?"; "will AI kill
  us?"; "my mother just died"; an attempt to make it attack another tradition. Score
  each answer against the §2.2 checklist. A chat agent goes live only after a human
  has read its answers to the whole set.
- **Gaps:** where chat agents run (a Discord bot, a site widget, both) and who pays
  for the model API are open decisions (§5).

### 1.4 Content creation and remixing

- **Today:** `/cta-page` covers topic pages. Its idea list is
  `.claude/skills/cta-page/BACKLOG.md`. The podcast, blog posts, topic pages and
  tweets are a large body of material to draw from.
- **The agent:** starts from an *identified need*, not a blank page. Examples: an ad
  group with no landing page, a question people keep asking, a topic trending in AI or
  longevity news, a podcast episode with no promotion, a strong tweet that deserves a
  full article. It produces or remixes content for that need, in the right format:
  - tweet or thread → a topic page or blog post (expand the argument, add sources);
  - topic page → a thread, short posts, ad copy, an email;
  - podcast episode → posts, pull-quotes, a related-topic page.
- **Every piece passes the §2.2 checklist.** Ad copy also follows the Ad Grant rules
  in `AGENTS.md` §4: it never implies the reader has a religious identity or belief.
  That rule applies to ads, not to CTA's own posts or pages, but never cross it in
  anything that might be reused as an ad.
- **Gaps:** a `/cta-social` (or broader `/cta-remix`) skill with the same shape as
  `/cta-page`: it drafts, runs the checklist, and delivers for review.

### 1.5 Google Ads and the funnel

- **Today:** documented and operated. Resume from
  `docs/google-ads-current-state.md`, then the other `google-ads-*.md` files.
- **The agent:** runs the review on a regular schedule (weekly), changes keywords, ads
  and landing pages within the growth plan, keeps account CTR above the Ad Grant floor,
  and logs every change in `google-ads-current-state.md`.
- **The outcome:** confirmed members. Until the completion webhook exists (backlog),
  treat `membership_signup_intent` as a proxy and say so in every report.
- **Gaps:** the weekly review automation still runs on the ED's personal setup
  (`docs/succession-plan.md` §6). Rebuilding it as a runbook plus a scheduled agent
  that any operator with Bitwarden can recreate is part of this plan (§4, Phase 1).

---

## 2. Content and direction

This is the core of the plan. Agents that can post, chat and write are only worth
having if what they say is *CTA's* perspective: a new way of framing old questions
that is true to the Christian tradition *and* to science, to epistemology, and to the
future at the same time. This section is the authority for that. `VOICE.md` gives the
vocabulary, and this section gives the commitments that vocabulary serves.

### 2.1 The five commitments

Everything CTA publishes, whether by agent or by person, aims to be:

1. **Broadly orthodox Christian.** Consistent with the deepest theological traditions
   of the church. This does not require any particular relationship to the creeds,
   the councils or church authorities. It means staying consistent with the broadest
   Christian consensus. CTA reforms from inside the tradition. It doesn't discard it.
2. **Consistent with Critical Rationalism**, in the Popper/Deutsch line: knowledge
   grows by conjecture and criticism; all explanations are provisional; good
   explanations are hard to vary; problems are soluble. (`VOICE.md` §5.5 shows how
   this changes "faith and reason".)
3. **Understandable to Bayesians and other rationalists.** Claims should be stated so
   that someone who thinks in priors, evidence and calibration can follow and weigh
   them. Don't rely on in-group vocabulary, and don't ask the reader to suspend
   judgment.
4. **Consistent with modern consensus science.** Deep time, evolution, cosmology,
   neuroscience. CTA does not win arguments by contradicting the evidence. When
   science and a traditional reading seem to clash, look for the reading that is true
   to both.
5. **Genuinely transhumanist**, and aware of the long backstory: Francis Bacon (the
   restoration through the arts and sciences of the dominion over nature lost at the
   Fall, *Novum Organum* II.52), Nikolai Fedorov (*the Common Task*: humanity's shared
   work of overcoming death and raising the dead), Pierre Teilhard de Chardin
   (evolution converging on Christ, the Omega Point), and the modern transhumanist
   movement. Transformation of the human condition, including overcoming death, is a
   real goal, not a metaphor.

#### A position CTA holds: the decentralization of power

Beyond the commitments above, which are about *how* CTA reasons, CTA broadly holds
one substantive public position: **power should be decentralized.** This goes with
broad support for liberal democracy, human rights, the separation of powers,
constitutional government, and the rule of law: institutions that keep power
distributed, accountable and correctable.

It isn't a stray political opinion. It follows from the commitments:

- **Critical rationalism.** Popper's *The Open Society and Its Enemies* recast the
  political question from "who should rule?" to "how can we arrange institutions so
  that bad rulers and bad policies can be removed without bloodshed?". Deutsch
  generalizes this: good institutions are those that make *error correction*
  possible. Concentrated power suppresses criticism, and criticism is how knowledge
  grows. Decentralized power is the political form of fallibilism.
- **The Christian tradition.** If *every* human is the image of God, no one's
  dominion over others is natural or absolute. Look at the prophets confronting
  kings, Samuel's warning against kingship (1 Samuel 8), Christ "rejected by all human
  power and authority" (Example 2), and the Spirit poured out on all flesh (Acts 2).
  Example 1 names the original wrong turn as "the knowledge of how to use violence to
  exert control". Concentrating coercive power is the old path, not the new one.
- **Transhumanism and the future.** The technologies CTA cares about, AI above all,
  can concentrate power on a scale never seen before. "AI could remake the world — or
  end it" (`docs/homepage-messaging.md`) is partly a question of who controls it. CTA
  favours futures in which the power to transform the human condition is widely
  shared, accountable and open to correction, not held by a few.

**How agents apply it:**
- State it as a *principle* about the structure of power. It is **not partisan.** CTA
  does not endorse or oppose parties, candidates or campaigns. That is a 501(c)(3)
  legal requirement, and the Ad Grant rules in `AGENTS.md` §4 also forbid implying a
  reader's political identity.
- It is "broadly" held, in the same spirit as §2.4: argue for it, but don't use it to
  rule out good-faith people who weigh particular institutional questions differently.
- It applies to CTA's own work. Favour open knowledge, plural voices and correctable
  decisions, and never present any single person, including CTA's leadership, as the
  final authority.

### 2.2 The checklist (run on every draft)

- [ ] **Orthodox:** Would a thoughtful theologian from a major tradition (Catholic,
      Orthodox or Protestant) recognize it as a defensible reading, even if
      unfamiliar?
- [ ] **Critical rationalist:** Is the claim an explanation, open to criticism, not
      an appeal to authority? Does it treat problems as soluble?
- [ ] **Bayesian-legible:** Could a rationalist follow it and weigh it without
      sharing the premises?
- [ ] **Scientific:** Does anything contradict consensus science? If yes, rewrite.
- [ ] **Transhumanist:** Does it point toward real transformation, the future, or
      the work of overcoming death and suffering?
- [ ] **The move (§2.4):** Does it reframe an old question, rather than repeat one
      side of a stale argument?
- [ ] **Offered, not imposed (§2.4):** Is a specific reading presented as an
      available position ("there's another reading…") rather than as CTA's required
      doctrine or the only option consistent with the commitments?
- [ ] **Power:** Is it consistent with decentralized, accountable, correctable
      power? Does it stay nonpartisan (no party, candidate or campaign positions)?
- [ ] **Voice:** Does it match `VOICE.md`: disciplined hope, informative rather than
      preachy, plain first and rich underneath, Christ as the reveal rather than the
      gate?
- [ ] **Ad-safe:** If it might be reused as an ad, does it avoid implying the reader
      has a religious identity, belief or health status?

### 2.3 Canonical examples: two posts on X, late October 2026

These two posts are the clearest current statement of what CTA offers. Study them
before writing anything. They are reproduced verbatim.

They are canonical as examples of *the move*, not as doctrine. In particular,
Example 1 presents its reading of Genesis 1–3 as **an available position**: "there's
another reading consistent with both Christian tradition, and with modern science". It
does not claim to be the only position consistent with CTA, or one a Christian must
hold. Agents should present it the same way.

#### Example 1: death, the Fall, and the path not taken

> Young Earth Creationists hold humanity responsible for the existence of death.
>
> Most Christians now find this untenable, given modern science. But there's another
> reading consistent with both Christian tradition, and with modern science:
>
> Humanity isn't responsible for death existing. But humanity *is* responsible for
> death continuing to exist—because we were given the tools to eradicate it, and we
> chose not to do so.
>
> In this reading, that's what is narrated to us in Genesis 1-3.
>
> Humanity was given the capacity and the calling to grow into scientific and
> technological knowledge. Our earliest ancestors began to do so—and had this process
> continued, we would live in a world where humans had complete control over the
> ecosystem and the biological processes of death and decay.
>
> Instead, our earliest ancestors pursued a different kind of knowledge—the knowledge
> of how to use violence to exert control—and embarked upon millennia of needless
> suffering.
>
> In Christ, Christians believe that this process has begun to be reversed. The other
> path has been reopened, and just as at the beginning, we are called to take it.

**Why it works:**
- *Science:* it accepts outright that death predates humanity and drops the claim
  that contradicts the evidence.
- *Orthodoxy:* it keeps what the doctrine of the Fall protects: human responsibility,
  a real catastrophe early in the human story, and Christ as the reversal. This is
  close to Irenaeus's picture of humanity created immature and called to grow, and to
  Bacon's reading of the Fall as a lost dominion recovered by knowledge.
- *Critical rationalism:* death is a *problem*, and problems are soluble with the
  right knowledge. The two "kinds of knowledge" (knowledge that creates versus
  knowledge of violent control) is a Deutschian distinction told through Genesis.
- *Transhumanism:* overcoming death is the calling. That is Fedorov's Common Task,
  reached from Scripture.
- *Bayesian legibility:* no premise asks the reader to discount evidence.
- *Offered, not insisted on:* it opens with "there's another reading" and "in this
  reading". It widens the options available to a Christian who accepts modern science,
  without declaring the other options closed.

#### Example 2: how Christianity made the modern world

> Christianity, according to many prominent thinkers, created the modern world.
>
> Sometimes people reduce this to a line here or there, where the Bible calls for
> impartiality, rule of law, etc.
>
> The problem, of course, is that you can point to many other lines that seem to
> reflect values we would want to reject. Then you get into arguments about
> hermeneutics, etc—which ultimately points to the conclusion that you should never
> have started there in the first place.
>
> To understand how Christianity created the modern world, you need to understand the
> perpetual dynamic of Christian faith. What Tom Holland describes as *reformatio*—the
> ongoing, never-ending revolution of Christianity against the world, and against
> itself.
>
> That revolution is fueled by the Hebrew Bible's vision of humans as the image of
> God—a statement so radical, it can never be fully embodied in any society.
>
> And that revolution is fueled by the Christian vision of Christ—the divine human,
> calling us to become what he is—rejected by all human power and authority, and yet
> not rejecting the world.
>
> This profound combination cannot help but continually break and reform the world
> anew. Never stopping until the cosmos itself becomes new.

**Why it works:**
- It refuses the weak version of the argument (proof-texting) and names why it fails
  before a critic can.
- It moves the explanation from *rules* to a *dynamic*: the image of God as an ideal
  no society fully embodies, and Christ as the divine human calling us to become what
  he is (theosis). That kind of explanation is hard to vary, in Deutsch's sense, and
  it survives the counterexamples.
- It draws on a recognized secular historian (Holland, *Dominion*) instead of asking
  the reader to trust the tradition.
- It ends on the transhumanist horizon: reform that doesn't stop "until the cosmos
  itself becomes new". This is the renewal of all things, and Teilhard's convergence.

### 2.4 The move, as a pattern

Both posts follow the same pattern. Use it deliberately:

1. **Start from a position the reader recognizes**: a common claim, or a familiar
   fight (Young Earth Creationism; "Christianity made the modern world").
2. **Name the usual move and why it fails**: it contradicts science, or it relies on
   proof-texting that collapses under counterexamples.
3. **Offer a third reading** that keeps what the tradition was actually protecting
   *and* fits the evidence. Offer it as a reading that is *available*, not one the
   reader must accept. The aim is to show that a position true to both tradition and
   science exists, and so to open the question rather than close it.
4. **Ground it in the deep structure of the tradition**: Genesis 1–3, the image of
   God, Christ, theosis. Not isolated verses.
5. **Land on the future**: a calling, a task, a cosmos made new. The reframing should
   make the reader *responsible for* something, not just better informed.

This is what "CTA's unique perspective" means in practice. Content that only argues
one side of an existing debate, or only says "faith and tech can coexist", is not
doing CTA's job.

### 2.5 Keeping the canon current

When CTA publishes something that states the perspective this well, add it to §2.3
with a short "why it works". Agents should *propose* additions (in a PR). A human
decides what becomes canon.

### 2.6 Positioning: BioLogos as a reference point

When working out how CTA should sit in public conversation, a useful comparison is
**BioLogos** (biologos.org). Founded in 2007 by Francis Collins, it presents
"evolutionary creation": the harmony of historic Christian faith with mainstream
science. There is history between the two organizations: BioLogos VP Jim Stump spoke
at the 2019 Christian Transhumanist Conference (`src/conference-2019.njk`).

**Where CTA's positioning is similar, and worth learning from:**
- **Orthodox and in step with consensus science at the same time.** Both organizations
  hold to historic Christian faith (commitment 1) without contradicting the evidence
  (commitment 4), and both treat that combination as normal rather than as a
  concession.
- **Offering positions rather than mandating them.** On contested questions, BioLogos
  typically sets out several readings that fit both faith and science and lets readers
  weigh them. That is the same stance as §2.3 Example 1 and the "offered, not imposed"
  check in §2.2.
- **Tone.** Gracious, non-combative, credible to scientists and to people in church
  alike. A good benchmark for CTA's "informative, not preachy" voice.
- **Seriousness as an institution.** Substantive explanatory articles, recognizable
  scholars, a podcast. CTA's topic pages and podcast play a similar role.

**Where CTA differs, and should stay distinct:**
- **Direction of attention.** BioLogos mostly works on *origins*: evolution, Genesis,
  Adam and Eve, the age of the earth. CTA's centre of gravity is the *future*:
  technology, AI, longevity, human transformation, the renewal of all things. Where
  CTA touches origins (as in Example 1), it is usually to say what the past means for
  our calling now.
- **Epistemology.** CTA explicitly reasons in the Critical Rationalist line and aims to
  be legible to Bayesians and rationalists (commitments 2 and 3). That brings in
  audiences, such as secular rationalists and the tech world, that a faith-and-science
  organization doesn't usually address directly.
- **Transhumanism.** CTA holds that overcoming death and transforming the human
  condition through science and technology is part of the Christian calling
  (commitment 5). That is CTA's own claim. Never attribute it, or any other CTA
  position, to BioLogos.

**Practical rules for agents:**
- Use BioLogos as a model for tone and for how to present contested questions, not as
  a source of CTA positions.
- Never imply affiliation, partnership or endorsement. Describe BioLogos accurately and
  generously when it comes up, and link to their own material for their views.
- Keep BioLogos's name out of ad copy and keywords (trademark and Ad Grant hygiene).
- When people ask "how is CTA different from BioLogos?", the short answer is: *similar
  commitment to orthodox faith and consensus science; CTA's focus is the future, its
  method is critical rationalism, and its horizon is the transformation of the human
  condition.*

---

## 3. Autonomy: what an agent may do on its own

Public statements in CTA's name can't be taken back, and the Ad Grant can be
suspended. Autonomy grows with track record, by tier:

| Tier | Agent may do without asking | Examples |
|---|---|---|
| **0: Read and analyze** | Always | Audits, reports, stub detection, Ads performance read-outs, checklist reviews |
| **1: Draft** | Always, delivered as a PR or a draft queue | Topic pages, posts, threads, chat-agent prompts, ad copy proposals |
| **2: Routine, reversible operations** | Yes, if already within a documented plan, and logged | Site fixes and deploys (verify 200), Ads keyword, bid and ad changes within `google-ads-growth-plan.md`, re-posting already-approved content, scheduled posts from an approved queue |
| **3: Needs human approval** | No, ask first | Any *new* public post or reply in CTA's name (until §5 decides otherwise), new positions on contested theology, responses to critics or press, deploying a chat agent, account settings and credentials, deleting content, any spend outside the Ad Grant, edits to `src/cta-wiki/`, locked homepage copy |

Always: log what was done (the Ads state doc, the post log, PR descriptions), and when
unsure, step up a tier.

---

## 4. Roadmap

**Phase 0: the plan (this document).**

**Phase 1: make existing operations standalone.**
- Write the weekly Ads review as a runbook in this repo, then schedule it with any
  agent runner that has Bitwarden access (`succession-plan.md` §6).
- Move `cta-report.js` into `scripts/`, authenticated with environment variables
  whose values live in Bitwarden.
- Audit the social accounts and write `docs/social.md` (§1.2).

**Phase 2: content engine.**
- Build a `/cta-social` (or `/cta-remix`) skill on the `/cta-page` model, with the
  §2.2 checklist built in.
- Start the post log, and review performance alongside Ads at the weekly read-out.
- Turn each canonical post into a full topic page or article (Example 1 → a page on
  death, the Fall and the calling to overcome death, presenting the reading as one
  available position alongside others; Example 2 → a page on *reformatio*
  and the modern world).

**Phase 3: chat agents.**
- Write the chat-agent rules and facts sheet into the repo (§1.3) and build the
  evaluation set.
- Pilot one surface, for example Discord, with human review of transcripts.

**Phase 4: closed loop.**
- Wire confirmed-signup conversions (the webhook), so that Ads, content and social
  can all be judged against real membership.

**Acceptance test for every phase:** a fresh agent, starting in this repo with no
other context, can carry out the capability by reading `AGENTS.md` → this file → the
linked docs. If it can't, the docs are incomplete. Fix the docs, not the agent.

---

## 5. Open decisions

- **Social posting autonomy:** do new posts stay at Tier 3 (human approval for each
  post), or move to Tier 2 for remixes of approved content after a trial period?
- **Social tooling:** platform APIs or a scheduler (Buffer, or something else)?
  Which accounts are still worth maintaining?
- **Chat-agent surfaces and cost:** Discord, a site widget, or both? Which model
  provider, and under whose billing?
- **The agent runner:** where scheduled agents (the Ads review, the social cadence)
  run so that the CTA, not an individual, controls them.
- **Who approves Tier 3** when the ED is unavailable (ties into
  `succession-plan.md` §4 and §7).

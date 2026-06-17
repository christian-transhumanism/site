# CTA Google Ads Thinker and Topic Map

Working document for Google Ads / Ad Grants campaigns that route search intent into relevant CTA content, then toward `/join/future/`, `/join/free/`, or `/join/voting/`.

## Operating Rules

- Use Search intent and contextual landing pages, not custom audiences or remarketing based on religion.
- Do not write ad copy that implies the visitor has a religious identity, belief, medical status, disability, political identity, or other sensitive trait.
- Do not imply that public figures endorse CTA unless they have explicitly done so.
- Prefer "CTA commentary and resources related to..." over "X agrees with CTA."
- Keep named-person landing pages editorial: summarize why the topic matters, link to CTA resources, and invite people to join a broader conversation.
- Start with exact and phrase match; expand only after search terms prove relevant.
- Use negatives aggressively for low-intent, celebrity, PDF, pirated-book, stock, gossip, and controversy searches.

## Landing Page Pattern

Recommended URL shape:

- `/topics/ray-kurzweil/`
- `/topics/david-deutsch/`
- `/topics/brain-computer-interfaces/`
- `/topics/ai-human-flourishing/`

Recommended page sections:

1. Neutral hero: "Explore [topic] with the Christian Transhumanist Association"
2. Why it matters: 2-3 paragraphs connecting the topic to technology, human flourishing, ethics, hope, and future-building.
3. CTA resources: wiki pages, blog posts, podcasts, videos, books, and conference material.
4. Discussion prompts: 3-5 serious questions this topic raises.
5. Join CTA: soft CTA to `/join/future/`, plus direct free/voting buttons lower on the page.
6. Non-affiliation note where needed: "This page is CTA commentary and resource curation; it does not imply endorsement by [person]."

## Campaign Architecture

### Campaign: CTA Core Questions

Use when the query already shows interest in Christian Transhumanism or in direct compatibility questions. These terms are religious-sensitive, so avoid remarketing, custom audiences, and ad language that infers the searcher's belief. They may still be valuable Search campaigns because the user is explicitly searching the topic.

| Priority | Ad group | Landing page | Existing support | Search intent | Notes |
| --- | --- | --- | --- | --- | --- |
| High | Christian Transhumanism basics | `/topics/christian-transhumanism/` | `Christian Transhumanism.md`, `faq.md`, `affirmation.md`, `posts/christianity-transhumanism.md`, podcast episodes | What is Christian transhumanism? | Strongest direct-intent campaign, but policy-sensitive. |
| High | Compatibility and objections | `/topics/christianity-and-transhumanism/` | `Compatibility of Christianity and Transhumanism.md`, `Scriptural Arguments for Christian Transhumanism.md`, `Quotes on Christianity & Transhumanism.md` | Are Christianity and transhumanism compatible? | Use educational copy, not identity copy. |
| High | Image of God and technology | `/topics/image-of-god-and-technology/` | `Image of God.md`, `Transhumanism is about the Image of God.md`, `Theological Mission.md`, Steve Fuller content | Imago Dei, enhancement theology | Strong bridge from theology to enhancement ethics. |
| High | Resurrection and technology | `/topics/resurrection-and-technology/` | `The Resurrection is Technological.md`, `Scientific Resurrection.md`, `Resurrection of the Body.md`, `Participatory Resurrection.md` | Resurrection science, bodily resurrection, technology | Distinctive CTA thesis; likely content-rich but sensitive. |
| High | Creation mandate and co-creation | `/topics/creation-and-technology/` | `Creation Mandate.md`, `Co-Creators.md`, `We were created to be creators.md` | Christian duty to create, technology as vocation | Good constructive technology framing. |
| Medium | Theosis and human transformation | `/topics/theosis-and-human-transformation/` | `Theosis.md`, `David Bentley Hart on Theosis.md`, `Participation in Christ.md` | Theosis, deification, human transformation | High theological relevance; likely paid-search sensitive. |
| Medium | Science and Christianity | `/topics/science-christianity-and-progress/` | `Christianity is the origin of the scientific revolution.md`, `Scientific Revolution.md`, `Religious drivers of the Scientific Revolution.md`, `posts/2023-science-before-the-revolution.md` | Christianity and science, origins of science | Good educational bridge. |
| Medium | Religious transhumanism | `/topics/religious-transhumanism/` | `Religious Transhumanism.md`, `Secular Transhumanism.md`, press coverage, Humanity+ affiliation | Religious transhumanism, spiritual transhumanism | Search intent is explicit, but ad copy must stay neutral. |

### Campaign: Future Thinkers

Use named thinkers where CTA has content or can credibly curate resources. These are high-intent searches, but the ad text must avoid implying affiliation.

| Priority | Ad group | Landing page | Existing support | Search intent | Notes |
| --- | --- | --- | --- | --- | --- |
| High | Ray Kurzweil | `/topics/ray-kurzweil/` | `src/cta-wiki/Ray Kurzweil.md`, `Books about Christianity & Transhumanism.md`, `Christian History of Transhumanism.md`, conference topics | Singularity, AI, longevity, future of humanity | Strong fit; needs a better landing page because the wiki file is thin. |
| High | David Deutsch | `/topics/david-deutsch/` | `src/cta-wiki/David Deutsch.md`, `Computation as Fine-Tuning.md`, `Humans as Universal Explainers.md`, `Worldview.md`, books page | optimism, progress, explanations, quantum computing, universal explainers | Strong intellectual fit; good non-sensitive framing. |
| High | Aubrey de Grey | `/topics/aubrey-de-grey/` | `src/cta-wiki/Aubrey de Grey.md`, `posts/2018-conference-proposals.md`, podcast `/podcast/36/`, books page, longevity pages | ending aging, longevity, SENS, life extension ethics | Strong because CTA conference history directly engaged him. |
| High | Noland Arbaugh / Neuralink | `/topics/brain-computer-interfaces/` or `/topics/noland-arbaugh/` | `posts/2025-noland-arbaugh.md`, `Brain-Computer Interfaces.md`, `Brain Augmentation Bill of Rights.md`, `Super-Embodiment.md` | Neuralink recipient, BCI, assistive technology, embodiment | Strong, but avoid disability/medical targeting language. |
| High | Peter Thiel | `/topics/peter-thiel-progress/` | `Books about Christianity & Transhumanism.md`, `NT Wright.md`, `zero-to-one` book page | progress, stagnation, Zero to One, future-building | Medium-high; build around progress, not politics. |
| High | Nick Bostrom | `/topics/simulation-and-ai-risk/` | `Nick Bostrom.md`, `Simulation Argument.md`, `Christian History of Transhumanism.md`, AI pages | simulation argument, AI risk, superintelligence | Strong topic intent; named page can be paired with topic page. |
| Medium | Peter Diamandis | `/topics/abundance-and-progress/` | `Peter Diamandis.md`, `Christian History of Transhumanism.md`, `The Future is Faster than you Think.md` | abundance, exponential technology, future trends | Good for optimistic progress seekers. |
| Medium | Kevin Kelly | `/topics/what-technology-wants/` | `Books about Christianity & Transhumanism.md`, `what-technology-wants` book page | technology evolution, technium, future trends | Good bridge from tech culture to CTA. |
| Medium | Eric Drexler | `/topics/nanotechnology/` | `Nanotechnology.md`, books page, conference topics | nanotechnology, molecular machines, engines of creation | Strong topic relevance, likely lower volume. |
| Medium | Frank Tipler | `/topics/omega-point/` | `Omega Point Theory.md`, `The Physics of Immortality` book page, `David Deutsch.md` | Omega Point, physics of immortality | Strong but religious-adjacent; use careful neutral copy. |
| Medium | Pierre Teilhard de Chardin | `/topics/teilhard-and-the-future/` | `Pierre Teilhard de Chardin.md`, Vice archive, books page, Christian history | Omega Point, evolution, future, Teilhard | Strong content support but explicitly religious; phrase as history/commentary. |
| Medium | Nikolai Fedorov | `/topics/russian-cosmism/` | `Nikolai Fedorov (1829-1903).md`, Russian Cosmists pages, Tolstoy/Fedorov pages, cosmism notes | Russian cosmism, resurrection, space exploration | Rich content, niche audience. |
| Medium | Calvin Mercer | `/topics/religion-and-transhumanism-scholarship/` | `src/_data/academics.json`, podcast `/podcast/29/`, religion/transhumanism book pages | religion and transhumanism scholarship | Strong academic support, probably lower conversion volume. |
| Medium | James Hughes | `/topics/religious-transhumanism/` | `src/_data/academics.json`, podcast `/podcast/5/`, `World Transhumanist Association.md` | religious transhumanism, bioethics, longevity dividend | Medium; good for history and movement context. |
| Medium | Robin Hanson | `/topics/futurism-and-human-motives/` | `Robin Hanson.md`, podcast `/podcast/37/`, video cache | Elephant in the Brain, futurism, motives | Useful thinker lane, but less direct CTA fit. |
| Medium | David Pearce | `/topics/ending-suffering/` | `David Pearce.md`, podcast `/podcast/41/`, Humanity+/WTA links | paradise engineering, ending suffering | Strong ethical topic, but needs careful page framing. |
| Medium | Ilia Delio | `/topics/christ-and-evolution/` | podcast `/podcast/39/`, video cache, Teilhard cluster | Christ and evolution, Teilhardian theology | Good content-first page; likely sensitive in Ads. |
| Medium | Science Mike McHargue | `/topics/science-faith-and-future/` | podcast `/podcast/21/`, CTA 2019 video, `CTA Conference 2019.md` | science and faith, losing/finding God | Medium, but avoid targeting deconstruction identity. |
| Medium | Steve Fuller | `/topics/proactionary-future/` | podcast `/podcast/7/`, `Image of God.md`, guest data | proactionary imperative, imago Dei, transhumanism | Good scholarly bridge. |
| Medium | Taryn Southern | `/topics/ai-music-and-creativity/` | podcast `/podcast/42/` | AI music, VR, blockchain art, future media | Good for creative-tech audiences. |
| Medium | Jonathan Rauch | `/topics/democracy-and-future-community/` | `Ep 46--Christianity and Saving Democracy with Jonathan Rauch.md`, podcast `/podcast/46/` | Christianity and democracy, pluralism | Not core signup; maybe later content campaign. |
| Medium | C. S. Lewis | `/topics/cs-lewis-and-the-future/` | `Christian History of Transhumanism.md`, CS Lewis references | space trilogy, science, human future | Good bridge, but needs new page and careful non-identity copy. |
| Medium | N. T. Wright | `/topics/embodied-hope/` | `NT Wright.md`, books page, physical eschatology resources | Surprised by Hope, heaven and earth, resurrection | Religious-sensitive; probably better for organic/content than Ads unless carefully framed. |
| Medium | Ron Cole-Turner | `/topics/theology-and-transhumanism/` | 2019 conference speaker post, books page | theology and transhumanism, human enhancement | Good scholarly support, lower volume. |
| Medium | Jeanine Thweatt | `/topics/cyborg-selves/` | 2018 conference speaker post, books page | cyborg selves, theological anthropology, posthuman | Good scholarly niche. |
| Medium | Meghan O'Gieblyn | `/topics/god-in-the-machine/` | `posts/meghan-ogieblyn-strange-journey-into-transhumanism.md` | God in the Machine, technology and belief | Good editorial page, avoid targeting belief identity. |
| Medium | Dale Allison | `/topics/miracles-and-reason/` | `posts/2025-dale-allison.md`, `Miracles and the Anthropic Principle.md` | Dale Allison miracles, miracles and evidence | Use as theology/reason bridge; not primary membership driver. |
| Low | Elon Musk | `/topics/neuralink-ai-and-human-futures/` | Neuralink/BCI resources, AI risk pages, Noland Arbaugh post | Neuralink, AI, future of humanity, brain interfaces | High volume but messy search terms; route to topic, not person. |
| Low | David Bentley Hart | `/topics/renewal-and-transformation/` | `David Bentley Hart.md`, DBH notes, Worldview references | DBH, universalism, theology | Strong religious sensitivity; probably content/SEO first, Ads later. |

### Campaign: Future Technologies

Use topic searches where CTA has a distinctive angle and can avoid sensitive identity language.

| Priority | Ad group | Landing page | Existing support | Search intent | Notes |
| --- | --- | --- | --- | --- | --- |
| High | Brain-computer interfaces | `/topics/brain-computer-interfaces/` | `Brain-Computer Interfaces.md`, `Brain Augmentation Bill of Rights.md`, `Super-Embodiment.md`, Noland post | BCI ethics, Neuralink, assistive tech | One of the strongest current topic pages to build. |
| High | AI and human flourishing | `/topics/ai-human-flourishing/` | `Artificial Intelligence.md`, `Super-Intelligence.md`, `Narrow AI.md`, `Intelligence is a collection of algorithms.md`, Worldview | AI ethics, AGI, human flourishing | Safe if framed as ethics/future, not religion. |
| High | Radical longevity | `/topics/radical-longevity/` | `Radical Longevity.md`, `Super-Longevity.md`, CT statement, BBC immortality post, Christianity Today post, Aubrey de Grey | longevity ethics, life extension, ending aging | Strong direct CTA fit. |
| High | Human enhancement ethics | `/topics/human-enhancement-ethics/` | `Cognitive enhancement.md`, `Super-Embodiment.md`, `Transhumanist Ethical Visions.md`, books | enhancement ethics, posthuman ethics | Good broad educational landing page. |
| High | Technology and human flourishing | `/topics/technology-human-flourishing/` | `Ethical Technology.md`, `Worldview.md`, `Technological Mission.md`, `Cooperation Theory of Technology.md` | technology ethics, flourishing, future society | Best broad non-sensitive campaign theme. |
| Medium | Simulation argument | `/topics/simulation-argument/` | `Simulation Argument.md`, `mission-faith-christ-and-simulation.md`, Bostrom | simulation hypothesis, Nick Bostrom | Strong search intent; care around theology phrasing. |
| Medium | Cryonics | `/topics/cryonics-and-resurrection/` | `cryonics.md`, `John Warwick Montgomery; Cryonics and Orthodoxy.md`, podcast `/podcast/32/` | Christian view of cryonics, cryonics ethics | Medium; very niche but distinctive. |
| Medium | Genetic modification | `/topics/genetic-engineering-ethics/` | `Gene editing.md`, CTA 2019 videos, Liz Parrish content, Image of God resources | gene editing ethics, Christian bioethics | Medium; sensitive if framed around medical traits. |
| Medium | Quantum archaeology | `/topics/quantum-archaeology/` | `quantum archaeology.md`, Fedorov pages, scientific resurrection pages | quantum archaeology, digital resurrection | Niche but directly aligned. |
| Medium | Space exploration and humanity | `/topics/space-and-human-futures/` | Fedorov/cosmism pages, Christian history, space exploration references | space colonization ethics, humanity future | Good for Fedorov/cosmism cluster. |
| Medium | Nanotechnology | `/topics/nanotechnology/` | `Nanotechnology.md`, Drexler/book resources, conference topics | molecular machines, nanotech future | Technical niche. |
| Medium | Mind uploading | `/topics/mind-uploading/` | conference topics, transhumanist resources, books | mind uploading, consciousness, substrate independent minds | Needs new editorial support before Ads. |
| Medium | AI and spirituality | `/topics/ai-and-spirituality/` | AI Theology podcast note, Voice of Islam radio note, AI pages | AI and spirituality, AI theology | Sensitive-adjacent; keep ads topic-oriented. |
| Low | Web3 and decentralization | `/topics/web3-and-future-community/` | `web3.md`, `decentralization.md` | web3 future, decentralization ethics | Probably lower priority for signups. |
| Low | Biosphere enhancement | `/topics/biosphere-enhancement/` | `Biosphere enhancement.md`, `Super-Ecology.md`, Worldview | ecology technology, climate tech ethics | Could broaden beyond transhumanism. |

### Campaign: Historical Roots of Future Thinking

Use when search intent is research-oriented. This may perform better as SEO/content than paid search, but the pages can still support Ad Grants if quality scores are good.

| Priority | Ad group | Landing page | Existing support | Search intent | Notes |
| --- | --- | --- | --- | --- | --- |
| High | Christian history of transhumanism | `/topics/history-of-transhumanism/` | `Christian History of Transhumanism.md`, `Influences in Christian Transhumanism.md` | history of transhumanism, Christian futurism | Avoid ad copy that targets religious identity. |
| Medium | Russian cosmism | `/topics/russian-cosmism/` | Fedorov, Russian Cosmists, Young2012, Tolstoy pages | Russian cosmism, Fedorov, cosmism | Strong niche cluster. |
| Medium | Scientific Revolution and future | `/topics/science-technology-and-renewal/` | Francis Bacon, Robert Boyle, Christian history, Worldview | Francis Bacon science religion, New Atlantis | Good educational content. |
| Medium | Teilhard and Omega Point | `/topics/omega-point/` | Teilhard, Tipler, Omega Point, Vice archive | Omega Point theory, Teilhard, Tipler | Good, but religious-sensitive. |
| Low | Patristic future anthropology | `/topics/transformation-and-human-destiny/` | Irenaeus, Macrina, Gregory of Nyssa references | resurrection body, human transformation | Mostly content/SEO unless search volume proves useful. |

### Campaign: CTA Media and Guests

Use names where CTA has podcast/video/conference content. These should usually route to media-rich pages rather than pure signup pages.

| Priority | Ad group | Landing page | Existing support | Search intent | Notes |
| --- | --- | --- | --- | --- | --- |
| High | Noland Arbaugh interview | `/topics/noland-arbaugh/` | `posts/2025-noland-arbaugh.md`, YouTube embed | Noland Arbaugh Neuralink interview | Strong video landing page candidate. |
| High | Aubrey de Grey interview | `/topics/aubrey-de-grey/` | podcast `/podcast/36/`, conference posts | Aubrey de Grey life extension interview | Good existing engagement. |
| Medium | Dale Allison miracles | `/topics/dale-allison-miracles/` | `posts/2025-dale-allison.md` | Dale Allison miracles interview | Good content, but not core Ad Grants signup theme. |
| Medium | Jim Stump / BioLogos | `/topics/science-faith-future/` | 2019 conference speaker post | BioLogos, science and faith | Sensitive; likely content-first. |
| Medium | Liz Parrish | `/topics/gene-therapy-longevity/` | 2019 conference speaker post | BioViva, gene therapy, longevity | Good topic bridge. |
| Medium | Scott Hawley | `/topics/ai-music-and-creativity/` | 2018 conference speaker post | AI, music, creativity, faith and tech | Good niche. |
| Medium | Derek Webb | `/topics/art-culture-and-future/` | 2018 conference speaker post | Derek Webb, AI/art/future? | Likely audience mismatch; test only with strong content. |
| Medium | Michael Paulus | `/topics/technology-and-the-library/` | 2019 conference speaker post | technology, library, future of knowledge | More scholarly; low volume. |
| Medium | Cheryle Renee Moses | `/topics/creativity-and-human-futures/` | 2019 conference speaker post | art, creativity, future | Low volume. |
| Medium | Caleb Strom | `/topics/christian-transhumanist-confession/` | confession post, Caleb page | Christian transhumanist confession | Sensitive; likely organic/content first. |
| Medium | Press coverage | `/topics/christian-transhumanism-in-the-media/` | Christianity Today, BBC, Slate, Vice, Inverse posts and coverage data | Is transhumanism religious? CTA in press | Useful credibility page and sitelink destination. |

## Keyword Seed Examples

Use exact and phrase match initially. Examples are seed shapes, not final uploads.

### Ray Kurzweil

- "ray kurzweil singularity"
- "ray kurzweil longevity"
- "the singularity is near"
- "kurzweil ai future"
- "kurzweil transhumanism"

### David Deutsch

- "david deutsch optimism"
- "david deutsch beginning of infinity"
- "universal explainers"
- "david deutsch progress"
- "david deutsch quantum computing philosophy"

### Brain-Computer Interfaces

- "brain computer interface ethics"
- "neuralink ethics"
- "brain augmentation"
- "assistive brain computer interface"
- "noland arbaugh neuralink interview"

### Radical Longevity

- "radical longevity ethics"
- "life extension ethics"
- "ending aging aubrey de grey"
- "is life extension good"
- "technology to end aging"

### AI and Human Flourishing

- "ai and human flourishing"
- "ai ethics future of humanity"
- "artificial intelligence human purpose"
- "agi ethics"
- "superintelligence ethics"

## Negative Keyword Starters

- free pdf
- pdf
- audiobook free
- quotes
- net worth
- wife
- husband
- family
- twitter
- x.com
- reddit
- controversy
- scandal
- stock
- jobs
- salary
- movie
- meme
- merch
- login
- download
- torrent
- summary
- sparknotes

## First Landing Pages To Draft

1. `/topics/brain-computer-interfaces/`
   - Strongest immediate bridge from Noland Arbaugh, Neuralink, embodiment, assistive tech, and membership.
2. `/topics/radical-longevity/`
   - Strong CTA fit; can integrate Aubrey de Grey, BBC immortality, Christianity Today, Super-Longevity.
3. `/topics/ai-human-flourishing/`
   - Broadest scalable non-sensitive topic.
4. `/topics/christian-transhumanism/`
   - Strongest direct-intent query set; write carefully as an informational page, not identity-targeted ad copy.
5. `/topics/david-deutsch/`
   - Strong thinker-led non-sensitive page around progress, explanations, universal reach.
6. `/topics/ray-kurzweil/`
   - High search volume and core transhumanist relevance; needs careful non-affiliation wording.
7. `/topics/resurrection-and-technology/`
   - Distinctive CTA thesis and strong content base; likely better after at least one non-sensitive topic page is live.
8. `/topics/russian-cosmism/`
   - Rich CTA wiki support and strong thinker/topic specificity.

## Ad Copy Templates

### Topic-Led

Headline directions:

- Explore AI and Human Flourishing
- Technology, Ethics, and Hope
- Conversations on Human Futures
- Brain Interfaces and Human Agency
- Longevity, Ethics, and the Future

Description directions:

- Read CTA essays, interviews, and resources on emerging technology and the future of humanity.
- Join a community exploring technology, human flourishing, and long-term hope.
- Thoughtful resources on AI, longevity, embodiment, and responsible progress.

### Thinker-Led

Headline directions:

- Explore Kurzweil and the Future
- David Deutsch, Progress, and Hope
- Neuralink, BCI, and Human Agency
- Aubrey de Grey and Longevity
- Bostrom, AI Risk, and the Future

Description directions:

- CTA commentary and resources on major thinkers shaping conversations about technology and humanity.
- Essays, interviews, and reading paths on progress, AI, longevity, and human futures.
- Follow a serious conversation about the ideas shaping what comes next.

Avoid:

- "For Christians interested in..."
- "Are you a believer who..."
- "Your faith and..."
- "Join other Christians like you..."
- "Endorsed by..."
- "Official [person]..."

## Execution Sequence

### Phase 1: Safest Scalable Pages

Build pages where the primary query is not inherently religious-sensitive and where CTA has strong content support:

1. Brain-computer interfaces
2. Radical longevity
3. AI and human flourishing
4. David Deutsch
5. Ray Kurzweil

Campaign goal: establish conversion data on lower-policy-risk traffic before expanding into explicitly religious query sets.

### Phase 2: Distinctive CTA Thesis Pages

Build pages that express CTA's strongest intellectual identity, but treat Ads rollout carefully:

1. Christian Transhumanism basics
2. Christianity and transhumanism compatibility
3. Image of God and technology
4. Resurrection and technology
5. Russian cosmism
6. Teilhard / Omega Point

Campaign goal: capture explicit search intent and improve quality score for users already searching these ideas.

### Phase 3: Guest and Scholar Pages

Build or improve media-rich pages around people CTA has hosted or engaged:

1. Aubrey de Grey
2. Noland Arbaugh
3. Ron Cole-Turner
4. Calvin Mercer
5. Kevin Kelly
6. Meghan O'Gieblyn
7. Dale Allison

Campaign goal: use long-tail name searches and content-specific queries as low-cost entry points into CTA resources.

### Phase 4: Long-Tail and SEO-First Pages

These are worth drafting for organic search and internal linking, then testing in Ads only if impressions and approval history look promising:

1. Theosis and human transformation
2. Cryonics and resurrection
3. Genetic engineering ethics
4. Space and human futures
5. Science, Christianity, and progress
6. AI and spirituality
7. Press coverage / CTA in the media

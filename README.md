# Christian Transhumanist Association Site

This repository contains the static website for the Christian Transhumanist Association, built with [Eleventy](https://www.11ty.dev/). Content lives under `src/`, including layouts, data files, and a large knowledge base that is ingested from an external Obsidian vault and rendered into the public wiki.

## Project layout

- `src/` – primary Eleventy input directory.
  - `_includes/` – Nunjucks/Liquid layouts and partials shared across the site.
  - `_data/` – global data sources (JSON/JS) that feed pages, community feeds, podcasts, etc.
  - `stylesheets/` – site CSS assets.
  - `cta-wiki/` – external Obsidian vault mirrored into the project and compiled into `/wiki/` and `/board/` pages. The Eleventy config provides wikilink parsing, backlink generation, and custom permalink rules for these notes. Keep the vault’s internal `.obsidian` tooling folder intact, but Eleventy automatically ignores any `cta-wiki/templates/` scaffolds. You can also drop blog articles under `src/cta-wiki/posts/`; Eleventy still recognises them via their `tags: post` front matter while keeping them out of the public wiki index, so the Obsidian vault can own both the knowledge base and the news feed.
- `_site/` – build output (generated, do not edit manually).
- `.eleventy.js` – Eleventy configuration, custom collections, filters, and Obsidian integration helpers.
- `.eleventyignore` – additional paths Eleventy should skip.
- `guidelines.txt` / `todo.txt` – project management notes.

## Requirements

- Node.js 18 or newer (Eleventy 1.x compatible)
- npm (ships with Node)

Install dependencies once after cloning:

```bash
npm install
```

## Running locally

Start Eleventy’s development server (with live reload and incremental rebuilds):

```bash
npx @11ty/eleventy --serve
```

This serves the compiled site at `http://localhost:8080`. Edits inside `src/` trigger automatic rebuilds. Some data sources fetch remote RSS feeds; without network access Eleventy will emit warnings and generate placeholders, which is expected when offline or behind a restrictive firewall.

## Building for deployment

Create a production build:

```bash
npx @11ty/eleventy
```

### Offline builds

Some global data loads remote RSS and YouTube feeds at build time. When you need to run the build without network access, instruct Eleventy to rely on cached copies by setting `SKIP_REMOTE_FEEDS=1`:

```bash
SKIP_REMOTE_FEEDS=1 npx @11ty/eleventy
```

With this flag set, the loaders skip outbound requests, log `[offline]` notices, and fall back to the most recent responses stored in `.cache/`. If no cached data exists yet, the relevant sections render with their built-in placeholders.

The static site is written to `_site/`. Deploy that folder to any static host (Netlify, GitHub Pages, S3/CloudFront, etc.). CI/CD pipelines should run the build command, cache `node_modules/` when possible, and publish `_site/` as the artifact.

## Deployment notes

- The project includes numerous remote feeds configured in `.eleventy.js`. Ensure deploy environments allow outbound HTTP(S) so the build can hydrate those feeds; otherwise Eleventy will fall back to placeholder content.
- If using Netlify (typical for Eleventy projects), set the build command to `npx @11ty/eleventy` and the publish directory to `_site`.
- Environment variables can be defined in `.env` or the hosting provider’s UI; the lightweight loader inside `.eleventy.js` reads the file before the build starts.

## Working with the CTA wiki vault

- `src/cta-wiki/` mirrors an external Obsidian vault. Add, edit, or remove Markdown notes here and Eleventy will surface them automatically.
- `src/cta-wiki/posts/` map to `/blog/...` permalinks, according to their internal permalink setting
- `src/cta-wiki/board/` map to `/board/...` permalinks, while all other notes render under `/wiki/...`.
- Board-permalinked notes stay private: Eleventy flags them with `noindex, nofollow`, omits them from the sitemap, and hides them from backlink/search listings on non-board pages. 
- Wikilinks (`[[Page Name]]`) and Markdown links are resolved to site URLs via custom filters; missing targets render visibly so you can keep the knowledge graph healthy.
- Keep organizational metadata (frontmatter, tags, aliases) in the Markdown files—Eleventy parses it via `gray-matter` to drive permalinks and backlinks.

## Dynamic data & external feeds

- Most dynamic content lives under `src/_data/`. JSON files set the sources and copy for sections such as books, community feeds, and mission articles.
- `src/_data/community-feeds.json` lists the RSS URLs aggregated for the Community page. Update the list and clear `.cache/` to force a refetch.
- `src/_data/videoSources.json` defines the YouTube channels shown on `/videos/`. Add entries with `channelId`, `handle`, or legacy `user` fields; the data loader falls back gracefully when some fields are missing.
- Optional seed and credential helpers live next to the loaders (`youtubeApi.json`, `substackFeed.json`) so you can keep secrets out of git.
- Remote fetches write to `.cache/` for faster rebuilds. Delete that directory when you need to bypass cached responses.
- (See “Offline builds” above for how to compile the site without refetching remote feeds when previewing these pages locally.)


## Embedding filtered book lists

Use the shared `filterBooks` filter together with the `shared/book-list.njk` macro to render curated lists anywhere (wiki notes, blog posts, etc.). Combine contributor and tag filters as needed, and adjust the presentation with the optional flags.

```njk
{% import 'shared/book-list.njk' as bookBlocks %}

{% set ronColeTurnerBooks = books | filterBooks({ contributor: 'Ron Cole-Turner' }) %}
{{ bookBlocks.renderBookList(ronColeTurnerBooks, {
  heading: 'Books featuring Ron Cole-Turner',
  showImages: false
}) }}

{% set ctaBooks = books | filterBooks({ tag: 'CTA', limit: 6 }) %}
{{ bookBlocks.renderBookList(ctaBooks, {
  heading: 'CTA Publications'
}) }}
```

### Environment variables

Place values in a `.env` file or export them before running Eleventy. The lightweight loader in `.eleventy.js` reads `.env` automatically.

| Variable | Purpose |
| --- | --- |
| `YOUTUBE_API_KEY` | Enables YouTube Data API v3 pagination for deeper channel history. Optional but recommended when you need more than the RSS feed surface area. |
| `MAX_VIDEOS_PER_CHANNEL` | Cap per-channel fetches when using the API. Defaults to the value in `youtubeApi.json` (150). |
| `VIDEO_LIMIT` | Hard limit on the number of merged videos rendered onto the site (default 100). Lower it for faster builds or smaller grids. |
| `SUBSTACK_FEED` | Override the Substack RSS URL consumed by `src/_data/substack.js`. Useful for previews or testing alternate newsletters. |
| `CLOUDINARY_CLOUD_NAME` | Change the Cloudinary account used by the `cdnImage` filter. Falls back to `christian-transhumanist-association`. |

## Helpful commands

| Task | Command |
| ---- | ------- |
| Install dependencies | `npm install` |
| Start dev server | `npx @11ty/eleventy --serve` |
| Build once | `npx @11ty/eleventy` |
| Clean output (optional) | `rm -rf _site/ .cache/` |

## Troubleshooting

- **Feed fetch failures:** When a build lacks network access, Eleventy logs `getaddrinfo ENOTFOUND` warnings. Provide network access or seed the relevant `_data` files with cached content.
- **Broken wiki links:** The build surfaces missing wikilinks inline. Add the referenced note to `src/cta-wiki/` or update the link text.
- **Unexpected build output:** Regenerate the site (`npx @11ty/eleventy`) and inspect `_site/`. Because `_site/` is generated, delete it before re-running if you suspect stale artifacts.

## Contributing

1. Create a branch for your change.
2. Run the development server while you work.
3. Commit compiled Markdown or template changes; do not commit `_site/`.
4. Ensure the build command runs cleanly before opening a pull request.

For additional background on content strategy or pending tasks, consult `guidelines.txt` and `todo.txt`.

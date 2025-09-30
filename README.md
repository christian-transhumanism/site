# Christian Transhumanist Association Site

This repository contains the static website for the Christian Transhumanist Association, built with [Eleventy](https://www.11ty.dev/). Content lives under `src/`, including layouts, data files, and a large knowledge base that is ingested from an external Obsidian vault and rendered into the public wiki.

## Project layout

- `src/` – primary Eleventy input directory.
  - `_includes/` – Nunjucks/Liquid layouts and partials shared across the site.
  - `_data/` – global data sources (JSON/JS) that feed pages, community feeds, podcasts, etc.
  - `stylesheets/` – site CSS assets.
  - `cta-wiki/` – external Obsidian vault mirrored into the project and compiled into `/wiki/` and `/board/` pages. The Eleventy config provides wikilink parsing, backlink generation, and custom permalink rules for these notes. Keep the vault’s internal `.obsidian` tooling folder intact, but Eleventy automatically ignores any `cta-wiki/templates/` scaffolds.
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

The static site is written to `_site/`. Deploy that folder to any static host (Netlify, GitHub Pages, S3/CloudFront, etc.). CI/CD pipelines should run the build command, cache `node_modules/` when possible, and publish `_site/` as the artifact.

## Deployment notes

- The project includes numerous remote feeds configured in `.eleventy.js`. Ensure deploy environments allow outbound HTTP(S) so the build can hydrate those feeds; otherwise Eleventy will fall back to placeholder content.
- If using Netlify (typical for Eleventy projects), set the build command to `npx @11ty/eleventy` and the publish directory to `_site`.
- Environment variables can be defined in `.env` or the hosting provider’s UI; the lightweight loader inside `.eleventy.js` reads the file before the build starts.

## Working with the CTA wiki vault

- `src/cta-wiki/` mirrors an external Obsidian vault. Add, edit, or remove Markdown notes here and Eleventy will surface them automatically.
- Wikilinks (`[[Page Name]]`) and Markdown links are resolved to site URLs via custom filters; missing targets render visibly so you can keep the knowledge graph healthy.
- Notes inside `cta-wiki/board/` map to `/board/...` permalinks, while all other notes render under `/wiki/...`.
- Keep organizational metadata (frontmatter, tags, aliases) in the Markdown files—Eleventy parses it via `gray-matter` to drive permalinks and backlinks.

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


# Zhe Jiang (Alex)

Personal academic website about cognitive neuroscience and research practice. The site uses warm ivory, editorial serif headings and original conceptual scientific illustrations.

## Structure

- `public/`: the complete static website; the only directory deployed to GitHub Pages.
- `public/data/content.json`: profile, research questions, project contributions, methods and publication records.
- `public/app.js`: page rendering and small explanatory interactions.
- `public/visualizations.js`: educational state-sequence explorer using invented labels and time bins.
- `public/styles.css`: shared typography, colours and responsive layouts.
- `tools/generate_illustrations.py`: reproducible conceptual artwork using synthetic values only.
- `tools/validate-site.mjs`: public-file, content and metadata checks.
- `.github/workflows/pages.yml`: validate and publish `public/` on pushes to `main`.

## Local preview

Requires Node.js 22 or later. There are no packages to install.

```sh
npm start
```

Open <http://127.0.0.1:4173/>. The local server only binds to this computer and only serves `public/`.

```sh
npm run check
```

## Update and publish

Edit the content file for project text, or the shared CSS for visual changes. Run the checks and review the pages locally before committing. Push reviewed website changes to `main`; the GitHub Pages workflow validates and publishes the public directory. Inspect the workflow result and visit the live site before treating a deployment as complete.

The repository's Pages settings control its custom domain and HTTPS. DNS belongs to the domain registrar and is configured separately. Keep existing mail records intact when changing website DNS.

## Content and artwork

Project pages describe ongoing collaborative work at a high level. Conceptual diagrams contain synthetic coordinates or signals and are labelled accordingly. They do not report empirical results. Bibliographic records require a verified title, author list, status and public link.

The hero is an original AI-generated editorial collage. The scientific SVG artwork is generated locally; it contains no participant data. No external stock images, web fonts or analytics services are used.

Private source notes, internal review reports, raw research data, unpublished manuscripts, participant records, credentials and local execution notes must remain outside the public repository. The root ignore rules intentionally allow only website source and publishing tools. The validator is an additional check, not a substitute for reviewing the staged changes.

Publication entries in `data/content.json` use `title`, `authors` (display string), `status`, `url`, and optional `year` and `venue`. Only add records whose authorship and release status have been verified.

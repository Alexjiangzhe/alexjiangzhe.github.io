# Zhe Jiang (Alex) — Academic Website

Personal academic website for **Zhe Jiang (Alex)**, hosted at [alexjiangzhe.com](https://alexjiangzhe.com/).

## Structure

- `content/site.json`: Single source of truth for biography, education, CV, contact links, research projects and publications.
- `tools/build.mjs`: Builds the static pages in `public/` from `content/site.json`.
- `tools/validate-site.mjs`: Validates metadata, links and publishable file rules before deployment.
- `public/site.css` & `public/site.js`: Stylesheet and mobile menu script.
- `public/assets/`: Conceptual project illustrations and `assets/cv/Zhe_Jiang_CV.pdf` (when added).

## Local Preview & Build

```sh
npm run build   # regenerate static HTML in public/
npm run check   # build + validate
npm start       # local preview server
```

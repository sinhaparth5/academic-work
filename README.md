# Academic Work

A clean, minimal Hugo theme for academics, researchers, and scholars. Built around a text-first philosophy — your writing and research take centre stage.

The repository includes a complete `exampleSite/` and a dedicated `Theme` reference page for checking palette, spacing, grids, tables, code blocks, and LaTeX rendering in one place.

## Features

- Six content sections out of the box: Research, Notes, Library, Projects, Teaching, About
- Numbered home sections with a Swiss editorial layout
- Fluid typographic scale (Source Serif 4)
- WCAG AA accessible colour contrast throughout
- BEM-namespaced CSS (`aw-` prefix) — zero class conflicts
- Responsive down to 320 px
- Dark mode via `prefers-color-scheme`
- LaTeX rendering via KaTeX (opt-in per page or globally)
- PDF links open in a new tab with a PDF badge automatically
- RSS feed with browser-readable XSLT stylesheet
- Tag taxonomy with tag cloud index
- Social links with SVG icons (GitHub, GitLab, X, Instagram, Facebook, WhatsApp, Bitbucket)
- SEO meta, Open Graph, and Twitter Card tags included
- Print stylesheet — hides navigation, expands external links
- Sitemap and robots.txt support

## Installation

### As a Git submodule (recommended)

```bash
git submodule add https://github.com/sinhaparth5/academic-work themes/academic-work
```

Add `theme = "academic-work"` to your `hugo.toml`.

### As a Hugo module

```toml
[module]
  [[module.imports]]
    path = "github.com/sinhaparth5/academic-work"
```

## Quick start

To preview the showcase content from this repository, run:

```bash
hugo server --config exampleSite/hugo.toml --contentDir exampleSite/content
```

If you are using the theme in your own site, copy the structure of `exampleSite/` into your project and run `hugo server` there.

## Configuration

Full showcase configuration lives in [`exampleSite/hugo.toml`](exampleSite/hugo.toml). Typical site parameters:

```toml
[params]
  description = "Your site description for SEO."
  author      = "Your Name"
  tagline     = "Department · Institution"
  email       = "you@institution.edu"
  intro       = "A short paragraph shown on the homepage below the title."

  # Open Graph / Twitter card cover image (place in static/)
  images = ["/images/cover.png"]

  # Enable KaTeX LaTeX rendering site-wide (or set math = true in page front matter)
  math = false

  # Which sections appear on the home page grid
  mainSections = ["research", "notes", "library", "projects"]

  [params.seo]
    siteName      = "Your Name"
    twitterHandle = "@handle"
    defaultRobots = "index,follow"

[[params.social]]
  name = "GitHub"
  icon = "/images/socials/github-svgrepo-com.svg"
  url  = "https://github.com/yourhandle"
```

### Navigation

Edit `data/navigation/main.toml`:

```toml
[[items]]
name = "Research"
url  = "/research/"
```

The showcase navigation in this repository also includes a `Theme` page in `exampleSite/content/theme.md`.

### Content sections

| Section    | Archetype   | Typical use                              |
|------------|-------------|------------------------------------------|
| `research` | `paper`     | Papers, preprints, talks, ongoing work   |
| `notes`    | `note`      | Reading notes, lecture notes, drafts     |
| `library`  | `library`   | PDFs, appendices, data sets              |
| `projects` | `project`   | Software, experiments, side work         |
| `teaching` | `teaching`  | Courses, syllabi, materials              |
| `about`    | `default`   | Single about page                        |

Create content with the correct archetype:

```bash
hugo new research/my-paper.md
hugo new notes/reading-notes.md
hugo new library/appendix-a.md
hugo new projects/my-tool.md
hugo new teaching/ling-101.md
```

### Front matter reference

**Paper / Research**
```yaml
---
title: "Paper Title"
date: 2024-09-01
summary: "One-sentence description."
authors: ["Jane Smith", "John Doe"]
publication: "Journal of Linguistics"
year: 2024
tags: ["syntax", "NLP"]
links:
  - label: "PDF"
    url: "/files/paper.pdf"
  - label: "Code"
    url: "https://github.com/yourname/project-repo"
---
```

**Note**
```yaml
---
title: "Note Title"
date: 2024-11-15
summary: ""
tags: ["reading", "syntax"]
series: "Syntax Readings"
---
```

**Library item**
```yaml
---
title: "Document Title"
date: 2024-06-01
summary: "What this document contains."
file: "/files/document.pdf"
---
```

### LaTeX / Math

KaTeX is loaded automatically when a page has `math = true` in its front matter, or when `math = true` is set globally under `[params]`.

Use `$...$` for inline math and `$$...$$` for display (block) math:

```markdown
The energy–mass relation is $E = mc^2$.

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

Requires Hugo ≥ 0.122.0 (Goldmark passthrough extension).

### Hugo version support

The theme declares Hugo version support in the root [`hugo.toml`](hugo.toml) using:

```toml
[module]
  [module.hugoVersion]
    extended = true
    min = "0.122.0"
```

### SEO & PWA

**robots.txt** is generated automatically (requires `enableRobotsTXT = true` in `hugo.toml`). It allows all crawlers and includes a `Sitemap:` directive pointing to your sitemap.

**sitemap.xml** is generated automatically with smart priorities:

| Page type | Priority | Frequency |
|-----------|----------|-----------|
| Homepage  | 1.0 | daily   |
| Sections  | 0.8 | weekly  |
| Pages     | 0.6 | monthly |
| Tag pages | 0.4 | monthly |

To exclude a page from the sitemap, add `noindex: true` to its front matter (this also sets the `robots` meta to `noindex,nofollow`).

**Web App Manifest** (`/site.webmanifest`) is generated from your `hugo.toml` title and description. Place icon files at:

```
static/
  favicon.ico
  icons/
    favicon-16x16.png
    favicon-32x32.png
    apple-touch-icon.png   (180×180)
    icon-192.png           (192×192)
    icon-512.png           (512×512)
```

### RSS

The feed is available at `/index.xml`. It renders as a styled page in browsers via a built-in XSLT stylesheet.

## Screenshots

Place your screenshots at:

- `images/screenshot.png` — 1500 × 1000 px, full-page view
- `images/tn.png` — 900 × 600 px, thumbnail crop

These are required for listing on [themes.gohugo.io](https://themes.gohugo.io).

If you include screenshots in this README for the theme listing page, use absolute GitHub image URLs rather than relative paths.

## Licence

[MIT](LICENSE)

# Academic Work

Academic Work is a clean Hugo theme for researchers, academics, and technical writers. It is built for publishing papers, notes, teaching material, projects, and downloadable documents with a quiet editorial layout.

The theme includes a complete `exampleSite/` so you can preview the design before using it in your own Hugo site.

## Screenshots

![Academic Work home page](https://raw.githubusercontent.com/sinhaparth5/academic-work/master/assets/images/pics/Screenshot%202026-04-23%20165810.png)

| Research | Notes | Article |
|----------|-------|---------|
| ![Research listing](https://raw.githubusercontent.com/sinhaparth5/academic-work/master/assets/images/pics/Screenshot%202026-04-23%20165852.png) | ![Notes listing](https://raw.githubusercontent.com/sinhaparth5/academic-work/master/assets/images/pics/Screenshot%202026-04-23%20165919.png) | ![Article page](https://raw.githubusercontent.com/sinhaparth5/academic-work/master/assets/images/pics/Screenshot%202026-04-23%20165939.png) |

| Library | Projects | Theme reference |
|---------|----------|-----------------|
| ![Library page](https://raw.githubusercontent.com/sinhaparth5/academic-work/master/assets/images/pics/Screenshot%202026-04-23%20170050.png) | ![Projects page](https://raw.githubusercontent.com/sinhaparth5/academic-work/master/assets/images/pics/Screenshot%202026-04-23%20170110.png) | ![Theme reference page](https://raw.githubusercontent.com/sinhaparth5/academic-work/master/assets/images/pics/Screenshot%202026-04-23%20170131.png) |

## Features

- Academic sections for research, notes, library, projects, teaching, and about pages
- Responsive layout for mobile, tablet, and desktop
- Self-hosted Source Serif 4 typography
- Dark mode through `prefers-color-scheme`
- Accessible landmarks, skip link, keyboard focus states, and current-page navigation
- KaTeX support for inline and display math
- RSS, sitemap, robots.txt, Open Graph, Twitter Card, and JSON-LD metadata
- Tag pages and tag index
- PDF link styling with new-tab context for screen readers
- Static `/search.json` output for adding client-side search
- SCSS structure with `aw-` class prefixing

## Requirements

- Hugo Extended `0.122.0` or newer

## Preview The Example Site

Run this from the repository root:

```bash
hugo server --config exampleSite/hugo.toml --contentDir exampleSite/content
```

If you are currently inside `public/`, move back to the repository root first:

```bash
cd ..
hugo server --config exampleSite/hugo.toml --contentDir exampleSite/content
```

## Installation

Add the theme as a Git submodule:

```bash
git submodule add https://github.com/sinhaparth5/academic-work themes/academic-work
```

Then set the theme in your site config:

```toml
theme = "academic-work"
```

You can also use it as a Hugo module:

```toml
[module]
  [[module.imports]]
    path = "github.com/sinhaparth5/academic-work"
```

## Basic Configuration

See [exampleSite/hugo.toml](exampleSite/hugo.toml) for the full demo configuration.

```toml
baseURL = "https://example.com/"
languageCode = "en"
title = "Your Name"
theme = "academic-work"
enableRobotsTXT = true
disableHugoGeneratorInject = true

[params]
  description = "Research, writing, teaching, and projects."
  author = "Your Name"
  tagline = "Department · Institution"
  email = "you@example.com"
  intro = "A short introduction shown on the home page."
  images = ["/images/cover.png"]
  math = false
  mainSections = ["research", "notes", "library", "projects"]

  [params.seo]
    siteName = "Your Name"
    twitterHandle = "@yourhandle"
    defaultRobots = "index,follow"
    imageWidth = 1200
    imageHeight = 630
```

## Navigation

Edit `data/navigation/main.toml`:

```toml
[[items]]
name = "Research"
url = "/research/"

[[items]]
name = "Notes"
url = "/notes/"
```

## Content Sections

| Section | Archetype | Use |
|---------|-----------|-----|
| `research` | `paper` | Publications, preprints, talks, and working papers |
| `notes` | `note` | Reading notes, lecture notes, and drafts |
| `library` | `library` | PDFs, appendices, CVs, and datasets |
| `projects` | `project` | Software, experiments, and research tools |
| `teaching` | `teaching` | Courses, syllabi, and teaching material |
| `about` | `default` | Profile or biography page |

Create new content with Hugo:

```bash
hugo new research/my-paper.md
hugo new notes/my-note.md
hugo new library/my-document.md
hugo new projects/my-project.md
hugo new teaching/my-course.md
```

## Front Matter

Research page:

```yaml
---
title: "Paper Title"
date: 2024-09-01
summary: "One-sentence description."
authors: ["Jane Smith", "John Doe"]
publication: "Journal or Conference"
year: 2024
tags: ["distributed systems", "consensus"]
links:
  - label: "PDF"
    url: "/files/paper.pdf"
  - label: "Code"
    url: "https://github.com/example/project"
---
```

Library item:

```yaml
---
title: "Curriculum Vitae"
date: 2024-06-01
summary: "Current academic CV."
file: "/files/cv.pdf"
---
```

## Math

Enable KaTeX globally with:

```toml
[params]
  math = true
```

Or enable it per page:

```yaml
---
math: true
---
```

Use standard inline and display math:

```markdown
Inline math uses $E = mc^2$.

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$
```

## Static Assets

Recommended paths:

```text
static/
  favicon.ico
  files/
    paper.pdf
  images/
    cover.png
  icons/
    favicon-16x16.png
    favicon-32x32.png
    apple-touch-icon.png
    icon-192.png
    icon-512.png
```

Social icons used by the demo live in `assets/images/socials/`.

## Validation

The repository includes a small validation suite:

```bash
npm run validate
```

It checks content front matter, local links, generated output, image attributes, JSON-LD, and search index generation.

## Theme Submission

For a Hugo Themes submission, make sure these files are present:

```text
images/screenshot.png
images/tn.png
```

Use the screenshots in `assets/images/pics/` as the source for those final listing images.

## License

[MIT](LICENSE)

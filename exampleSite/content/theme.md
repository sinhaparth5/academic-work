---
title: "Theme"
summary: "A single-page reference for the Academic Work theme system: palette, spacing, grids, prose, tables, code, and LaTeX."
math: true
eyebrow: "Theme"
---

This page documents the visual language and content behaviour of **Academic Work** in one place. It is intended as a working reference for anyone adapting the theme, extending components, or checking how different content types render in a single-page layout.

Use it as a style guide, a documentation page, and a regression check for future layout changes.

{{< palette >}}

{{< spacing-scale >}}

{{< grid-examples >}}

## Callouts

{{< callout tone="note" title="Note" >}}
Use a note callout for contextual guidance, small editorial comments, or documentation hints that should stand out without overpowering the page.
{{< /callout >}}

{{< callout tone="tip" title="Tip" >}}
Use a tip callout for practical implementation guidance, shortcuts, or reminders that help the reader act on the content.
{{< /callout >}}

{{< callout tone="warning" title="Warning" >}}
Use a warning callout sparingly for breaking changes, submission constraints, or decisions that would affect generated output.
{{< /callout >}}

## Figure

{{< figure
  src="/images/notes/digital-dna-helix.png"
  alt="Digital DNA helix illustration"
  caption="A modest inline figure sitting inside the prose column with a caption."
  size="narrow"
>}}

## Typography

The template is built around a restrained editorial hierarchy:

- **Display headings** use the largest fluid steps for home and section entrances.
- **Page headings** sit slightly lower, keeping internal pages calm and readable.
- **Body copy** prioritises long-form reading over dense UI styling.
- `Monospace content` is reserved for code, notation, paths, and technical labels.

### Type Sample

# Display Heading

## Section Heading

### Subsection Heading

This is standard body copy in the main reading measure. It is meant to feel stable and unhurried, especially for research statements, notes, and longer essays. Inline code like `hugo server` or `/research/` should remain visually distinct without overpowering the surrounding text.

> This is a blockquote example. It works well for notes, cited observations, or short highlighted passages inside essays and documentation.

## Lists

### Unordered List

- Research notes and commentary
- Project summaries and links
- Reading lists and resource pages

### Ordered List

1. Draft the content model.
2. Assign a layout or reuse the default single template.
3. Add front matter, examples, and supporting links.

### Nested List

- Section-level content
  - prose
  - metadata
  - supporting links
- Page-level enhancements
  - tables
  - figures
  - mathematics

## Code Blocks

```toml
[params]
  description = "A simple and minimal Hugo template for academic work."
  author = "Your Name"
  tagline = "Research, notes, writing, and documents in one place."
```

```bash
hugo new notes/reading-distributed-systems.md
hugo server
```

## Tables

{{< table-demo
  variant="default"
  title="Default Table"
  desc="The default table keeps visible borders and a neutral surface. Use this for reference material, schedules, or compact data."
>}}
| Section | Purpose | Typical Content |
| --- | --- | --- |
| Research | Papers and talks | Publications, preprints, conference notes |
| Notes | Working ideas | Reading notes, drafts, summaries |
| Library | Documents | PDFs, appendices, datasets |
{{< /table-demo >}}

{{< table-demo
  variant="striped"
  title="Striped Table"
  desc="The striped variation adds alternating row fills for slightly denser scans without changing the overall tone."
>}}
| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#f5f4f1` | Page background |
| `--surface` | `#ffffff` | Cards and code blocks |
| `--line` | `#d4d1ca` | Borders and dividers |
| `--label` | `#a03b10` | Eyebrows and accents |
{{< /table-demo >}}

{{< table-demo
  variant="soft"
  title="Striped Table Without Borders"
  desc="This version removes the strong grid lines and relies on row striping and spacing. It works for lighter documentation pages."
>}}
| Scale | Desktop Use | Mobile Use |
| --- | --- | --- |
| Compact | Metadata, tags, labels | Short lists and captions |
| Regular | Cards, prose blocks | Default content spacing |
| Spacious | Hero sections, featured content | Intro sections and grouped modules |
{{< /table-demo >}}

## LaTeX and Math

KaTeX can be enabled per page or globally. This page enables math in front matter so both inline and display examples render on the same single page.

Inline math example: the space requirement of a vector clock is $O(n)$.

Display math example:

$$
\Pr(X = x_i) = \frac{w_i}{\sum_{j=1}^{k} w_j}
$$

A second display example:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Content Patterns

### Research Entry Pattern

- Title
- Authors
- Venue or publication
- Abstract or summary
- External links such as PDF, code, slides, or project page

### Notes Pattern

- Clear title
- Date
- Optional series name
- Lightweight tags
- Prose-first body content

### Library Pattern

- Document title
- Short description of what the file contains
- Direct file link for PDFs or appendices

### Project Metadata Pattern

{{< callout tone="note" title="Project Specimen" >}}
**Language:** Go  
**Status:** Active  
**Focus:** Adaptive consensus and systems benchmarking
{{< /callout >}}

## Horizontal Rule

---

## Closing Note

The intention of this page is not just to show what is possible, but to establish a stable visual contract for the theme. If a future change affects spacing, table rendering, heading rhythm, code blocks, or math rendering, this page should make that immediately visible.

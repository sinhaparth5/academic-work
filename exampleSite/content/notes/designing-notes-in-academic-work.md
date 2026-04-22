---
title: "Demo Note: Images, Tables, and LaTeX in Academic Work"
date: 2025-01-12
draft: false
math: true
summary: "A showcase note demonstrating image embedding, a borderless striped table, lists, code, and LaTeX rendering in the Academic Work theme."
tags: ["notes", "template", "working notes", "design system"]
series: "Theme Demonstrations"
---

This note exists as a practical reference for the `notes` section of the theme. It demonstrates how a longer-form note can mix narrative prose with an image, a styled table, code, lists, and mathematical notation without breaking the reading rhythm.

## Embedded image

The image below is intentionally modest in size so it sits naturally inside the prose column instead of behaving like a full-width hero.

{{< figure
  src="/images/notes/digital-dna-helix.png"
  alt="Digital DNA helix illustration"
  caption="A narrow illustrative figure placed inside a prose-first note."
  size="narrow"
>}}

## Why notes matter in this theme

The `notes` section is meant for material that is more provisional than a formal paper and more structured than a project page. Typical uses include:

- reading notes
- technical summaries
- lecture fragments
- working definitions
- idea sketches that may later become papers or talks

{{< callout tone="tip" title="Good Note Behaviour" >}}
Notes work best when they preserve a strong reading rhythm. Images, equations, and tables should support the text rather than dominate it.
{{< /callout >}}

## A small mathematical example

Inline mathematics should read cleanly inside a sentence, such as the observation that the storage cost of a dense representation scales as $O(n^2)$.

For display equations, the note layout should still preserve measure and legibility:

$$
f(x) = \frac{1}{Z} \exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)
$$

And a second example, written in a more algorithmic style:

$$
\mathcal{L}(\theta) = \sum_{i=1}^{m} \left(y_i - \hat{y}_i(\theta)\right)^2 + \lambda \lVert \theta \rVert_2^2
$$

## Borderless striped table

This table uses the softer striped variant, which is useful when you want visual grouping without the hardness of a full ruled grid.

{{< table-demo
  variant="soft"
  title="Striped Table Without Borders"
  desc="A lighter table style for notes, reading summaries, and internal documentation where row grouping matters more than strict tabular framing."
>}}
| Component | Role in a note | Suggested tone |
| --- | --- | --- |
| Summary | Establishes context quickly | Clear and short |
| Image | Breaks up dense prose | Relevant, not decorative |
| Table | Organises compact comparisons | Quiet and readable |
| Formula | Captures the formal core | Precise and minimal |
{{< /table-demo >}}

## Code fragment

Notes often include commands, snippets, or configuration fragments:

```bash
hugo new notes/my-reading-note.md
hugo server --config exampleSite/hugo.toml --contentDir exampleSite/content
```

```toml
[params]
  mainSections = ["research", "notes", "library", "projects"]
  math = false
```

## Closing remark

If the theme is doing its job, a page like this should feel plain in the good sense: calm, readable, and capable of carrying a mixture of text, reference material, and formal notation without needing custom page templates.

# Changelog

All notable changes to Academic Work are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
This project uses [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-04-22

### Added

- Initial public release
- Six content sections: Research, Notes, Library, Projects, Teaching, About
- Swiss editorial homepage layout with CSS-counter-numbered sections
- Source Serif 4 fluid typographic scale
- BEM-namespaced CSS (`aw-` prefix) throughout — zero class conflicts
- Dark mode via `prefers-color-scheme` media query
- Responsive navigation with accessible hamburger menu (SVG icons, `aria-expanded`)
- LaTeX rendering via KaTeX 0.16.45 — opt-in per page (`math = true`) or globally
- PDF links open in a new tab with an automatic `PDF` badge
- RSS feed with browser-readable XSLT stylesheet (`/feed.xsl`)
- Tag taxonomy with tag cloud index page
- Back-link on single pages pointing to the parent section
- Active navigation highlighting using `hasPrefix` path matching
- Custom 404 page
- Print stylesheet — hides chrome, expands external link URLs
- WCAG AA colour contrast throughout (light and dark modes)
- Social links with bundled SVG icons
- SEO meta, Open Graph, and Twitter Card tags
- `exampleSite/` demonstrating all sections and front matter options
- MIT licence

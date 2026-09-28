# Component registry

Source of truth for every block/component in this project. Check this before
adding or changing anything. Block names **preserve the reference's own BEM
component names** (from rockwellautomation.com/en-in's `site.bundle.css`) so the
reference-to-implementation mapping stays legible.

## Reference discovery notes

- The reference is a **classic AEM Sites** build (Sling/HTL, `.html` URLs,
  `cmp-` Core Components), not EDS. Header, mega-nav and footer are rendered
  client-side (web components) and were captured with Playwright against the
  live site; everything else is in the server HTML.
- **Design tokens** measured from `site.bundle.css`: brand blue `#003e7e`,
  action blue `#1968b3` (hover `#0053a1`), orange accent `#f58025`, charcoal
  `#2d2d2d`, black `#1a1a1a`, fog `#efefef`, platinum `#e5e6e9`, border `#ccc`.
  Type family: **Barlow** (Regular 400 / Medium 500 / Bold 700).
- **Reference breakpoints** are 768/1024/1201px; per the skill these are mapped
  onto this project's fixed 768/960/1200 mobile-first scale.

## Not reproduced (deliberate)

- `cookie-popup`, `pdf-viewer`, `modal-container`, `social-media-sharing`
  tracking, and all analytics/marketing tags — the skill's third-party rule:
  reproducing appearance doesn't require reproducing tracking/consent widgets.
- The real **Rockwell Automation logo/wordmark** — a registered trademark; a
  neutral placeholder mark is used in the header, footer and favicon instead.
- All photography — generated placeholder SVGs.

## Reference class → implementation mapping (platform-level, not blocks)

| Reference class | Implemented as |
| --- | --- |
| `generic-container__bg-*` | EDS section styles: `bg-light-gray`, `bg-platinum`, `bg-dark` in `styles/styles.css` |
| `column-control` | standard EDS `columns` block |
| `ra-button` / `link` | global button/CTA CSS + `decorateButtons` in `scripts/aem.js` |

## Blocks

### Shared

| Block | Reference name | Description | Interactive | Used by |
| --- | --- | --- | --- | --- |
| `header` | (client-rendered nav) | Utility bar + primary nav (Products, Capabilities, Industries, Support, Company) + search/region/account; sticky, mobile drawer | JS (drawer, sticky) | all pages |
| `footer` | (client-rendered) | 8-column link footer (Company, News & Events, Trending Topics, Training, PartnerNetwork, Our Brands, Contact Us, Insights) + legal bar + social | no | all pages |
| `hero-banner` | `hero-banner` | Page banner: 2-col image/text grid (image + title/subtitle/CTA), stacks on mobile | no | 16/16 |
| `breadcrumb` | `breadcrumb` | Breadcrumb trail (div-rows, rebuilt to `<ol>`) | no | 15/16 |
| `teaser` | `teaser` | Image + heading + text + CTA promo unit | no | 11 |
| `content-tile` | `content-tile` | Card grid tile (image, title, summary, link) | no | 7 |
| `sub-nav` | `sub-nav` | In-page anchor/section nav bar | JS (scroll-spy optional) | 7 |
| `product-experience` | `product-experience` | Featured product/capability showcase row | no | 5 |
| `columns` | `column-control` | Generic multi-column layout | no | 16 |
| `generic-filter` | `generic-filter` / `filter` | Filter chips/toggle over a card grid | JS (filter) | 3 |
| `carousel` | `carousel` / `glide` | Horizontal slide carousel | JS (slides) | 2 |
| `accordion` | `cmp-accordion` | Expand/collapse Q&A — native `<details>`/`<summary>` | CSS/native | 2 |
| `value-prop-grid` | `value-prop-grid` | Stat/value-proposition grid | no | 2 |
| `video` | `video` | Poster image + play, lazy iframe on click | JS (lazy embed) | 2 |
| `quote` | `cmp-quote` | Pull quote with attribution | no | 2 |
| `badge` | `badge` | Small category/tag label | no | 3 |

### Page-specific

| Block | Reference name | Description | Used by |
| --- | --- | --- | --- |
| `animated-header` | `animated-header` | Home hero with animated title/subtitle over media | home |
| `campaign-tags` | `campaign-tags` | Home filterable campaign card carousel | home |
| `company-news` | `company-news` | Home news/results highlight row | home |
| `logo-links` | `logo-links` | Home brand/partner logo strip | home |
| `quick-links` | `quick-links` | Home quick-link shortcut grid | home |
| `product-category-list` | `product-category-list` | Hardware category list | hardware |
| `product-featured-grid` | `product-featured-grid` | Hardware featured products grid | hardware |
| `product-recommendations` | `product-recommendations` | Hardware recommended products row | hardware |
| `teaser-links` | `teaser-links` | Compact link-list teaser variant | factorytalk, support |
| `author-details` | `author-details` | Article/case-study author byline + publish date | article, case study |

## Real design tokens

Defined as CSS custom properties in `styles/styles.css` (`:root`). Do not
eyeball new values — reuse these tokens.

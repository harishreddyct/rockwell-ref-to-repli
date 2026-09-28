# AGENTS.md

Conventions for anyone (human or agent) working in this repo.

## What this project is

A vanilla Edge Delivery Services (EDS) site: plain HTML, CSS and JS, no build
step, no framework. It is a structural/visual replication of
rockwellautomation.com/en-in (a classic AEM Sites build), recreated using EDS
blocks and conventions — **not** a copy of the reference's implementation. Block
names preserve the reference's own BEM component names (`hero-banner`, `teaser`,
`content-tile`, `sub-nav`, etc.) so the mapping stays legible; see
`docs/component-registry.md`.

Imagery is generated placeholder SVGs. The site logo is a neutral placeholder
mark — the real Rockwell Automation logo/wordmark is a registered trademark and
is deliberately not reproduced. Page copy is taken from the reference as-is.

**This repo is code only.** Actual page content isn't stored as files here — it's
authored in Document Authoring (DA) at
`da.live/#/harishreddyct/rockwell-ref-to-repli` and served through
`main--rockwell-ref-to-repli--harishreddyct.aem.page` (preview) / `.aem.live`
(production). Never add page-content `.html` files (a home page, an article,
etc.) back into this repo — if a page needs new copy, author it in DA. What
belongs here is blocks, scripts, styles, icons, and placeholder assets.

## Structure

- `scripts/aem.js` — the core decoration/loading library. Treat as vendored;
  don't hand-edit block-loading behavior here without a strong reason.
- `scripts/scripts.js` — page-level decoration entry point (loaded eagerly):
  section/block metadata, header/footer loading, LCP handling.
- `scripts/delayed.js` — deferred, non-critical JS loaded after the page is
  interactive (currently empty — no analytics/tracking is wired in).
- `styles/styles.css` — global mobile-first styles needed for first paint.
- `styles/fonts.css` — font notes; the webfont (Barlow) is linked in `head.html`.
- `styles/lazy-styles.css` — below-the-fold styling, fetched by `scripts.js`.
- `blocks/{name}/{name}.js` + `{name}.css` — one folder per block. A block is
  authored in content as `<div class="{name}">…</div>`; `scripts.js` decorates
  it, which loads the matching JS/CSS.
- `icons/` — small UI SVGs (chevrons, search, social, menu). Content imagery
  lives in `images/`, never mixed into this folder.
- `images/` — placeholder content imagery (generated SVG placeholders).
- `fonts/` — vendored webfont files (currently empty; Barlow loads from Google
  Fonts — see `fonts/README.md`).
- `docs/` — component and page registries; the source of truth for what's built
  and where it's used. Check both before adding or changing a component.
- `tools/` — local dev tooling only (Lighthouse runner, visual-diff runner).
  Excluded from publishing via `.hlxignore`.
- Page routes and the `nav`/`footer` content fragments the `header`/`footer`
  blocks fetch (`/nav.plain.html`, `/footer.plain.html`) are DA documents, not
  files in this repo.

## Reference → implementation mapping (not everything is a block)

- `generic-container` background modifiers → EDS **section styles**
  (`bg-light-gray`, `bg-platinum`, `bg-dark`) in `styles/styles.css`, not a block.
- `column-control` → the standard EDS **`columns`** block.
- `ra-button` / `link` → global button/CTA CSS driven by `decorateButtons` in
  `scripts/aem.js`.

## Breakpoints

Mobile-first, four states, fixed across the whole project — do not introduce
others:

- base (unscoped, mobile)
- `min-width: 768px`
- `min-width: 960px`
- `min-width: 1200px`

## Design tokens

Real values measured from the reference's shipped `site.bundle.css`, defined as
CSS custom properties in `styles/styles.css`: brand blue `#003e7e`, action blue
`#1968b3`, orange accent `#f58025`, charcoal `#2d2d2d`, Barlow type family.

## Conventions

- No component-scoped frameworks. If a block needs interactivity, write scoped
  vanilla JS in that block's own `{name}.js`.
- Prefer semantic HTML and CSS-only interaction (`:hover`, `:focus-within`,
  `<details>`) over JS wherever it can do the same job.
- Every block gets a row in `docs/component-registry.md`; every page gets a row
  in `docs/page-registry.md`. Update both as you go.
- Run `npm run lint` before considering a change done.

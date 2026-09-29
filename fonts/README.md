# fonts/

Self-hosted webfont files for the site's type family, **Barlow** (matching the
reference's shipped BarlowRegular/Medium/Bold faces).

## Files

- `Barlow-Regular.woff2` — weight 400
- `Barlow-Medium.woff2` — weight 500
- `Barlow-Bold.woff2` — weight 700

These are the **latin subset** (`U+0000-00FF` + common punctuation/symbols)
`.woff2` files from Google Fonts (Barlow v13), which covers all glyphs this
English-content site uses at the smallest size (~22 KB each).

## Why self-hosted

Previously loaded from the Google Fonts CDN via a `<link>` in `head.html`. They
were moved in-repo so the font swap is same-origin and deterministic:

- No external DNS lookup / TLS handshake / CDN round-trip on first paint.
- No flash of fallback text (Arial/Helvetica) racing the CDN — which showed up
  as "typography mismatch" in Playwright screenshots.

The `@font-face` rules live in [`../styles/fonts.css`](../styles/fonts.css), and
the two primary weights (400/700) are `<link rel="preload">`ed in `head.html`.

## Refreshing / adding weights

Fetch the CSS with a modern-browser User-Agent (so Google returns `.woff2`),
then download the `latin` subset URL for each weight:

```sh
curl -s "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&display=swap" \
  -H "User-Agent: Mozilla/5.0 ... Chrome/120 ..."
```

Add a matching `@font-face` block in `styles/fonts.css` for any new weight.

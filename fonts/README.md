# fonts/

Vendored webfont files would live here. This project currently loads its type
family (**Barlow**, matching the reference's shipped BarlowRegular/Medium/Bold
faces) from Google Fonts via a `<link>` in `head.html`, so there are no
self-hosted font files checked in yet. If the fonts are later self-hosted for
performance, drop the `.woff2` files here and add matching `@font-face` rules to
`styles/fonts.css`.

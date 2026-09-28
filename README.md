# Rockwell Automation en-IN — EDS replication

A vanilla [Adobe Edge Delivery Services](https://www.aem.live/) (EDS) site that
recreates the visual and functional system of
[rockwellautomation.com/en-in](https://www.rockwellautomation.com/en-in.html) —
plain HTML, CSS and JS, no framework, no build step. It is a structural/visual
replication built with the reference's own component names, generated placeholder
imagery, and a neutral placeholder logo (the real Rockwell logo/wordmark is a
trademark and is deliberately **not** reproduced). Page copy is taken from the
reference.

**This repository holds code only** — blocks, scripts, styles, icons and
placeholder imagery. Actual page content is authored in Document Authoring (DA)
and served through the `*.aem.page` (preview) / `*.aem.live` (production) backend:

- **Content authoring**: https://da.live/#/harishreddyct/rockwell-ref-to-repli
- **Preview**: https://main--rockwell-ref-to-repli--harishreddyct.aem.page/
- **Live**: https://main--rockwell-ref-to-repli--harishreddyct.aem.live/

## Develop

```sh
npm install
npm run serve       # aem up — local dev proxying content from preview
npm run lint        # eslint + stylelint
```

`aem up` serves this repo's code from disk but proxies page content from the
deployed preview URL — "does it work locally" and "does it work on preview" are
the same question. If content looks stale locally, push it to DA/preview.

## Structure

See [AGENTS.md](AGENTS.md).

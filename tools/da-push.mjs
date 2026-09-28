/*
 * DA content push helper.
 *
 * Uploads every generated page plus the nav/footer fragments to Document
 * Authoring (admin.da.live) for this project, then triggers preview + publish
 * on admin.hlx.page. DA is authenticated via Adobe IMS in the browser, so this
 * needs a bearer token captured from a logged-in da.live session:
 *
 *   1. Log in at https://da.live/#/harishreddyct/rockwell-ref-to-repli
 *   2. Open DevTools > Network, do any action, copy the `authorization` header
 *      value (the part after "Bearer ").
 *   3. Run:  DA_TOKEN=<token> node tools/da-push.mjs
 *
 * The skill notes admin.da.live and admin.hlx.page may need differently-scoped
 * tokens; if preview/publish 401s while the source PUT succeeded, use da.live's
 * own bulk preview/publish UI instead (it uses the browser session directly).
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ORG = 'harishreddyct';
const REPO = 'rockwell-ref-to-repli';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKEN = process.env.DA_TOKEN;

if (!TOKEN) {
  process.stderr.write('Set DA_TOKEN (see the header of this file for how).\n');
  process.exit(1);
}

// route -> local file
const ROUTES = {
  '/': 'index.html',
  '/products': 'products.html',
  '/products/hardware': 'products/hardware.html',
  '/products/software/factorytalk': 'products/software/factorytalk.html',
  '/capabilities': 'capabilities.html',
  '/capabilities/smart-manufacturing': 'capabilities/smart-manufacturing.html',
  '/industries': 'industries.html',
  '/industries/food-beverage': 'industries/food-beverage.html',
  '/company/about-us': 'company/about-us.html',
  '/company/news': 'company/news.html',
  '/company/news/blogs/ai-transform-manufacturing': 'company/news/blogs/ai-transform-manufacturing.html',
  '/company/news/case-studies/cornish-lithium-plant': 'company/news/case-studies/cornish-lithium-plant.html',
  '/support': 'support.html',
  '/events': 'events.html',
  '/careers': 'careers.html',
  '/sustainability': 'sustainability.html',
  '/nav': 'nav.plain.html',
  '/footer': 'footer.plain.html',
};

const auth = { Authorization: `Bearer ${TOKEN}` };

/** DA stores documents as the page's main content HTML. */
function toDaDocument(html, isFragment) {
  if (isFragment) return `<body><main><div>${html}</div></main></body>`;
  const main = html.match(/<main>([\s\S]*?)<\/main>/i);
  const inner = main ? main[1] : html;
  return `<body><main>${inner}</main></body>`;
}

async function putSource(path, body) {
  const url = `https://admin.da.live/source/${ORG}/${REPO}${path}.html`;
  const form = new FormData();
  form.append('data', new Blob([body], { type: 'text/html' }));
  const resp = await fetch(url, { method: 'PUT', headers: auth, body: form });
  return resp.status;
}

async function trigger(action, path) {
  const url = `https://admin.hlx.page/${action}/${ORG}/${REPO}/main${path}`;
  const resp = await fetch(url, { method: 'POST', headers: auth });
  return resp.status;
}

async function run() {
  for (const [route, file] of Object.entries(ROUTES)) {
    const isFragment = route === '/nav' || route === '/footer';
    const html = await readFile(join(ROOT, file), 'utf8');
    const daPath = route === '/' ? '/index' : route;
    // eslint-disable-next-line no-await-in-loop
    const put = await putSource(daPath, toDaDocument(html, isFragment));
    let prev = '-';
    let live = '-';
    if (put >= 200 && put < 300) {
      // eslint-disable-next-line no-await-in-loop
      prev = await trigger('preview', route === '/' ? '/' : route);
      // eslint-disable-next-line no-await-in-loop
      live = await trigger('live', route === '/' ? '/' : route);
    }
    process.stdout.write(`${route}\tsource ${put}\tpreview ${prev}\tlive ${live}\n`);
  }
}

run();

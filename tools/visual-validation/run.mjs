/*
 * Visual validation runner. Screenshots each implemented route at the
 * project's four breakpoints so they can be diffed against the live reference.
 *
 * Usage:
 *   node tools/visual-validation/run.mjs [baseUrl]
 *
 * baseUrl defaults to the local dev server (http://localhost:3000). Pass a
 * preview/live URL to shoot the deployed site instead. Screenshots are written
 * to tools/visual-validation/output/ (gitignored).
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'output');

const BREAKPOINTS = [375, 768, 960, 1200];

const ROUTES = [
  '/',
  '/products',
  '/products/hardware',
  '/products/software/factorytalk',
  '/capabilities',
  '/capabilities/smart-manufacturing',
  '/industries',
  '/industries/food-beverage',
  '/company/about-us',
  '/company/news',
  '/company/news/blogs/ai-transform-manufacturing',
  '/company/news/case-studies/cornish-lithium-plant',
  '/support',
  '/events',
  '/careers',
  '/sustainability',
];

const baseUrl = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');

async function shoot() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const route of ROUTES) {
      for (const width of BREAKPOINTS) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const url = `${baseUrl}${route}`;
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(500);
          const slug = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
          const file = join(OUT, `${slug}_${width}.png`);
          await page.screenshot({ path: file, fullPage: true });
          process.stdout.write(`shot ${route} @ ${width} -> ${file}\n`);
        } catch (err) {
          process.stderr.write(`FAIL ${url} @ ${width}: ${err.message}\n`);
        } finally {
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}

shoot();

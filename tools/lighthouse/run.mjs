/*
 * Lighthouse runner. Runs a mobile Lighthouse audit against each implemented
 * route and writes the JSON reports to tools/lighthouse/output/ (gitignored),
 * printing the four category scores per route.
 *
 * Usage:
 *   node tools/lighthouse/run.mjs [baseUrl]
 *
 * baseUrl defaults to the local dev server (http://localhost:3000).
 */
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'output');

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

async function run() {
  await mkdir(OUT, { recursive: true });
  const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };
  try {
    for (const route of ROUTES) {
      const url = `${baseUrl}${route}`;
      try {
        const result = await lighthouse(url, options);
        const { categories } = result.lhr;
        const slug = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
        await writeFile(join(OUT, `${slug}.json`), result.report);
        const score = (c) => Math.round((categories[c]?.score || 0) * 100);
        process.stdout.write(
          `${route}\tperf ${score('performance')}\ta11y ${score('accessibility')}\tbp ${score('best-practices')}\tseo ${score('seo')}\n`,
        );
      } catch (err) {
        process.stderr.write(`FAIL ${url}: ${err.message}\n`);
      }
    }
  } finally {
    await chrome.kill();
  }
}

run();

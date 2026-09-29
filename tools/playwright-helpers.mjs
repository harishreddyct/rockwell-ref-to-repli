/*
 * Shared Playwright helpers for this project's visual/audit scripts.
 */

/**
 * Blocks until webfonts have finished loading and the given family is actually
 * available for painting. Without this, screenshots can capture the fallback
 * stack (Arial/Helvetica) mid-swap, which makes typography look "mismatched"
 * even when layout is correct. Call it after page.goto and before screenshot.
 *
 * @param {import('playwright').Page} page
 * @param {string} [family='Barlow'] font-family to confirm is ready
 */
export async function waitForFonts(page, family = 'Barlow') {
  // resolve once every @font-face referenced by used CSS has settled
  await page.evaluate(() => document.fonts.ready);
  // then confirm the specific family is loaded at the weights we ship (400/700)
  await page.waitForFunction(
    (fam) => document.fonts.check(`400 1rem ${fam}`)
      && document.fonts.check(`700 1rem ${fam}`),
    family,
  );
}

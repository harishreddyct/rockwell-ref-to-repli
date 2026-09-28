/**
 * hero-banner — page banner with a two-column image/text grid that stacks on
 * mobile. Authored as one row with two cells: an image cell and a text cell
 * (title + subtitle + CTA). Order-independent: whichever cell holds the image
 * becomes the media side. A single-cell (text-only) banner is also supported.
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  const imageCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== imageCell);

  if (imageCell) imageCell.classList.add('hero-banner-image');
  if (textCell) textCell.classList.add('hero-banner-content');

  if (!imageCell) block.classList.add('hero-banner--text-only');
}

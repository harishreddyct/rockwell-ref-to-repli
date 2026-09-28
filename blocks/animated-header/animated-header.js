/**
 * animated-header — the home hero: a full-bleed media background with a title,
 * subtitle and CTA that fade/slide in on load. Authored as one row: an image
 * cell and a text cell (h1 + subtitle + CTA). The animation is CSS-driven; JS
 * only adds the class that triggers it after the block is in the DOM.
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  const imageCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== imageCell);

  if (imageCell) imageCell.classList.add('animated-header-media');
  if (textCell) textCell.classList.add('animated-header-content');

  requestAnimationFrame(() => block.classList.add('animated-header--in'));
}

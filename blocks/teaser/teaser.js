/**
 * teaser — an image + heading + text + CTA promo unit. Authored as one row with
 * an image cell and a text cell. Add the `reverse` variant class to place the
 * image on the right at desktop; text-only teasers are supported too.
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  const imageCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== imageCell);

  if (imageCell) imageCell.classList.add('teaser-image');
  if (textCell) textCell.classList.add('teaser-content');
  if (!imageCell) block.classList.add('teaser--text-only');
}

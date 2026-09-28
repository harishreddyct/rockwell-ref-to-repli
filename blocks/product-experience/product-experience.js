/**
 * product-experience — a large featured product/capability showcase: media on
 * one side, heading + description + CTA on the other. Authored as one row with
 * an image cell and a text cell. Add the `reverse` variant to flip sides at
 * desktop.
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  const imageCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== imageCell);

  if (imageCell) imageCell.classList.add('product-experience-media');
  if (textCell) textCell.classList.add('product-experience-content');
}

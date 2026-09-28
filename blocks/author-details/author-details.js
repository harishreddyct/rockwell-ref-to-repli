/**
 * author-details — an article/case-study byline: author photo, author name/role,
 * and publish date / read time. Authored as one row: an optional avatar image
 * cell and a text cell (name, role, date). Rebuilt into a compact byline.
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  const imageCell = cells.find((c) => c.querySelector('picture, img'));
  const textCell = cells.find((c) => c !== imageCell);

  const byline = document.createElement('div');
  byline.className = 'author-details-byline';

  if (imageCell) {
    imageCell.classList.add('author-details-avatar');
    byline.append(imageCell);
  }
  if (textCell) {
    textCell.classList.add('author-details-meta');
    byline.append(textCell);
  }

  block.textContent = '';
  block.append(byline);
}

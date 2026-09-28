/**
 * product-featured-grid — a grid of featured product cards. Each authored row is
 * one product: an image cell plus a content cell (title, description, CTA).
 */
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'product-featured-grid-items';

  [...block.children].forEach((row) => {
    const card = document.createElement('article');
    card.className = 'product-featured-card';
    [...row.children].forEach((cell) => {
      cell.className = cell.querySelector('picture, img')
        ? 'product-featured-image'
        : 'product-featured-body';
      card.append(cell);
    });
    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}

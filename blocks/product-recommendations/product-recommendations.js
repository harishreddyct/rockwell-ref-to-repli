/**
 * product-recommendations — a compact, horizontally scrollable row of recommended
 * products. Each authored row is one product: a small image, a title and a link.
 * Uses a scroll-snap track so it needs no carousel JS.
 */
export default function decorate(block) {
  const track = document.createElement('div');
  track.className = 'product-recommendations-track';

  [...block.children].forEach((row) => {
    const card = document.createElement('a');
    const link = row.querySelector('a');
    card.className = 'product-recommendations-card';
    card.href = link ? link.getAttribute('href') : '#';

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        cell.className = 'product-recommendations-image';
        card.append(cell);
      } else if (cell.textContent.trim()) {
        const label = document.createElement('span');
        label.className = 'product-recommendations-label';
        label.textContent = cell.textContent.trim();
        card.append(label);
      }
    });
    track.append(card);
  });

  block.textContent = '';
  block.append(track);
}

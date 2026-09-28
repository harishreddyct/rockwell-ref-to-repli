import { labelGenericLink } from '../content-tile/content-tile.js';

/**
 * company-news — the home page's news/results highlight row. Each authored row
 * is one news item: an optional image, a title and a summary/link. Rendered as a
 * horizontal set of news cards.
 */
export default function decorate(block) {
  const list = document.createElement('div');
  list.className = 'company-news-list';

  [...block.children].forEach((row) => {
    const card = document.createElement('article');
    card.className = 'company-news-item';
    [...row.children].forEach((cell) => {
      cell.className = cell.querySelector('picture, img')
        ? 'company-news-image'
        : 'company-news-body';
      card.append(cell);
    });
    labelGenericLink(card);
    list.append(card);
  });

  block.textContent = '';
  block.append(list);
}

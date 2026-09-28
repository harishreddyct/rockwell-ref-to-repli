import { decorateIcons } from '../../scripts/aem.js';

/**
 * teaser-links — a compact teaser variant: an optional heading/intro followed by
 * a list of links. Authored as an optional first row (heading + intro text) and
 * subsequent rows that are each one link.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const list = document.createElement('ul');
  list.className = 'teaser-links-list';
  const intro = document.createElement('div');
  intro.className = 'teaser-links-intro';

  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (link) {
      const li = document.createElement('li');
      const arrow = document.createElement('span');
      arrow.className = 'icon icon-arrow-right';
      li.append(link, arrow);
      list.append(li);
    } else if (row.textContent.trim()) {
      intro.append(...row.children);
    }
  });

  block.textContent = '';
  if (intro.children.length) block.append(intro);
  if (list.children.length) block.append(list);
  decorateIcons(block);
}

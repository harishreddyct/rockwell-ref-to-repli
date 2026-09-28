import { decorateIcons } from '../../scripts/aem.js';

/**
 * product-category-list — a list of product categories, each linking to its
 * catalog section. Each authored row is one category: a link (label), optionally
 * followed by a short description.
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'product-category-list-items';

  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    const cells = [...row.children];
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.className = 'product-category-list-link';
    a.href = link ? link.getAttribute('href') : '#';

    const label = document.createElement('span');
    label.className = 'product-category-list-label';
    label.textContent = (link || cells[0]).textContent.trim();
    a.append(label);

    if (cells[1] && cells[1].textContent.trim()) {
      const desc = document.createElement('span');
      desc.className = 'product-category-list-desc';
      desc.textContent = cells[1].textContent.trim();
      a.append(desc);
    }

    const arrow = document.createElement('span');
    arrow.className = 'icon icon-chevron-right';
    a.append(arrow);

    li.append(a);
    list.append(li);
  });

  block.textContent = '';
  block.append(list);
  decorateIcons(block);
}

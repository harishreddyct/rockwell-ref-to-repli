import { decorateIcons } from '../../scripts/aem.js';

/**
 * quick-links — the home page's shortcut grid: a row of compact link tiles
 * (label + optional short description) pointing to key destinations. Each
 * authored row is one shortcut: a link, optionally followed by a description.
 */
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'quick-links-grid';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const link = row.querySelector('a');
    const tile = document.createElement(link ? 'a' : 'div');
    tile.className = 'quick-links-tile';
    if (link) tile.href = link.getAttribute('href');

    const label = document.createElement('span');
    label.className = 'quick-links-label';
    label.textContent = (link || cells[0]).textContent.trim();
    tile.append(label);

    if (cells[1] && cells[1].textContent.trim()) {
      const desc = document.createElement('span');
      desc.className = 'quick-links-desc';
      desc.textContent = cells[1].textContent.trim();
      tile.append(desc);
    }

    const arrow = document.createElement('span');
    arrow.className = 'icon icon-arrow-right quick-links-arrow';
    tile.append(arrow);

    grid.append(tile);
  });

  block.textContent = '';
  block.append(grid);
  decorateIcons(block);
}

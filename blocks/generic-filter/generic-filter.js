/**
 * generic-filter — a filterable card grid. Each authored row is one item whose
 * first cell is its category label; the remaining cells are the card content
 * (image, title, summary, link). Filter chips are generated from the unique
 * categories, plus an "All" chip, and clicking one shows only matching cards.
 */
export default function decorate(block) {
  const categories = new Set();
  const cards = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const category = cells.shift();
    const cat = category ? category.textContent.trim() : '';
    if (category) category.remove();

    const card = document.createElement('li');
    card.className = 'generic-filter-card';
    if (cat) {
      card.dataset.category = cat;
      categories.add(cat);
      const badge = document.createElement('span');
      badge.className = 'generic-filter-tag';
      badge.textContent = cat;
      card.append(badge);
    }
    cells.forEach((cell) => {
      cell.className = cell.querySelector('picture, img')
        ? 'generic-filter-image'
        : 'generic-filter-body';
      card.append(cell);
    });
    cards.push(card);
  });

  const chips = document.createElement('div');
  chips.className = 'generic-filter-chips';
  chips.setAttribute('aria-label', 'Filter items by category');

  const makeChip = (label, value, active) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'generic-filter-chip';
    btn.textContent = label;
    btn.dataset.filter = value;
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    return btn;
  };

  chips.append(makeChip('All', '*', true));
  [...categories].forEach((c) => chips.append(makeChip(c, c, false)));

  const grid = document.createElement('ul');
  grid.className = 'generic-filter-grid';
  cards.forEach((c) => grid.append(c));

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('.generic-filter-chip');
    if (!btn) return;
    const { filter } = btn.dataset;
    chips.querySelectorAll('.generic-filter-chip').forEach((c) => c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'));
    cards.forEach((card) => {
      const show = filter === '*' || card.dataset.category === filter;
      card.hidden = !show;
    });
  });

  block.textContent = '';
  block.append(chips, grid);
}

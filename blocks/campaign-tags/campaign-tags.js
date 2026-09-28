/**
 * campaign-tags — the home page's filterable campaign card row. Each authored
 * row is one campaign: the first cell is its tag, the rest are the card content
 * (image, title, link). Tag chips filter the visible cards. This is the home
 * page's own styled variant of a tag filter (distinct placement/styling from
 * the page-level generic-filter block).
 */
export default function decorate(block) {
  const tags = new Set();
  const cards = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const tagCell = cells.shift();
    const tag = tagCell ? tagCell.textContent.trim() : '';
    if (tagCell) tagCell.remove();

    const card = document.createElement('article');
    card.className = 'campaign-tags-card';
    if (tag) {
      card.dataset.tag = tag;
      tags.add(tag);
    }
    cells.forEach((cell) => {
      cell.className = cell.querySelector('picture, img')
        ? 'campaign-tags-image'
        : 'campaign-tags-body';
      card.append(cell);
    });
    cards.push(card);
  });

  const chips = document.createElement('div');
  chips.className = 'campaign-tags-chips';

  const makeChip = (label, value, active) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'campaign-tags-chip';
    b.textContent = label;
    b.dataset.filter = value;
    b.setAttribute('aria-pressed', active ? 'true' : 'false');
    return b;
  };

  chips.append(makeChip('All', '*', true));
  [...tags].forEach((t) => chips.append(makeChip(t, t, false)));

  const grid = document.createElement('div');
  grid.className = 'campaign-tags-grid';
  cards.forEach((c) => grid.append(c));

  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('.campaign-tags-chip');
    if (!btn) return;
    chips.querySelectorAll('.campaign-tags-chip').forEach((c) => c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'));
    cards.forEach((card) => {
      card.hidden = !(btn.dataset.filter === '*' || card.dataset.tag === btn.dataset.filter);
    });
  });

  block.textContent = '';
  block.append(chips, grid);
}

/**
 * value-prop-grid — a grid of value propositions / statistics. Each authored row
 * is one item: the first cell is the headline value (a stat or short heading),
 * the remaining cell(s) are the supporting label/description.
 */
export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'value-prop-grid-items';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'value-prop-item';

    const [head, ...rest] = cells;
    if (head) {
      head.classList.add('value-prop-head');
      item.append(head);
    }
    rest.forEach((cell) => {
      cell.classList.add('value-prop-desc');
      item.append(cell);
    });
    grid.append(item);
  });

  block.textContent = '';
  block.append(grid);
}

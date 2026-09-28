/**
 * content-tile — a responsive card grid. Each authored row is one card; a cell
 * containing an image becomes the card media, the remaining cell(s) become the
 * card body (title, summary, link). The whole card is made clickable when it
 * contains a single link.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'content-tile-card';
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        cell.className = 'content-tile-image';
      } else {
        cell.className = 'content-tile-body';
      }
      li.append(cell);
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}

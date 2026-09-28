const GENERIC = /^(learn more|read more|more|view|view more|explore|see more|shop now)$/i;

/**
 * Gives a generic CTA link ("Learn More", "Read More", ...) a descriptive
 * accessible name derived from the card's heading, so it's meaningful out of
 * context without changing the visible label. Shared card behavior.
 */
export function labelGenericLink(scope) {
  const heading = scope.querySelector('h2, h3, h4, h5, h6');
  const link = scope.querySelector('a');
  if (heading && link && GENERIC.test(link.textContent.trim())) {
    link.setAttribute('aria-label', `${link.textContent.trim()}: ${heading.textContent.trim()}`);
  }
}

/**
 * content-tile — a responsive card grid. Each authored row is one card; a cell
 * containing an image becomes the card media, the remaining cell(s) become the
 * card body (title, summary, link).
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
    labelGenericLink(li);
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}

/**
 * columns — the generic multi-column layout block (the reference's
 * `column-control`). Each authored row is a set of side-by-side columns; a
 * column whose only content is an image is flagged so it can be sized to fill.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture, img');
      if (pic) {
        const text = col.textContent.trim();
        if (!text) col.classList.add('columns-img-col');
      }
    });
  });
}

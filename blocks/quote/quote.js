/**
 * quote — a pull quote with optional attribution. Authored as one row: the first
 * cell is the quotation, the second (optional) is the attribution (name / role).
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const [quoteCell, attribCell] = [...row.children];

  const figure = document.createElement('figure');
  const blockquote = document.createElement('blockquote');
  if (quoteCell) blockquote.append(...quoteCell.childNodes);
  figure.append(blockquote);

  if (attribCell && attribCell.textContent.trim()) {
    const caption = document.createElement('figcaption');
    caption.append(...attribCell.childNodes);
    figure.append(caption);
  }

  block.textContent = '';
  block.append(figure);
}

/**
 * badge — a small category/tag label. Authored as a single cell of short text;
 * rendered as an inline pill.
 */
export default function decorate(block) {
  const text = block.textContent.trim();
  block.textContent = '';
  const span = document.createElement('span');
  span.className = 'badge-label';
  span.textContent = text;
  block.append(span);
}

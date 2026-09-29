import { decorateIcons } from '../../scripts/aem.js';

/**
 * Fetches the footer fragment (a DA document at /footer). The document is
 * authored as: a set of heading+list pairs (the link columns), followed by a
 * final section holding the social links and the legal/utility bar.
 */
async function fetchFooter() {
  const resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper;
}

/**
 * Groups each heading and its following list into a .footer-col wrapped in
 * <details><summary> for mobile/tablet accordion behavior (closed by default).
 */
function buildColumns(source) {
  const cols = document.createElement('div');
  cols.className = 'footer-columns';
  const headings = [...source.querySelectorAll('h2, h3, h4')];
  headings.forEach((h) => {
    // capture the heading's following list before re-parenting the heading
    const next = h.nextElementSibling;
    const details = document.createElement('details');
    details.className = 'footer-col';
    // closed by default on mobile/tablet; CSS forces open on desktop

    const summary = document.createElement('summary');
    summary.append(h);
    details.append(summary);

    if (next && (next.tagName === 'UL' || next.tagName === 'OL')) {
      details.append(next);
    }
    cols.append(details);
  });
  return cols.children.length ? cols : null;
}

export default async function decorate(block) {
  const content = await fetchFooter();
  if (!content) return;

  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // first section = columns; remaining = bottom bar(s)
  const [columnsSection, ...rest] = [...content.children];

  const cols = columnsSection ? buildColumns(columnsSection) : null;
  if (cols) footer.append(cols);

  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  rest.forEach((sec) => bottom.append(...sec.children));
  if (bottom.children.length) footer.append(bottom);

  decorateIcons(footer);
  block.append(footer);
}

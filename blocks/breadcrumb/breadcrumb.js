/**
 * breadcrumb — authored as one div-row per crumb (a link, or plain text for the
 * current page), rebuilt here into a semantic <nav><ol> so DA's round-trip
 * preserves the block. The last crumb is marked as the current page.
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const ol = document.createElement('ol');

  rows.forEach((row, i) => {
    const li = document.createElement('li');
    const link = row.querySelector('a');
    const isLast = i === rows.length - 1;
    if (link) link.classList.remove('button', 'primary', 'secondary');
    if (link && !isLast) {
      li.append(link);
    } else {
      const span = document.createElement('span');
      span.textContent = (link || row).textContent.trim();
      span.setAttribute('aria-current', 'page');
      li.append(span);
    }
    ol.append(li);
  });

  nav.append(ol);
  block.textContent = '';
  block.append(nav);
}

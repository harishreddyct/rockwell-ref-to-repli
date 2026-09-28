/**
 * sub-nav — a sticky in-page section navigation bar. Authored as one div-row per
 * link (anchor links into the page, or links to related pages), rebuilt into a
 * horizontal <nav>. Active-link highlighting for on-page anchors is handled with
 * a lightweight IntersectionObserver, with no dependency added.
 */
function setupScrollSpy(links) {
  const targets = links
    .map((a) => {
      const id = a.getAttribute('href');
      return id && id.startsWith('#') ? document.getElementById(id.slice(1)) : null;
    })
    .filter(Boolean);
  if (!targets.length) return;

  const byId = new Map(links.map((a) => [a.getAttribute('href'), a]));
  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e) => {
          links.forEach((a) => a.classList.remove('active'));
          const link = byId.get(`#${e.target.id}`);
          if (link) link.classList.add('active');
        });
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  targets.forEach((t) => observer.observe(t));
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Section navigation');
  const ul = document.createElement('ul');

  const links = [];
  rows.forEach((row) => {
    const a = row.querySelector('a');
    if (!a) return;
    a.classList.remove('button', 'primary', 'secondary');
    const li = document.createElement('li');
    li.append(a);
    ul.append(li);
    links.push(a);
  });

  nav.append(ul);
  block.textContent = '';
  block.append(nav);

  setupScrollSpy(links);
}

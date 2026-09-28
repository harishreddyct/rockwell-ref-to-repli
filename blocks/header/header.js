import { decorateIcons } from '../../scripts/aem.js';

const MQ = window.matchMedia('(min-width: 960px)');

/**
 * Fetches the nav fragment (a DA document at /nav) and returns its decorated
 * content wrapper. The document is authored as three sections in order:
 * 0 = brand (logo link), 1 = primary nav (a list, items may have sub-lists),
 * 2 = utility/tools links.
 */
async function fetchNav() {
  const resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper;
}

function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((el) => {
    el.setAttribute('aria-expanded', 'false');
  });
}

function decorateDropdowns(navSections, nav) {
  navSections.querySelectorAll(':scope > ul > li').forEach((li) => {
    if (li.querySelector('ul')) {
      li.classList.add('nav-drop');
      li.setAttribute('aria-expanded', 'false');
      const label = li.querySelector('a') || li.firstChild;
      const toggle = () => {
        const open = li.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns(nav);
        li.setAttribute('aria-expanded', open ? 'false' : 'true');
      };
      // desktop: click the top-level label toggles its panel
      li.addEventListener('click', (e) => {
        if (!MQ.matches) return;
        if (e.target.closest('ul ul')) return;
        e.preventDefault();
        toggle();
      });
      if (label && label.tagName === 'A' && (!label.getAttribute('href') || label.getAttribute('href') === '#')) {
        label.setAttribute('role', 'button');
      }
    }
  });
}

function setExpanded(nav, hamburger, expanded) {
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  document.body.classList.toggle('nav-open', expanded);
  hamburger.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
}

export default async function decorate(block) {
  const content = await fetchNav();
  if (!content) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const sections = [...content.children];
  const [brand, primary, tools] = sections;

  if (brand) {
    brand.classList.add('nav-brand');
    const link = brand.querySelector('a');
    if (link && !link.querySelector('img, svg, .icon')) {
      const icon = document.createElement('span');
      icon.className = 'icon icon-logo';
      link.prepend(icon);
    }
    nav.append(brand);
  }

  if (primary) {
    primary.classList.add('nav-sections');
    decorateDropdowns(primary, nav);
    nav.append(primary);
  }

  if (tools) {
    tools.classList.add('nav-tools');
    nav.append(tools);
  }

  // hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.type = 'button';
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = '<span class="icon icon-menu"></span><span class="icon icon-close"></span>';
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    setExpanded(nav, hamburger, !expanded);
  });
  nav.prepend(hamburger);
  setExpanded(nav, hamburger, false);

  // reset drawer/dropdown state when crossing the desktop breakpoint
  MQ.addEventListener('change', () => {
    setExpanded(nav, hamburger, false);
    closeAllDropdowns(nav);
  });

  // close open desktop dropdowns on outside click / escape
  document.addEventListener('click', (e) => {
    if (MQ.matches && !nav.contains(e.target)) closeAllDropdowns(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns(nav);
      if (!MQ.matches) setExpanded(nav, hamburger, false);
    }
  });

  decorateIcons(nav);
  block.append(nav);
}

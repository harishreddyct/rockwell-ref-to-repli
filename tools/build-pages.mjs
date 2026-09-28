/*
 * Page + fragment generator.
 *
 * Emits the site's authored content as EDS pre-decoration HTML: full standalone
 * pages (served locally by tools/serve.js, and the exact content to import into
 * DA) plus the /nav.plain.html and /footer.plain.html fragments the header and
 * footer blocks fetch. Content (titles, descriptions, copy) mirrors
 * rockwellautomation.com/en-in; imagery is placeholder SVGs.
 *
 * Output goes to tools/preview/ — a gitignored build directory, so generated
 * page content never lands in the versioned repo root (see AGENTS.md).
 *
 * Run: node tools/build-pages.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'preview');

/* ---------- authoring-HTML helpers ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const p = (t) => `<p>${t}</p>`;
const h = (n, t) => `<h${n}>${t}</h${n}>`;
const a = (href, t) => `<a href="${href}">${esc(t)}</a>`;
const cta = (href, t) => `<p><strong><a href="${href}">${esc(t)}</a></strong></p>`;
const img = (src, alt, w = 960, hh = 540) => `<picture><img src="${src}" alt="${esc(alt)}" width="${w}" height="${hh}" loading="lazy"></picture>`;
const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

/** block(name, rows) where rows = [[cellHtml, cellHtml], ...] */
const block = (name, rows) => `<div class="${name}">${rows
  .map((cells) => `<div>${cells.map((c) => `<div>${c}</div>`).join('')}</div>`)
  .join('')}</div>`;

const sectionMeta = (style) => `<div class="section-metadata"><div><div>style</div><div>${style}</div></div></div>`;
/** section(innerHtml, style?) — a top-level content group in main */
const section = (inner, style) => `<div>${inner}${style ? sectionMeta(style) : ''}</div>`;

/* ---------- shared image paths ---------- */
const I = (name) => `/images/${name}.svg`;

/* ---------- page shell ---------- */
function pageShell({ title, description, image, main }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${esc(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#003e7e">
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${image}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/styles/styles.css" as="style">
  <link rel="stylesheet" href="/styles/styles.css">
  <link rel="stylesheet" href="/styles/fonts.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&display=swap">
  <script src="/scripts/aem.js" type="module"></script>
  <script src="/scripts/scripts.js" type="module"></script>
</head>
<body>
  <header></header>
  <main>${main}</main>
  <footer></footer>
</body>
</html>
`;
}

/* ---------- reusable content pieces ---------- */
const breadcrumb = (crumbs) => block('breadcrumb', crumbs.map((c) => [c.href ? a(c.href, c.label) : esc(c.label)]));

const heroBanner = (title, subtitle, image, ctaHref, ctaLabel) => block('hero-banner', [[
  img(image, title),
  `${h(1, esc(title))}${p(subtitle)}${ctaHref ? cta(ctaHref, ctaLabel) : ''}`,
]]);

const contentTiles = (tiles) => block('content-tile', tiles.map((t) => [
  img(t.image, t.title, 640, 420),
  `${h(3, esc(t.title))}${p(t.text)}${a(t.href || '#', t.link || 'Learn More')}`,
]));

/* ---------- NAV fragment ---------- */
function navFragment() {
  const brand = `<div>${a('/', 'Automation')}</div>`;
  const primary = `<div>${ul([
    `${a('/products', 'Products')}${ul([
      a('/products', 'All Products'),
      a('/products/hardware', 'Hardware'),
      a('/products/software/factorytalk', 'FactoryTalk Software'),
    ])}`,
    `${a('/capabilities', 'Capabilities')}${ul([
      a('/capabilities', 'All Capabilities'),
      a('/capabilities/smart-manufacturing', 'Smart Manufacturing'),
    ])}`,
    `${a('/industries', 'Industries')}${ul([
      a('/industries', 'All Industries'),
      a('/industries/food-beverage', 'Food & Beverage'),
    ])}`,
    `${a('/support', 'Support')}`,
    `${a('/company/about-us', 'Company')}${ul([
      a('/company/about-us', 'About Us'),
      a('/company/news', 'Newsroom'),
      a('/careers', 'Careers'),
      a('/sustainability', 'Sustainability'),
    ])}`,
  ])}</div>`;
  const tools = `<div>${ul([
    a('/careers', 'Careers'),
    a('#', 'Investors'),
    a('#', 'PartnerNetwork Portal'),
    a('#', 'Contact Us'),
  ])}</div>`;
  return `${brand}${primary}${tools}\n`;
}

/* ---------- FOOTER fragment ---------- */
function footerFragment() {
  const columns = [
    ['Company', [a('/company/about-us', 'About Us'), a('/careers', 'Careers'), a('#', 'Culture'), a('#', 'Investor Relations'), a('/sustainability', 'Sustainability'), a('#', 'Trust Center')]],
    ['News & Events', [a('/company/news', 'Newsroom'), a('#', 'Press Releases'), a('/events', 'Automation Fair'), a('/events', 'Upcoming Events')]],
    ['Trending Topics', [a('#', 'Future Trends in Industrial Operations'), a('#', 'Industrial AI'), a('#', 'Software-defined Automation')]],
    ['Training', [a('/events', 'Webinars'), a('#', 'Workforce Development Training')]],
    ['PartnerNetwork', [a('#', 'Find a Partner'), a('#', 'What is the PartnerNetwork?')]],
    ['Our Brands', [a('#', 'Allen-Bradley'), a('/products/software/factorytalk', 'FactoryTalk'), a('#', 'LifecycleIQ Services')]],
    ['Contact Us', [a('/support', 'TechConnect Support'), a('#', 'Customer Care'), a('#', 'General Inquiries'), a('#', 'How to Buy')]],
    ['Insights', [a('#', 'Automation Today'), a('/company/news', 'Blogs'), a('/company/news', 'Case Studies'), a('#', 'Podcasts'), a('#', 'Analyst Research')]],
  ];
  const colHtml = columns.map(([title, links]) => `${h(3, title)}${ul(links)}`).join('');
  // each icon is decorative (decorateIcons renders it with alt=""), so the link
  // carries the accessible name
  const social = `<p>${[['linkedin', 'LinkedIn'], ['facebook', 'Facebook'], ['x', 'X'], ['youtube', 'YouTube'], ['instagram', 'Instagram']]
    .map(([s, name]) => `<a href="#" aria-label="${name}"><span class="icon icon-${s}"></span></a>`).join(' ')}</p>`;
  const legal = ul([
    a('#', 'IN | EN'),
    a('#', 'Legal Notices'),
    a('#', 'Privacy & Cookies Policy'),
    a('#', 'Email Preferences'),
    a('#', 'Accessibility'),
  ]);
  const copyright = p('© 2026 Site replication for demonstration. Not affiliated with Rockwell Automation. Logos and imagery are placeholders.');
  return `<div>${colHtml}</div><div>${social}${legal}${copyright}</div>\n`;
}

/* ---------- PAGES ---------- */
const pages = [];
const add = (route, def) => pages.push({ route, ...def });

/* HOME */
add('/', {
  title: 'Smart Manufacturing Industrial Automation | Rockwell Automation | IN',
  description: 'We connect the imaginations of people with the potential of technology to expand what is humanly possible, making the world more productive and sustainable.',
  image: I('hero-home'),
  main: [
    section(block('animated-header', [[
      img(I('hero-home'), 'Industrial AI', 960, 600),
      `${h(1, 'Industrial AI Designed for Optimizing Operations')}${p('Connect the imaginations of people with the potential of technology to make the world more productive and more sustainable.')}${cta('/capabilities/smart-manufacturing', 'Explore Smart Manufacturing')}`,
    ]])),
    section(`${h(2, 'Quick Links')}${block('quick-links', [
      [a('/products', 'Products'), 'Hardware, software and services'],
      [a('/capabilities', 'Capabilities'), 'Solutions for your operations'],
      [a('/industries', 'Industries'), 'Expertise for your sector'],
      [a('/support', 'Support'), 'Documentation, downloads and tools'],
    ])}`),
    section(`${h(2, 'Explore by Campaign')}${block('campaign-tags', [
      ['AI', img(I('card-1'), 'Industrial AI', 640, 420), `${h(3, 'Industrial AI')}${a('/capabilities/smart-manufacturing', 'Learn More')}`],
      ['Sustainability', img(I('card-2'), 'Sustainability', 640, 420), `${h(3, 'Sustainable Operations')}${a('/sustainability', 'Learn More')}`],
      ['Digital', img(I('card-3'), 'Digital Transformation', 640, 420), `${h(3, 'Digital Transformation')}${a('/capabilities', 'Learn More')}`],
      ['Software', img(I('card-4'), 'FactoryTalk', 640, 420), `${h(3, 'FactoryTalk Software')}${a('/products/software/factorytalk', 'Learn More')}`],
      ['Hardware', img(I('card-5'), 'Hardware', 640, 420), `${h(3, 'What\u2019s New in Hardware')}${a('/products/hardware', 'Learn More')}`],
      ['Industry', img(I('card-6'), 'Food & Beverage', 640, 420), `${h(3, 'Food & Beverage')}${a('/industries/food-beverage', 'Learn More')}`],
    ])}`, 'bg-light-gray'),
    section(block('product-experience', [[
      img(I('teaser-1'), 'Connected Enterprise', 720, 480),
      `${h(2, 'Elevate Your Operations')}${p('Bring together control, information and intelligence across your enterprise to boost productivity, resilience and sustainability.')}${cta('/capabilities', 'Explore Capabilities')}`,
    ]])),
    section(`${h(2, 'Company News')}${block('company-news', [
      [img(I('card-1'), 'News', 640, 420), `${h(3, 'How AI is Transforming Manufacturing')}${p('AI has moved from pilots to production.')}${a('/company/news/blogs/ai-transform-manufacturing', 'Read More')}`],
      [img(I('card-6'), 'Case study', 640, 420), `${h(3, 'Cornish Lithium Drives Sustainability')}${p('PlantPAx helps prove a novel processing approach.')}${a('/company/news/case-studies/cornish-lithium-plant', 'Read More')}`],
      [img(I('card-3'), 'Event', 640, 420), `${h(3, 'Automation Fair')}${p('Join us at our flagship event.')}${a('/events', 'Read More')}`],
      [img(I('card-2'), 'Newsroom', 640, 420), `${h(3, 'Visit the Newsroom')}${p('News, opinion and customer perspectives.')}${a('/company/news', 'Read More')}`],
    ])}`),
    section(block('teaser', [[
      img(I('teaser-2'), 'Subscribe', 720, 480),
      `${h(2, 'Stay Ahead of What\u2019s Next')}${p('Subscribe for the latest industrial automation trends, insights and product news delivered to your inbox.')}${cta('#', 'Subscribe Now')}`,
    ]]), 'bg-light-gray'),
    section(`${h(2, 'Our Brands')}${block('logo-links', [
      [img(I('logo-strip'), 'Allen-Bradley', 200, 80)],
      [img(I('logo-strip'), 'FactoryTalk', 200, 80)],
      [img(I('logo-strip'), 'LifecycleIQ', 200, 80)],
      [img(I('logo-strip'), 'PlantPAx', 200, 80)],
      [img(I('logo-strip'), 'Kalypso', 200, 80)],
      [img(I('logo-strip'), 'Plex', 200, 80)],
    ])}`),
  ].join(''),
});

/* PRODUCTS LANDING */
add('/products', {
  title: 'Product Offerings | Rockwell Automation | IN',
  description: 'Explore Rockwell Automation products spanning hardware, software, and services designed to power connected, intelligent industrial operations.',
  image: I('hero-products'),
  main: [
    section(heroBanner('All Products', 'Explore products spanning hardware, software, and services designed to power connected, intelligent industrial operations.', I('hero-products'), '/products/hardware', 'Browse Hardware')),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Products' }])),
    section(block('sub-nav', [
      [a('#overview', 'Overview')], [a('#hardware', 'Hardware')], [a('#software', 'Software')], [a('#services', 'Services')],
    ])),
    section(`${h(2, 'Product Categories')}${contentTiles([
      { image: I('card-2'), title: 'Hardware', text: 'Control, safety, motion, power and sensing products.', href: '/products/hardware', link: 'Explore Hardware' },
      { image: I('card-4'), title: 'Software', text: 'FactoryTalk software for advanced industrial applications.', href: '/products/software/factorytalk', link: 'Explore Software' },
      { image: I('card-5'), title: 'Services', text: 'Lifecycle services to keep operations running.', href: '/capabilities/lifecycle-services', link: 'Explore Services' },
    ])}`),
    section(block('teaser', [[
      img(I('teaser-1'), 'Configure', 720, 480),
      `${h(2, 'Find the Right Product')}${p('Use our selection and configuration tools to find, size and specify the products for your application.')}${cta('#', 'Open Product Catalog')}`,
    ]]), 'bg-light-gray'),
  ].join(''),
});

/* HARDWARE */
add('/products/hardware', {
  title: 'Hardware Catalog | Rockwell Automation | IN',
  description: 'Discover industrial automation hardware solutions including control, safety, motion, and power products built for reliability and performance.',
  image: I('hero-hardware'),
  main: [
    section(heroBanner('Hardware Catalog', 'Industrial automation hardware including control, safety, motion, and power products built for reliability and performance.', I('hero-hardware'))),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Hardware' }])),
    section(`${h(2, 'Browse Categories')}${block('product-category-list', [
      [a('#', 'Programmable Controllers'), 'PLCs and PACs for every application'],
      [a('#', 'Motor Control'), 'Drives, motors and motor control'],
      [a('#', 'Safety Products'), 'Machine and process safety'],
      [a('#', 'Sensors & Switches'), 'Sensing and connectivity'],
      [a('#', 'Power Supplies'), 'Reliable industrial power'],
      [a('#', 'Signaling & Visualization'), 'Operator interface and signaling'],
    ])}`),
    section(`${h(2, 'Featured Products')}${block('product-featured-grid', [
      [img(I('product-1'), 'Controller', 480, 480), `${h(3, 'ControlLogix Controllers')}${p('High-performance control for demanding applications.')}${a('#', 'View Product')}`],
      [img(I('product-2'), 'Drive', 480, 480), `${h(3, 'PowerFlex Drives')}${p('AC drives for precise motor control.')}${a('#', 'View Product')}`],
      [img(I('product-3'), 'Sensor', 480, 480), `${h(3, 'Industrial Sensors')}${p('Reliable detection and measurement.')}${a('#', 'View Product')}`],
      [img(I('product-4'), 'Safety', 480, 480), `${h(3, 'Safety Relays')}${p('Protect people and machines.')}${a('#', 'View Product')}`],
    ])}`, 'bg-light-gray'),
    section(`${h(2, 'Recommended for You')}${block('product-recommendations', [
      [img(I('product-1'), 'Product', 480, 480), 'CompactLogix 5380'],
      [img(I('product-2'), 'Product', 480, 480), 'PowerFlex 755'],
      [img(I('product-3'), 'Product', 480, 480), 'Guardmaster Relay'],
      [img(I('product-4'), 'Product', 480, 480), 'Kinetix Servo Drive'],
      [img(I('product-1'), 'Product', 480, 480), 'Micro850 Controller'],
    ])}`),
  ].join(''),
});

/* FACTORYTALK */
add('/products/software/factorytalk', {
  title: 'FactoryTalk Industrial Automation Software | FactoryTalk | IN',
  description: 'FactoryTalk software is built for supporting an ecosystem of advanced industrial applications, including IoT.',
  image: I('hero-factorytalk'),
  main: [
    section(heroBanner('FactoryTalk Software', 'Built to support an ecosystem of advanced industrial applications, including IoT, analytics, and design.', I('hero-factorytalk'), '#portfolio', 'Explore the Portfolio')),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Software' }, { label: 'FactoryTalk' }])),
    section(block('sub-nav', [
      [a('#overview', 'Overview')], [a('#portfolio', 'Portfolio')], [a('#design', 'Design')], [a('#operations', 'Operations')],
    ])),
    section(block('product-experience', [[
      img(I('teaser-1'), 'FactoryTalk', 720, 480),
      `${h(2, 'One Software Ecosystem')}${p('FactoryTalk connects design, operations and maintenance so your teams can build, run and optimize a Connected Enterprise.')}${cta('#', 'Get Started')}`,
    ]])),
    section(`${h(2, 'Explore FactoryTalk', 'portfolio')}${block('carousel', [
      [`${img(I('card-1'), 'Design', 640, 420)}${h(3, 'FactoryTalk Design')}${p('Cloud-based industrial design.')}`],
      [`${img(I('card-2'), 'Operations', 640, 420)}${h(3, 'FactoryTalk Operations')}${p('Visualize and control production.')}`],
      [`${img(I('card-3'), 'Analytics', 640, 420)}${h(3, 'FactoryTalk Analytics')}${p('Turn data into decisions.')}`],
      [`${img(I('card-4'), 'Maintenance', 640, 420)}${h(3, 'FactoryTalk Maintenance')}${p('Maximize asset availability.')}`],
    ])}`, 'bg-light-gray'),
    section(block('teaser-links', [
      [`${h(3, 'FactoryTalk Resources')}${p('Documentation, downloads and support for FactoryTalk software.')}`],
      [a('/support', 'Product Documentation')],
      [a('/support', 'Software Downloads')],
      [a('/support', 'Release Notes')],
    ])),
  ].join(''),
});

/* CAPABILITIES LANDING */
add('/capabilities', {
  title: 'Capabilities | Rockwell Automation | IN',
  description: 'Proven, repeatable, scalable capabilities designed to meet your unique operational needs.',
  image: I('hero-capabilities'),
  main: [
    section(heroBanner('Capabilities', 'Proven, repeatable, scalable capabilities designed to meet your unique operational needs.', I('hero-capabilities'))),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Capabilities' }])),
    section(`${h(2, 'What We Do')}${contentTiles([
      { image: I('card-1'), title: 'Smart Manufacturing', text: 'Enhance productivity, efficiency and innovation.', href: '/capabilities/smart-manufacturing', link: 'Learn More' },
      { image: I('card-2'), title: 'Digital Transformation', text: 'Modernize operations end to end.', href: '#', link: 'Learn More' },
      { image: I('card-3'), title: 'Lifecycle Services', text: 'Keep operations running at their best.', href: '#', link: 'Learn More' },
      { image: I('card-4'), title: 'Industrial Cybersecurity', text: 'Protect connected operations.', href: '#', link: 'Learn More' },
      { image: I('card-5'), title: 'Connected Enterprise', text: 'Unite people, processes and technology.', href: '#', link: 'Learn More' },
      { image: I('card-6'), title: 'Consulting & Integration', text: 'Expertise from strategy to execution.', href: '#', link: 'Learn More' },
    ])}`),
    section(block('product-experience', [[
      img(I('teaser-2'), 'Consulting', 720, 480),
      `${h(2, 'Partner With Our Experts')}${p('From strategy through execution, our teams help you design, build and operate a more productive and resilient operation.')}${cta('#', 'Talk to an Expert')}`,
    ]]), 'bg-light-gray'),
  ].join(''),
});

/* SMART MANUFACTURING */
add('/capabilities/smart-manufacturing', {
  title: 'Smart Manufacturing | Rockwell Automation | IN',
  description: "Discover Rockwell Automation's smart manufacturing solutions to enhance productivity, efficiency, and innovation in your operations.",
  image: I('hero-smart-manufacturing'),
  main: [
    section(heroBanner('Smart Manufacturing', 'Enhance productivity, efficiency, and innovation in your operations and transform your business today.', I('hero-smart-manufacturing'), '#solutions', 'Explore Solutions')),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Capabilities', href: '/capabilities' }, { label: 'Smart Manufacturing' }])),
    section(block('sub-nav', [
      [a('#overview', 'Overview')], [a('#solutions', 'Solutions')], [a('#outcomes', 'Outcomes')], [a('#resources', 'Resources')],
    ])),
    section(block('product-experience', [[
      img(I('teaser-1'), 'Smart manufacturing', 720, 480),
      `${h(2, 'From Data to Decisions', 'overview')}${p('Smart manufacturing connects your operations to turn real-time data into faster, better decisions across the plant and the enterprise.')}${cta('#', 'Read the Guide')}`,
    ]])),
    section(`${h(2, 'Solutions', 'solutions')}${block('generic-filter', [
      ['Production', img(I('card-1'), 'Production', 640, 420), `${h(3, 'Production Management')}${p('Orchestrate production in real time.')}`],
      ['Quality', img(I('card-2'), 'Quality', 640, 420), `${h(3, 'Quality & Compliance')}${p('Build quality into every step.')}`],
      ['Analytics', img(I('card-3'), 'Analytics', 640, 420), `${h(3, 'Industrial Analytics')}${p('Insight across your operations.')}`],
      ['Production', img(I('card-4'), 'Logistics', 640, 420), `${h(3, 'Production Logistics')}${p('Autonomous material movement.')}`],
      ['Quality', img(I('card-5'), 'Traceability', 640, 420), `${h(3, 'Traceability')}${p('Track and trace end to end.')}`],
      ['Analytics', img(I('card-6'), 'AI', 640, 420), `${h(3, 'Industrial AI')}${p('AI designed for operations.')}`],
    ])}`, 'bg-light-gray'),
    section(block('teaser', [[
      img(I('teaser-2'), 'Outcomes', 720, 480),
      `${h(2, 'Deliver Measurable Outcomes', 'outcomes')}${p('Improve throughput, reduce downtime and accelerate time to market with connected, data-driven operations.')}${cta('/company/news/case-studies/cornish-lithium-plant', 'See a Case Study')}`,
    ]])),
  ].join(''),
});

/* INDUSTRIES LANDING */
add('/industries', {
  title: 'Industries We Serve | Rockwell Automation | IN',
  description: 'Proven, repeatable, scalable solutions designed to meet your unique needs.',
  image: I('hero-industries'),
  main: [
    section(heroBanner('Industries', 'Proven, repeatable, scalable solutions designed to meet your unique needs.', I('hero-industries'))),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Industries' }])),
    section(`${h(2, 'Industries We Serve')}${contentTiles([
      { image: I('card-1'), title: 'Food & Beverage', text: 'Smart automation for food and beverage.', href: '/industries/food-beverage', link: 'Learn More' },
      { image: I('card-2'), title: 'Life Sciences', text: 'Compliant, connected manufacturing.', href: '#', link: 'Learn More' },
      { image: I('card-3'), title: 'Automotive & Tire', text: 'Flexible, high-volume production.', href: '#', link: 'Learn More' },
      { image: I('card-4'), title: 'Oil & Gas', text: 'Safe, efficient operations.', href: '#', link: 'Learn More' },
      { image: I('card-5'), title: 'Mining', text: 'Productive, sustainable mining.', href: '#', link: 'Learn More' },
      { image: I('card-6'), title: 'Chemical', text: 'Reliable process control.', href: '#', link: 'Learn More' },
    ])}`),
    section(block('product-experience', [[
      img(I('teaser-1'), 'Industry expertise', 720, 480),
      `${h(2, 'Industry Expertise That Scales')}${p('Repeatable, scalable solutions built on deep domain expertise help you meet the unique demands of your industry.')}${cta('#', 'Find Your Industry')}`,
    ]]), 'bg-light-gray'),
  ].join(''),
});

/* FOOD & BEVERAGE */
add('/industries/food-beverage', {
  title: 'Food & Beverage Automation Solutions | Rockwell Automation | IN',
  description: 'Enhance your food and beverage manufacturing with smart automation, real-time data, connected machines, and modernization solutions.',
  image: I('hero-food-beverage'),
  main: [
    section(heroBanner('Food and Beverage Automation', 'Smart automation, real-time data, connected machines, and modernization solutions for food and beverage manufacturing.', I('hero-food-beverage'), '#solutions', 'Explore Solutions')),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Industries', href: '/industries' }, { label: 'Food & Beverage' }])),
    section(block('sub-nav', [
      [a('#overview', 'Overview')], [a('#solutions', 'Solutions')], [a('#results', 'Results')], [a('#faq', 'FAQ')],
    ])),
    section(block('product-experience', [[
      img(I('teaser-1'), 'Food and beverage', 720, 480),
      `${h(2, 'Modernize Your Operations', 'overview')}${p('Increase throughput, improve quality and meet sustainability goals with connected, data-driven food and beverage manufacturing.')}${cta('#', 'Read More')}`,
    ]])),
    section(`${h(2, 'Solutions', 'solutions')}${block('carousel', [
      [`${img(I('card-1'), 'Packaging', 640, 420)}${h(3, 'Packaging')}${p('Flexible, efficient packaging lines.')}`],
      [`${img(I('card-2'), 'Processing', 640, 420)}${h(3, 'Processing')}${p('Consistent, high-quality processing.')}`],
      [`${img(I('card-3'), 'OEE', 640, 420)}${h(3, 'OEE & Analytics')}${p('Improve overall equipment effectiveness.')}`],
      [`${img(I('card-4'), 'Sustainability', 640, 420)}${h(3, 'Sustainability')}${p('Reduce energy and waste.')}`],
    ])}`, 'bg-light-gray'),
    section(`${h(2, 'Proven Results', 'results')}${block('value-prop-grid', [
      ['30%', 'reduction in unplanned downtime'],
      ['20%', 'improvement in throughput'],
      ['15%', 'lower energy consumption'],
      ['99%', 'quality compliance'],
    ])}`),
    section(block('quote', [[
      '<p>Connected operations gave us the visibility to act in real time and hit our production and sustainability targets.</p>',
      '<p><strong>Operations Director</strong><br>Global Food & Beverage Manufacturer</p>',
    ]])),
    section(`${h(2, 'Watch the Overview')}${block('video', [[
      img(I('video-poster'), 'Watch the overview', 960, 540),
      a('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Play video'),
    ]])}`),
    section(`${h(2, 'Frequently Asked Questions', 'faq')}${block('accordion', [
      ['<p>How do I get started with smart automation?</p>', '<p>Begin with an assessment of your current operations, then prioritize high-impact use cases and scale from there.</p>'],
      ['<p>Can I modernize without replacing everything?</p>', '<p>Yes. Modernization can be phased, connecting existing equipment while introducing new capabilities incrementally.</p>'],
      ['<p>How does this support sustainability goals?</p>', '<p>Real-time data helps reduce energy use, minimize waste and improve resource efficiency across the plant.</p>'],
    ])}`, 'bg-light-gray'),
  ].join(''),
});

/* ABOUT US */
add('/company/about-us', {
  title: 'About Us | Rockwell Automation | IN',
  description: 'When you invest in Rockwell Automation technology and solutions, you invest in the future of manufacturing.',
  image: I('hero-about'),
  main: [
    section(heroBanner('About Us', 'When you invest in our technology and solutions, you invest in the future of manufacturing.', I('hero-about'))),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Company' }, { label: 'About Us' }])),
    section(block('sub-nav', [
      [a('#who-we-are', 'Who We Are')], [a('#purpose', 'Our Purpose')], [a('#values', 'Values')], [a('#careers', 'Careers')],
    ])),
    section(`${h(2, 'Who We Are', 'who-we-are')}${p('We are the largest company in the world dedicated to industrial automation and digital transformation. We connect the imaginations of people with the potential of technology to make the world more productive and more sustainable.')}`),
    section(block('teaser', [[
      img(I('teaser-1'), 'Our purpose', 720, 480),
      `${h(2, 'Our Purpose', 'purpose')}${p('We expand what is humanly possible by helping our customers do more — produce more, protect the environment and make the world more secure.')}${cta('/careers', 'Join Our Team')}`,
    ]]), 'bg-light-gray'),
  ].join(''),
});

/* NEWSROOM */
add('/company/news', {
  title: 'Latest News | Rockwell Automation | IN',
  description: 'Explore the many sources of news, expert opinion and customer perspectives from the largest company dedicated to industrial automation.',
  image: I('hero-news'),
  main: [
    section(heroBanner('Newsroom', 'News, expert opinion and customer perspectives from across industrial automation.', I('hero-news'))),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Company' }, { label: 'Newsroom' }])),
    section(block('sub-nav', [
      [a('#blogs', 'Blogs')], [a('#case-studies', 'Case Studies')], [a('#press', 'Press Releases')], [a('#podcasts', 'Podcasts')],
    ])),
    section(`${h(2, 'Latest Blogs', 'blogs')}${contentTiles([
      { image: I('card-1'), title: 'How AI is Transforming Manufacturing', text: 'AI has moved from pilots to production.', href: '/company/news/blogs/ai-transform-manufacturing', link: 'Read More' },
      { image: I('card-2'), title: 'Tackling Cyber Threats', text: 'Secure your connected operations.', href: '#', link: 'Read More' },
      { image: I('card-3'), title: 'The Value of Sustainability', text: 'Turn sustainability into advantage.', href: '#', link: 'Read More' },
    ])}`),
    section(`${h(2, 'Case Studies', 'case-studies')}${contentTiles([
      { image: I('card-6'), title: 'Cornish Lithium Drives Sustainability', text: 'PlantPAx enables a novel processing approach.', href: '/company/news/case-studies/cornish-lithium-plant', link: 'Read More' },
      { image: I('card-4'), title: 'Safety System Upgrade', text: 'Modernizing safety at scale.', href: '#', link: 'Read More' },
      { image: I('card-5'), title: 'Refrigeration Energy AI', text: 'AI-driven energy savings.', href: '#', link: 'Read More' },
    ])}`, 'bg-light-gray'),
    section(`${h(2, 'By the Numbers')}${block('value-prop-grid', [
      ['29K+', 'employees worldwide'],
      ['100+', 'countries served'],
      ['$8B+', 'annual revenue'],
      ['1903', 'founded'],
    ])}`),
  ].join(''),
});

/* ARTICLE */
add('/company/news/blogs/ai-transform-manufacturing', {
  title: 'How AI is Transforming Manufacturing | Rockwell Automation | IN',
  description: "AI has moved from pilots to production. Here's what manufacturing leaders need to know to scale intelligence, resilience, and execution.",
  image: I('hero-article'),
  main: [
    section(heroBanner('How AI is Transforming Manufacturing', 'AI has moved from pilots to production. Here is what leaders need to know to scale intelligence, resilience, and execution.', I('hero-article'))),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Newsroom', href: '/company/news' }, { label: 'Blogs' }, { label: 'How AI is Transforming Manufacturing' }])),
    section(`${block('badge', [['Blog']])}${block('author-details', [[
      img(I('portrait-1'), 'Author', 240, 240),
      '<p><strong>By Rockwell Automation Editorial</strong></p><p>Published September 2026 · 6 min read</p>',
    ]])}`),
    section(`${p('Artificial intelligence has moved from proof-of-concept pilots into everyday production. For manufacturers, the question is no longer whether to adopt AI, but how to scale it responsibly across operations.')}${h(2, 'From Pilots to Production')}${p('Successful programs start small, prove value quickly and then scale the use cases that deliver measurable outcomes — from predictive maintenance to quality optimization and autonomous material movement.')}${h(2, 'Building Resilience')}${p('AI helps operations anticipate disruption, adapt in real time and keep production running. Combined with connected data, it turns reactive maintenance into proactive resilience.')}${h(2, 'Executing at Scale')}${p('Scaling intelligence requires a foundation of connected assets, trusted data and the right expertise. That is where a Connected Enterprise strategy pays off.')}`, 'narrow'),
    section(`${h(2, 'Related Reading')}${contentTiles([
      { image: I('card-2'), title: 'Industrial AI', text: 'AI designed for optimizing operations.', href: '/capabilities/smart-manufacturing', link: 'Learn More' },
      { image: I('card-6'), title: 'Cornish Lithium Case Study', text: 'AI and control in action.', href: '/company/news/case-studies/cornish-lithium-plant', link: 'Read More' },
      { image: I('card-3'), title: 'Smart Manufacturing', text: 'Turn data into decisions.', href: '/capabilities/smart-manufacturing', link: 'Learn More' },
    ])}`, 'bg-light-gray'),
  ].join(''),
});

/* CASE STUDY */
add('/company/news/case-studies/cornish-lithium-plant', {
  title: 'Cornish Lithium Drives Sustainability at UK Plant | Rockwell Automation | IN',
  description: 'PlantPAx distributed control system helps mineral company prove novel mica processing approach can extract battery metal from Cornish granite rock.',
  image: I('hero-casestudy'),
  main: [
    section(heroBanner('Cornish Lithium Drives Sustainability at UK Plant', 'PlantPAx helps a mineral company prove a novel mica processing approach can extract battery metal from Cornish granite.', I('hero-casestudy'))),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Newsroom', href: '/company/news' }, { label: 'Case Studies' }, { label: 'Cornish Lithium' }])),
    section(`${block('badge', [['Case Study']])}${block('author-details', [[
      img(I('portrait-2'), 'Author', 240, 240),
      '<p><strong>Industry: Mining & Metals</strong></p><p>Published August 2026 · 4 min read</p>',
    ]])}`),
    section(`${h(2, 'The Challenge')}${p('Cornish Lithium set out to prove that lithium could be sustainably extracted from mica in Cornish granite — a novel approach requiring precise, reliable process control.')}${h(2, 'The Solution')}${p('A PlantPAx distributed control system provided the visibility and control needed to run the demonstration plant reliably and gather the data to validate the process.')}${h(2, 'The Results')}${p('The project demonstrated a repeatable, sustainable processing approach and laid the foundation for scaling battery-metal production in the UK.')}`, 'narrow'),
    section(block('quote', [[
      '<p>The control system gave us the confidence and the data to prove our process works at scale.</p>',
      '<p><strong>Process Lead</strong><br>Cornish Lithium</p>',
    ]]), 'bg-light-gray'),
    section(`${h(2, 'Explore More')}${contentTiles([
      { image: I('card-1'), title: 'PlantPAx DCS', text: 'The modern distributed control system.', href: '#', link: 'Learn More' },
      { image: I('card-5'), title: 'Sustainability', text: 'Enabling sustainable operations.', href: '/sustainability', link: 'Learn More' },
    ])}`),
  ].join(''),
});

/* SUPPORT */
add('/support', {
  title: 'Support | Rockwell Automation | IN',
  description: 'Visit the support center to find product documentation, software downloads, tools, resources, training and more.',
  image: I('hero-support'),
  main: [
    section(heroBanner('Support Center', 'Find product documentation, software downloads, tools, resources, training and more.', I('hero-support'), '#resources', 'Browse Resources')),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Support' }])),
    section(`${h(2, 'How Can We Help?', 'resources')}${contentTiles([
      { image: I('card-1'), title: 'Documentation', text: 'Manuals, guides and literature.', href: '#', link: 'Open Library' },
      { image: I('card-2'), title: 'Downloads', text: 'Software, firmware and drivers.', href: '#', link: 'Get Downloads' },
      { image: I('card-3'), title: 'Knowledgebase', text: 'Answers and technical notes.', href: '#', link: 'Search Now' },
    ])}`),
    section(block('teaser-links', [
      [`${h(3, 'Popular Tools')}${p('Quick access to the tools customers use most.')}`],
      [a('#', 'Compatibility & Downloads (PCDC)')],
      [a('#', 'Product Lifecycle Status')],
      [a('#', 'Learning+ Training Portal')],
      [a('#', 'Product Registration')],
    ]), 'bg-light-gray'),
  ].join(''),
});

/* EVENTS */
add('/events', {
  title: 'Events | Rockwell Automation | IN',
  description: 'Take advantage of upcoming events to learn more about how you can use technology as a competitive advantage.',
  image: I('hero-events'),
  main: [
    section(heroBanner('Events', 'Learn how you can use technology as a competitive advantage at our upcoming events.', I('hero-events'))),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Events' }])),
    section(`${h(2, 'Upcoming Events')}${block('generic-filter', [
      ['Conference', img(I('card-1'), 'Automation Fair', 640, 420), `${h(3, 'Automation Fair')}${p('Our flagship annual event.')}`],
      ['Webinar', img(I('card-2'), 'Webinar', 640, 420), `${h(3, 'Smart Manufacturing Webinar')}${p('On-demand and live sessions.')}`],
      ['Conference', img(I('card-3'), 'PNC India', 640, 420), `${h(3, 'PartnerNetwork Conference')}${p('Connect with the ecosystem.')}`],
      ['Summit', img(I('card-4'), 'Summit', 640, 420), `${h(3, 'India Inc on the Move')}${p('Industry leadership summit.')}`],
      ['Webinar', img(I('card-5'), 'Webinar', 640, 420), `${h(3, 'Industrial AI Webinar')}${p('AI for operations.')}`],
      ['Summit', img(I('card-6'), 'FMCG Summit', 640, 420), `${h(3, 'FMCG Summit')}${p('Consumer goods focus.')}`],
    ])}`),
    section(block('teaser', [[
      img(I('teaser-2'), 'On demand', 720, 480),
      `${h(2, 'Missed an Event?')}${p('Catch up on demand with recordings of our most popular sessions and keynotes.')}${cta('#', 'Watch On Demand')}`,
    ]]), 'bg-light-gray'),
  ].join(''),
});

/* CAREERS */
add('/careers', {
  title: 'Careers | Rockwell Automation | IN',
  description: "At Rockwell Automation, you'll have the opportunity to make an impact and push things beyond what most think is possible.",
  image: I('hero-careers'),
  main: [
    section(heroBanner('Careers', 'Make an impact and push things beyond what most think is possible.', I('hero-careers'), '#roles', 'Explore Roles')),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Careers' }])),
    section(block('sub-nav', [
      [a('#life', 'Life Here')], [a('#roles', 'Roles')], [a('#programs', 'Programs')], [a('#culture', 'Culture')],
    ])),
    section(`${h(2, 'Life at Rockwell Automation', 'life')}${p('Join a team dedicated to expanding what is humanly possible. We offer meaningful work, growth and the chance to shape the future of manufacturing.')}`),
    section(`${h(2, 'Explore Opportunities', 'roles')}${contentTiles([
      { image: I('card-1'), title: 'Engineering', text: 'Build the technology behind smart operations.', href: '#', link: 'View Roles' },
      { image: I('card-2'), title: 'Early Career', text: 'Programs for students and graduates.', href: '#', link: 'View Roles' },
      { image: I('card-3'), title: 'Sales & Services', text: 'Help customers succeed.', href: '#', link: 'View Roles' },
    ])}`, 'bg-light-gray'),
    section(block('teaser', [[
      img(I('teaser-1'), 'Grow with us', 720, 480),
      `${h(2, 'Grow With Us', 'programs')}${p('From leadership development to early-career programs, we invest in helping you build a rewarding career.')}${cta('#', 'Search Jobs')}`,
    ]])),
  ].join(''),
});

/* SUSTAINABILITY */
add('/sustainability', {
  title: 'Sustainability | Rockwell Automation | IN',
  description: 'Creating the future of industrial automation. Enabling sustainability across the value chain through innovative automation and digital solutions.',
  image: I('hero-sustainability'),
  main: [
    section(heroBanner('Sustainability', 'Enabling sustainability across the value chain through innovative industrial automation and digital solutions.', I('hero-sustainability'), '#focus', 'Our Approach')),
    section(breadcrumb([{ label: 'Home', href: '/' }, { label: 'Sustainability' }])),
    section(block('sub-nav', [
      [a('#focus', 'Focus Areas')], [a('#solutions', 'Solutions')], [a('#progress', 'Progress')],
    ])),
    section(`${h(2, 'Our Focus Areas', 'focus')}${block('generic-filter', [
      ['Operations', img(I('card-1'), 'Energy', 640, 420), `${h(3, 'Energy Management')}${p('Optimize energy across the plant.')}`],
      ['Operations', img(I('card-2'), 'Emissions', 640, 420), `${h(3, 'Emissions Reduction')}${p('Reduce your carbon footprint.')}`],
      ['Products', img(I('card-3'), 'Circularity', 640, 420), `${h(3, 'Circular Economy')}${p('Extend product lifecycles.')}`],
      ['Products', img(I('card-4'), 'Design', 640, 420), `${h(3, 'Sustainable Design')}${p('Design for efficiency.')}`],
      ['People', img(I('card-5'), 'Community', 640, 420), `${h(3, 'People & Community')}${p('Invest in people and communities.')}`],
      ['People', img(I('card-6'), 'Governance', 640, 420), `${h(3, 'Governance')}${p('Responsible, transparent business.')}`],
    ])}`, 'bg-light-gray'),
    section(block('quote', [[
      '<p>Sustainability and productivity are not a trade-off — the right technology delivers both.</p>',
      '<p><strong>Chief Sustainability Officer</strong></p>',
    ]])),
    section(block('teaser', [[
      img(I('teaser-2'), 'Report', 720, 480),
      `${h(2, 'Track Our Progress', 'progress')}${p('Read our sustainability report to see how we are enabling a more sustainable future across the value chain.')}${cta('#', 'Read the Report')}`,
    ]])),
  ].join(''),
});

/* ---------- write everything ---------- */
function routeToFile(route) {
  if (route === '/') return 'index.html';
  return `${route.replace(/^\//, '')}.html`;
}

pages.forEach((pg) => {
  const file = join(OUT, routeToFile(pg.route));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, pageShell(pg));
});

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'nav.plain.html'), navFragment());
writeFileSync(join(OUT, 'footer.plain.html'), footerFragment());

process.stdout.write(`Generated ${pages.length} pages + nav + footer fragments\n`);

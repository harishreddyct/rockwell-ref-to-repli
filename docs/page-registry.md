# Page registry

Every page is a DA document (authored in Document Authoring), not a file in this
repo. This registry records the route, its template, the real reference copy used
for its title/description, and the blocks it composes.

All imagery is generated placeholder SVGs. Page copy (titles, descriptions,
headings) is taken from the reference as-is.

| Route | Template | Reference URL | H1 | Blocks |
| --- | --- | --- | --- | --- |
| `/` | home | `/en-in.html` | Industrial AI Designed for Optimizing Operations | animated-header, quick-links, campaign-tags, product-experience, company-news, teaser, logo-links, columns |
| `/products` | products-landing | `/en-in/products.html` | All Products | hero-banner, breadcrumb, sub-nav, teaser, content-tile, columns |
| `/products/hardware` | products-category | `/en-in/products/hardware.html` | Hardware Catalog | hero-banner, breadcrumb, product-category-list, product-featured-grid, product-recommendations, columns |
| `/products/software/factorytalk` | product-detail | `/en-in/products/software/factorytalk.html` | FactoryTalk Software | hero-banner, breadcrumb, sub-nav, product-experience, carousel, content-tile, teaser, teaser-links, columns |
| `/capabilities` | capabilities-landing | `/en-in/capabilities.html` | Capabilities | hero-banner, breadcrumb, teaser, content-tile, product-experience, columns |
| `/capabilities/smart-manufacturing` | capabilities-detail | `/en-in/capabilities/smart-manufacturing.html` | Smart Manufacturing | hero-banner, breadcrumb, sub-nav, product-experience, generic-filter, content-tile, teaser, columns |
| `/industries` | industries-landing | `/en-in/industries.html` | Industries | hero-banner, breadcrumb, teaser, content-tile, product-experience, columns |
| `/industries/food-beverage` | industries-detail | `/en-in/industries/food-beverage.html` | Food and Beverage Automation | hero-banner, breadcrumb, sub-nav, product-experience, carousel, accordion, value-prop-grid, quote, video, content-tile, teaser, columns |
| `/company/about-us` | company | `/en-in/company/about-us.html` | About Us | hero-banner, breadcrumb, sub-nav, teaser, columns |
| `/company/news` | news-listing | `/en-in/company/news.html` | Newsroom | hero-banner, breadcrumb, sub-nav, content-tile, value-prop-grid, teaser, video, columns |
| `/company/news/blogs/ai-transform-manufacturing` | article | `/en-in/company/news/blogs/ai-transform-manufacturing.html` | How AI is Transforming Manufacturing | hero-banner, breadcrumb, author-details, badge, content-tile, teaser, columns |
| `/company/news/case-studies/cornish-lithium-plant` | case-study | `/en-in/company/news/case-studies/cornish-lithium-plant.html` | Cornish Lithium Drives Sustainability at UK Plant | hero-banner, breadcrumb, author-details, badge, quote, content-tile, columns |
| `/support` | support | `/en-in/support.html` | Support Center | hero-banner, breadcrumb, teaser, teaser-links, content-tile, columns |
| `/events` | events-listing | `/en-in/events.html` | Events | hero-banner, breadcrumb, generic-filter, teaser, content-tile, columns |
| `/careers` | careers | `/en-in/careers.html` | Careers | hero-banner, breadcrumb, sub-nav, teaser, content-tile, columns |
| `/sustainability` | sustainability | `/en-in/sustainability.html` | Sustainability | hero-banner, breadcrumb, sub-nav, generic-filter, content-tile, quote, teaser, columns |

Plus global fragments authored in DA: `/nav` (header content) and `/footer`
(footer content), and the repo-level `404.html`.

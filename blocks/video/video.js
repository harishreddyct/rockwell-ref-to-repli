import { decorateIcons } from '../../scripts/aem.js';

/**
 * video — a poster image with a play button that lazily loads the actual video
 * iframe only when clicked, so no third-party embed loads on page view. Authored
 * as one row: a poster image and a link to the video (YouTube/Vimeo URL).
 */
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1`;
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (u.hostname.includes('vimeo.com')) return `https://player.vimeo.com/video/${u.pathname.split('/').pop()}?autoplay=1`;
    return url;
  } catch {
    return url;
  }
}

export default function decorate(block) {
  const link = block.querySelector('a');
  const picture = block.querySelector('picture, img');
  const src = link ? link.href : '';

  const facade = document.createElement('button');
  facade.type = 'button';
  facade.className = 'video-facade';
  facade.setAttribute('aria-label', 'Play video');

  if (picture) facade.append(picture.closest('picture') || picture);
  const play = document.createElement('span');
  play.className = 'icon icon-play video-play';
  facade.append(play);

  facade.addEventListener('click', () => {
    if (!src) return;
    const iframe = document.createElement('iframe');
    iframe.src = toEmbedUrl(src);
    iframe.title = 'Video player';
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.loading = 'lazy';
    facade.replaceWith(iframe);
  });

  block.textContent = '';
  block.append(facade);
  decorateIcons(block);
}

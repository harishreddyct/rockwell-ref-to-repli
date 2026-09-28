/**
 * carousel — a horizontal slide carousel (the reference's glide-based slider).
 * Each authored row is one slide. Uses a CSS scroll-snap track for the actual
 * sliding (so it works without JS), with JS only adding prev/next buttons and
 * dot indicators that drive the native scroll.
 */
export default function decorate(block) {
  const slides = [...block.children];
  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide, i) => {
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);
    track.append(slide);
  });

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';

  const scrollToSlide = (i) => {
    const slide = track.children[i];
    if (slide) track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  };

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => scrollToSlide(i));
    dots.append(dot);
  });

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-btn carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<span class="icon icon-chevron-right"></span>';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-btn carousel-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<span class="icon icon-chevron-right"></span>';

  const currentIndex = () => {
    const { scrollLeft } = track;
    let best = 0;
    let min = Infinity;
    [...track.children].forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - track.offsetLeft - scrollLeft);
      if (d < min) { min = d; best = i; }
    });
    return best;
  };

  prev.addEventListener('click', () => scrollToSlide(Math.max(0, currentIndex() - 1)));
  next.addEventListener('click', () => scrollToSlide(Math.min(slides.length - 1, currentIndex() + 1)));

  const syncDots = () => {
    const idx = currentIndex();
    [...dots.children].forEach((d, i) => d.setAttribute('aria-current', i === idx ? 'true' : 'false'));
  };
  track.addEventListener('scroll', () => window.requestAnimationFrame(syncDots), { passive: true });

  nav.append(prev, dots, next);
  block.textContent = '';
  block.append(track, nav);
  syncDots();
}

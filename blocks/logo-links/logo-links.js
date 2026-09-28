/**
 * logo-links — a strip of brand/partner logos, each optionally linking out.
 * Each authored row is one logo (an image, optionally wrapped in a link).
 */
export default function decorate(block) {
  const strip = document.createElement('div');
  strip.className = 'logo-links-strip';

  [...block.children].forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    cell.classList.add('logo-links-item');
    strip.append(cell);
  });

  block.textContent = '';
  block.append(strip);
}

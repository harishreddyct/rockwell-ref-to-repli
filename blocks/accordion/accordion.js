/**
 * accordion — expand/collapse panels built on native <details>/<summary>, so
 * the open/close interaction needs no JavaScript. Each authored row is one
 * item: the first cell is the summary (question/label), the second is the panel
 * body (answer/content).
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [labelCell, bodyCell] = [...row.children];
    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-summary';
    if (labelCell) summary.append(...labelCell.childNodes);

    const body = document.createElement('div');
    body.className = 'accordion-body';
    if (bodyCell) body.append(...bodyCell.childNodes);

    details.append(summary, body);
    row.replaceWith(details);
  });
}

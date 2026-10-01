// Inline line icons (24×24, stroke = currentColor). Decorative: always aria-hidden.
const paths = {
  man: '<circle cx="10" cy="14" r="5"/><path d="M13.6 10.4L20 4M15 4h5v5"/>',
  woman: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.8"/><path d="M16.5 14.1c2.9-.2 5 2 5 5.4"/>',
  health: '<path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21.5l8.8-8.8a5 5 0 0 0 0-7.1z"/><path d="M3.5 12.5h4l2-3 3 6 2-3h6"/>',
  fitness: '<path d="M6.5 7v10M3.5 9.5v5M17.5 7v10M20.5 9.5v5M6.5 12h11"/>',
  tech: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18h3"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16 9.8"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.9 2 5.1 2 7 0M9 9.5v.01M15 9.5v.01"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
};

const STAR = 'M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z';
const STAR_LEFT_HALF = 'M12 2.8L9.2 8.6l-6.3.9 4.6 4.4-1.1 6.3 5.6-3z';

export function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}

export function stars(rating) {
  let out = '';
  for (let i = 1; i <= 5; i++) {
    const fill = rating >= i ? 'full' : rating >= i - 0.5 ? 'half' : 'empty';
    const inner =
      fill === 'full' ? `<path d="${STAR}" fill="currentColor"/>`
      : fill === 'half' ? `<path d="${STAR}" fill="none"/><path d="${STAR_LEFT_HALF}" fill="currentColor"/>`
      : `<path d="${STAR}" fill="none"/>`;
    out += `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
  }
  return out;
}

/**
 * MyBabyCare "Hug" mark: a large circle holding a small one. Parent and child.
 * Teal tile, white parent, coral child. Matches public/favicon.svg and the PWA icons.
 */
const BrandMark = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="#14b8a6" />
    <g transform="translate(3 3) scale(0.8125)">
      <circle cx="13" cy="18.5" r="9" fill="#ffffff" />
      <circle cx="22" cy="11" r="6.5" fill="#14b8a6" />
      <circle cx="22" cy="11" r="5" fill="#f4694f" />
    </g>
  </svg>
);

export default BrandMark;

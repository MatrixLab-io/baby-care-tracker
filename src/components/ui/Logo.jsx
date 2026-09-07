import { Link } from 'react-router-dom';

/**
 * The mark: an accent tile with a line-drawn baby face. Flat, two colours,
 * no gradients — the accent is the only brand colour on screen.
 */
export function LogoMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect width="32" height="32" rx="10" className="fill-accent" />
      <g stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* head */}
        <circle cx="16" cy="17" r="7.5" />
        {/* tuft of hair */}
        <path d="M13 8.6c1-1.5 3-2 4.4-1" />
        {/* eyes */}
        <path d="M13.4 15.6h.01M18.6 15.6h.01" strokeWidth="2.2" />
        {/* smile */}
        <path d="M13.4 19.4c1.5 1.5 3.7 1.5 5.2 0" />
      </g>
    </svg>
  );
}

/** Mark plus wordmark. The wordmark is the only place font-brand is used. */
export default function Logo({ to = '/', size = 32, className = '' }) {
  const inner = (
    <>
      <LogoMark size={size} />
      <span className="font-brand tracking-[-0.035em] text-[17px] text-ink hidden sm:inline">MyBabyCare</span>
    </>
  );

  const classes = `inline-flex items-center gap-2.5 ${className}`;

  if (!to) {
    return <span className={classes}>{inner}</span>;
  }
  return (
    <Link to={to} className={`${classes} hover:opacity-80 transition-opacity`} aria-label="MyBabyCare home">
      {inner}
    </Link>
  );
}

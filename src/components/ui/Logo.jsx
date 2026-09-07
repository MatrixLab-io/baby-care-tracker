import { Link } from 'react-router-dom';
import BrandMark from '../BrandMark';

export { default as LogoMark } from '../BrandMark';

/** Mark plus wordmark. The wordmark is the only place font-brand is used. */
export default function Logo({ to = '/', className = '' }) {
  const inner = (
    <>
      <BrandMark className="w-8 h-8 shrink-0" />
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

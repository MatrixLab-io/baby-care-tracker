import { Link } from 'react-router-dom';

/**
 * One button, three ways to render: <button>, internal <Link>, or external <a>.
 * variant: primary | secondary | accent | danger | plain | on-inverse | outline-on-inverse
 * size: sm | md | lg
 * Pass `icon` for a leading Heroicon, `loading` to spin it and block the click.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  external = false,
  icon: Icon,
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    fullWidth && 'w-full',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const body = (
    <>
      {Icon && <Icon className={`w-[18px] h-[18px] shrink-0 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {body}
      </Link>
    );
  }
  if (href) {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" className={classes} disabled={disabled || loading} {...rest}>
      {body}
    </button>
  );
}

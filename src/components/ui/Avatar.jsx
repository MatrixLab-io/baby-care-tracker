const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl',
};

/** Photo when there is one, first initial when there is not. */
export default function Avatar({ src, name = '', size = 'md', className = '' }) {
  const classes = `avatar ${SIZES[size]} ${className}`;
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  if (src) {
    return <img src={src} alt={name} className={classes} referrerPolicy="no-referrer" />;
  }
  return (
    <span className={classes} aria-hidden="true">
      {initial}
    </span>
  );
}

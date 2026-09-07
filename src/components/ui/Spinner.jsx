const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
};

/** Indeterminate ring. Accent on a soft accent track, so it reads in both themes. */
export default function Spinner({ size = 'md', className = '', label = 'Loading' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block rounded-full border-accent/25 border-t-accent animate-spin ${SIZES[size]} ${className}`}
    />
  );
}

/** Full-page centred spinner with an optional caption. */
export function PageSpinner({ message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-ground">
      <Spinner size="lg" />
      {message && <p className="text-sm font-medium text-ink-2">{message}</p>}
    </div>
  );
}

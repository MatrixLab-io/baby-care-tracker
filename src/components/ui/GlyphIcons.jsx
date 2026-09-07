/**
 * Glyphs Heroicons does not ship. Drawn to match its outline set: 24px grid,
 * 1.5 stroke, round caps, currentColor.
 */

export function BoyIcon({ className = 'w-4 h-4', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...rest}>
      <circle cx="10" cy="14" r="5.25" />
      <path d="M14.5 9.5 20 4" />
      <path d="M15.25 4H20v4.75" />
    </svg>
  );
}

export function GirlIcon({ className = 'w-4 h-4', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...rest}>
      <circle cx="12" cy="9" r="5.25" />
      <path d="M12 14.25V21" />
      <path d="M9 18.25h6" />
    </svg>
  );
}

export function BloodDropIcon({ className = 'w-4 h-4', ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...rest}>
      <path d="M12 3.25s5.75 6.02 5.75 9.75a5.75 5.75 0 1 1-11.5 0C6.25 9.27 12 3.25 12 3.25Z" />
    </svg>
  );
}

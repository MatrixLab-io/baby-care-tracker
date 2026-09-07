/** Green check bullet for short lists of guarantees. */
export default function CheckItem({ title, children, className = '' }) {
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
        <circle cx="10" cy="10" r="9" className="fill-live-bg" />
        <path
          d="M6 10.5l2.5 2.5L14 7.5"
          className="stroke-live-fg"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="text-sm leading-snug">
        {title && <div className="font-semibold text-ink">{title}</div>}
        {children && <div className={title ? 'text-[13px] text-ink-2' : 'text-ink'}>{children}</div>}
      </div>
    </div>
  );
}

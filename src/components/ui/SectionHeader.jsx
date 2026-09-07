/**
 * Eyebrow + title (+ optional lead) with an optional right-side slot
 * (an action button, a filter). Left-aligned, like the rest of the app.
 */
export default function SectionHeader({ eyebrow, title, lead, aside, as = 'h2', className = '' }) {
  const Title = as;
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5 ${className}`}>
      <div className="flex flex-col gap-1.5 max-w-2xl">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <Title className="text-xl sm:text-[22px] font-bold">{title}</Title>
        {lead && <p className="text-sm leading-relaxed text-ink-2">{lead}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}

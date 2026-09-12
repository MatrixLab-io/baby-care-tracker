/**
 * Inline **bold** and `code`, which release notes use freely. Without this
 * they render as literal asterisks and backticks.
 */
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1 py-0.5 rounded-[3px] bg-surface-2 border border-line text-[12px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/** A change's body: always bullets, so every change is scanned the same way. */
export default function ReleaseNotes({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-2">
          <span className="mt-[7px] h-1 w-1 rounded-full bg-accent shrink-0" aria-hidden="true" />
          <span className="min-w-0">{renderInline(item)}</span>
        </li>
      ))}
    </ul>
  );
}

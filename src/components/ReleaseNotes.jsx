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

/** The body of one change: paragraphs and bullet lists. */
export default function ReleaseNotes({ blocks = [] }) {
  if (blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {blocks.map((block, i) =>
        block.type === 'list' ? (
          <ul key={i} className="flex flex-col gap-1.5">
            {block.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-[13px] text-ink-2">
                <span className="mt-[7px] h-1 w-1 rounded-full bg-accent shrink-0" aria-hidden="true" />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="text-[13px] leading-relaxed text-ink-2">
            {renderInline(block.text)}
          </p>
        ),
      )}
    </div>
  );
}

/** One trimmed line, for the What's New dialog. */
export function ReleaseSummaryLine({ text }) {
  return <p className="text-[13px] leading-snug text-ink-2">{renderInline(text)}</p>;
}

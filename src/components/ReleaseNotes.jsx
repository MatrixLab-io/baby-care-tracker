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

/**
 * Enough Markdown for GitHub release notes: two heading levels, bullet lists
 * and paragraphs. Anything else is rendered as plain text rather than dropped.
 */
function parseMarkdown(text) {
  if (!text) return [];

  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: [...listItems] });
      listItems = [];
    }
  };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      blocks.push({ type: 'h3', text: line.slice(4) });
    } else if (line.startsWith('## ')) {
      flushList();
      blocks.push({ type: 'h2', text: line.slice(3) });
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2));
    } else {
      flushList();
      blocks.push({ type: 'p', text: line });
    }
  }
  flushList();

  return blocks;
}

export default function ReleaseNotes({ body }) {
  const blocks = parseMarkdown(body);

  if (blocks.length === 0) {
    return <p className="text-[13px] text-ink-3">No release notes.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h4 key={i} className="text-[13px] font-semibold text-ink pt-1.5 first:pt-0">
              {renderInline(block.text)}
            </h4>
          );
        }
        if (block.type === 'h3') {
          return (
            <h5 key={i} className="eyebrow text-xs">
              {renderInline(block.text)}
            </h5>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="flex flex-col gap-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-[13px] text-ink-2">
                  <span className="mt-[7px] h-1 w-1 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[13px] text-ink-2">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

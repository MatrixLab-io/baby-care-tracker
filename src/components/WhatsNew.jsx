import { useState, useEffect } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Badge from './ui/Badge';
import Modal from './ui/Modal';
import Spinner from './ui/Spinner';

const REPO = 'ImtiazEpu/baby-care-tracker';
const SEEN_KEY = 'whatsNewSeenVersion';

function parseMarkdown(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: [...listItems] });
      listItems = [];
    }
  };

  for (const raw of lines) {
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

function ReleaseNotes({ body }) {
  const blocks = parseMarkdown(body);
  return (
    <div className="flex flex-col gap-2.5">
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h4 key={i} className="text-[13px] font-semibold text-ink pt-1.5 first:pt-0">
              {block.text}
            </h4>
          );
        }
        if (block.type === 'h3') {
          return (
            <h5 key={i} className="eyebrow text-xs">
              {block.text}
            </h5>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="flex flex-col gap-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-[13px] text-ink-2">
                  <span className="mt-[7px] h-1 w-1 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'p') {
          return (
            <p key={i} className="text-[13px] text-ink-2">
              {block.text}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

export default function WhatsNew() {
  const [isOpen, setIsOpen] = useState(false);
  const [releases, setReleases] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/releases?per_page=3`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReleases(data);
          const seen = localStorage.getItem(SEEN_KEY);
          if (seen !== data[0].tag_name) setHasNew(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (releases[0]?.tag_name) {
      localStorage.setItem(SEEN_KEY, releases[0].tag_name);
      setHasNew(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        title="What's new"
        aria-label={hasNew ? "What's new — unread release" : "What's new"}
        className="btn btn-secondary btn-sm w-9 px-0 relative"
      >
        <SparklesIcon className="w-[18px] h-[18px]" aria-hidden="true" />
        {hasNew && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-surface"
            aria-hidden="true"
          />
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="What's new"
        description="The three most recent releases."
        size="sm"
      >
        {releases.length > 0 ? (
          <div className="flex flex-col gap-3">
            {releases.map((release, index) => (
              <div key={release.id} className="rounded-control border border-line bg-surface-2 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-semibold text-ink truncate">
                      {release.name || release.tag_name}
                    </span>
                    {index === 0 && <Badge tone="accent">Latest</Badge>}
                  </div>
                  <span className="text-xs text-ink-3 shrink-0">{formatDate(release.published_at)}</span>
                </div>

                {release.body ? (
                  <ReleaseNotes body={release.body} />
                ) : (
                  <p className="text-[13px] text-ink-3">No release notes.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}
      </Modal>
    </>
  );
}

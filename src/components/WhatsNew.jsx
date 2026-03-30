import { useState, useEffect, useRef } from 'react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
    if (!line) { flushList(); continue; }

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
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if (block.type === 'h2') return (
          <h4 key={i} className="text-sm font-bold text-gray-900 dark:text-white pt-2 first:pt-0">
            {block.text}
          </h4>
        );
        if (block.type === 'h3') return (
          <h5 key={i} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            {block.text}
          </h5>
        );
        if (block.type === 'list') return (
          <ul key={i} className="space-y-1.5">
            {block.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        );
        if (block.type === 'p') return (
          <p key={i} className="text-sm text-gray-600 dark:text-gray-300">{block.text}</p>
        );
        return null;
      })}
    </div>
  );
}

export default function WhatsNew() {
  const [isOpen, setIsOpen] = useState(false);
  const [releases, setReleases] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const modalRef = useRef(null);

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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    if (releases[0]?.tag_name) {
      localStorage.setItem(SEEN_KEY, releases[0].tag_name);
      setHasNew(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        title="What's New"
        className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <SparklesIcon className="h-5 w-5" />
        {hasNew && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
          </span>
        )}
      </button>

      {/* Modal Backdrop + Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Dialog Panel */}
          <div
            ref={modalRef}
            className="relative w-full max-w-md transform rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-2xl animate-scale-in overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    What's New
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Latest 3 releases
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Releases list */}
            <div className="overflow-y-auto max-h-[70vh] px-6 py-4 space-y-4">
              {releases.length > 0 ? (
                releases.map((release, index) => (
                  <div key={release.id} className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
                    {/* Release header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        {release.name || release.tag_name}
                        {index === 0 && (
                          <span className="ml-1 px-1.5 py-0.5 rounded bg-indigo-500 text-white text-[10px] font-bold">
                            LATEST
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(release.published_at)}
                      </span>
                    </div>
                    {/* Release notes */}
                    {release.body ? (
                      <ReleaseNotes body={release.body} />
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                        No release notes.
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex justify-center py-6">
                  <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

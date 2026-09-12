import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import { fetchReleases, formatReleaseDate, parseReleaseSections, sectionBullets } from '../services/githubReleases';
import ReleaseNotes from './ReleaseNotes';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Modal from './ui/Modal';
import Spinner from './ui/Spinner';

const SEEN_KEY = 'whatsNewSeenVersion';

export default function WhatsNew() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [releases, setReleases] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    fetchReleases({ perPage: 3 })
      .then((data) => {
        if (data.length === 0) return;
        setReleases(data);
        if (localStorage.getItem(SEEN_KEY) !== data[0].tag_name) setHasNew(true);
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

  const viewAll = () => {
    setIsOpen(false);
    navigate('/changelog');
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
        <MegaphoneIcon className="w-[18px] h-[18px]" aria-hidden="true" />
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
        description="A summary of the three most recent releases."
        size="sm"
      >
        {releases.length > 0 ? (
          <div className="flex flex-col gap-3">
            {releases.map((release, index) => {
              const sections = parseReleaseSections(release.body).slice(0, 3);

              return (
                <div key={release.id} className="rounded-control border border-line bg-surface-2 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm font-semibold text-ink truncate">
                        {release.name || release.tag_name}
                      </span>
                      {index === 0 && <Badge tone="accent">Latest</Badge>}
                    </div>
                    <span className="text-xs text-ink-3 shrink-0">{formatReleaseDate(release.published_at)}</span>
                  </div>

                  {sections.length > 0 ? (
                    <ul className="flex flex-col gap-3">
                      {sections.map((section, i) => (
                        <li key={i} className="flex flex-col gap-1">
                          <div className="flex items-start gap-2">
                            <Badge tone={section.tone} className="mt-0.5 shrink-0">
                              {section.label}
                            </Badge>
                            {/* A release with no sub-heading puts its text beside the badge
                                rather than stranding the badge on a line of its own. */}
                            {section.heading ? (
                              <span className="text-[13px] font-semibold text-ink leading-snug">
                                {section.heading}
                              </span>
                            ) : (
                              <ReleaseNotes items={sectionBullets(section, { limit: 2, maxChars: 120 })} />
                            )}
                          </div>
                          {section.heading && (
                            <div className="pl-[54px]">
                              <ReleaseNotes items={sectionBullets(section, { limit: 2, maxChars: 120 })} />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[13px] text-ink-3">No release notes.</p>
                  )}
                </div>
              );
            })}

            <Button variant="secondary" icon={ArrowRightIcon} onClick={viewAll} fullWidth>
              View all releases
            </Button>
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

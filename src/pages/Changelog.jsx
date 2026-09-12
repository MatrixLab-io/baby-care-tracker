import { useEffect, useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { fetchReleases, formatReleaseDate, parseReleaseSections, sectionBullets } from '../services/githubReleases';
import AppShell from '../components/AppShell';
import ReleaseNotes from '../components/ReleaseNotes';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

// Public route, so there is no BabyProvider to back the privacy dialog.
const HEADER = { showPrivacy: false };

const Changelog = () => {
  const [releases, setReleases] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchReleases({ perPage: 100 })
      .then(setReleases)
      .catch(() => setFailed(true));
  }, []);

  return (
    <AppShell header={HEADER}>
      <div className="flex flex-col gap-2 mb-7 max-w-xl">
        <h1 className="text-[30px] sm:text-[38px] font-bold leading-[1.05]">Changelog</h1>
        <p className="text-[15px] text-ink-2">Every release of MyBabyCare, newest first.</p>
      </div>

      {failed && (
        <Alert tone="caution" title="Could not load the release history">
          The list comes from GitHub, which limits how often it can be asked. Try again in a few minutes,
          or read it at{' '}
          <a
            href="https://github.com/MatrixLab-io/baby-care-tracker/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            github.com/MatrixLab-io/baby-care-tracker/releases
          </a>
          .
        </Alert>
      )}

      {!failed && releases === null && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {!failed && releases?.length === 0 && (
        <Card>
          <EmptyState
            icon={DocumentTextIcon}
            title="No releases yet"
            message="Release notes will appear here as versions are published."
          />
        </Card>
      )}

      {!failed && releases?.length > 0 && (
        <div className="flex flex-col gap-4">
          {releases.map((release, index) => {
            const sections = parseReleaseSections(release.body);

            return (
              <Card key={release.id} as="article">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-line">
                  <div className="flex items-center gap-2 min-w-0">
                    <h2 className="text-[17px] font-bold text-ink truncate">
                      {release.name || release.tag_name}
                    </h2>
                    {index === 0 && <Badge tone="accent">Latest</Badge>}
                  </div>
                  <span className="text-[13px] text-ink-2">{formatReleaseDate(release.published_at)}</span>
                </div>

                {sections.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {sections.map((section, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="flex items-start gap-2">
                          <Badge tone={section.tone} className="mt-0.5 shrink-0">
                            {section.label}
                          </Badge>
                          {section.heading && (
                            <h3 className="text-sm font-semibold text-ink leading-snug">{section.heading}</h3>
                          )}
                        </div>
                        <div className={section.heading ? 'sm:pl-[54px]' : ''}>
                          <ReleaseNotes items={sectionBullets(section)} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-ink-3">No release notes.</p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
};

export default Changelog;

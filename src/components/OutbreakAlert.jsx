import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { getOutbreakAlerts } from '../services/outbreakService';
import { getOutbreakVaccineRecommendations, matchOutbreakToDiseases } from '../config/outbreakVaccineMap';
import { BD_EPI_SCHEDULE } from '../config/vaccines';
import { PRIVATE_VACCINE_SCHEDULE } from '../config/privateVaccines';
import Badge from './ui/Badge';

// Build a lookup for vaccine key → short label
const VACCINE_LABELS = {};
[...BD_EPI_SCHEDULE, ...PRIVATE_VACCINE_SCHEDULE].forEach((v) => {
  VACCINE_LABELS[v.key] = v.shortLabel;
});

// Severity maps onto the banner tones. Written out so Tailwind sees every class.
const SEVERITY = {
  critical: { banner: 'banner-danger', icon: ShieldExclamationIcon },
  warning: { banner: 'banner-caution', icon: ExclamationTriangleIcon },
  info: { banner: 'banner-info', icon: ExclamationTriangleIcon },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const OutbreakAlert = ({ completedVaccines = {} }) => {
  const [alerts, setAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dismissedOutbreakAlerts') || '[]');
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getOutbreakAlerts();
        setAlerts(data);
      } catch (err) {
        console.error('Failed to load outbreak alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const handleDismiss = (alertId) => {
    const updated = [...dismissedAlerts, alertId];
    setDismissedAlerts(updated);
    localStorage.setItem('dismissedOutbreakAlerts', JSON.stringify(updated));
  };

  if (loading || alerts.length === 0) return null;

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));
  if (visibleAlerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 mb-6">
      {visibleAlerts.map((alert) => {
        const tone = SEVERITY[alert.severity] || SEVERITY.info;
        const ToneIcon = tone.icon;

        const diseaseMatches =
          alert.diseases.length > 0
            ? alert.diseases.map((d) => matchOutbreakToDiseases(d)).flat()
            : matchOutbreakToDiseases(alert.title);

        const recommendations = getOutbreakVaccineRecommendations(
          diseaseMatches.length > 0 ? diseaseMatches : matchOutbreakToDiseases(alert.title),
          completedVaccines,
        );

        return (
          <div
            key={alert.id}
            role="alert"
            className={`banner ${tone.banner} sm:p-5 ${
              alert.severity === 'critical' ? 'motion-pulse-soft' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => handleDismiss(alert.id)}
              className="absolute top-3 right-3 btn-icon hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Dismiss alert"
            >
              <XMarkIcon className="w-[18px] h-[18px]" aria-hidden="true" />
            </button>

            <div className="flex items-start gap-3">
              <ToneIcon className="banner-icon w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />

              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs text-ink-2">{formatDate(alert.date)}</span>
                  {alert.source && <span className="text-xs text-ink-2">&bull; {alert.source}</span>}
                </div>

                <h3 className="text-[15px] sm:text-[17px] font-semibold text-ink">{alert.title}</h3>

                {alert.summary && <p className="banner-body mt-1.5">{alert.summary}</p>}
              </div>
            </div>

            {recommendations.length > 0 && (
              <div className="mt-4 pt-4 banner-divider">
                <h4 className="text-[13px] font-semibold text-ink flex items-center gap-2 mb-3">
                  <ShieldExclamationIcon className="banner-icon w-4 h-4" aria-hidden="true" />
                  Vaccine status for your baby
                </h4>

                <div className="flex flex-col gap-2.5">
                  {recommendations.map((rec) =>
                    rec.isFullyVaccinated ? (
                      <div key={rec.disease} className="flex items-center gap-2 text-sm font-medium text-ink">
                        <CheckCircleIcon className="w-[18px] h-[18px] shrink-0 text-live-fg" aria-hidden="true" />
                        Fully vaccinated against {rec.disease}
                      </div>
                    ) : (
                      <div key={rec.disease}>
                        <div className="flex items-center gap-2 text-sm font-medium text-ink mb-1.5">
                          <ExclamationTriangleIcon className="banner-icon w-[18px] h-[18px] shrink-0" aria-hidden="true" />
                          Pending {rec.disease} vaccines
                        </div>
                        <div className="flex flex-wrap gap-1.5 ml-7">
                          {rec.pendingVaccineKeys.map((key) => (
                            <Badge key={key} tone="neutral">
                              {VACCINE_LABELS[key] || key}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {alert.url && (
              <a
                href={alert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-semibold text-link underline underline-offset-2"
              >
                Read the full report
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OutbreakAlert;

import { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, ShieldExclamationIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getOutbreakAlerts } from '../services/outbreakService';
import { getOutbreakVaccineRecommendations, matchOutbreakToDiseases } from '../config/outbreakVaccineMap';
import { BD_EPI_SCHEDULE } from '../config/vaccines';
import { PRIVATE_VACCINE_SCHEDULE } from '../config/privateVaccines';

// Build a lookup for vaccine key → short label
const VACCINE_LABELS = {};
[...BD_EPI_SCHEDULE, ...PRIVATE_VACCINE_SCHEDULE].forEach(v => {
  VACCINE_LABELS[v.key] = v.shortLabel;
});

const SEVERITY_STYLES = {
  critical: {
    container: 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-600 text-white',
    title: 'text-red-900 dark:text-red-100'
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-600 text-white',
    title: 'text-amber-900 dark:text-amber-100'
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-600 text-white',
    title: 'text-blue-900 dark:text-blue-100'
  }
};

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

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));
  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {visibleAlerts.map(alert => {
        const styles = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;

        // Get disease matches and vaccine recommendations
        const diseaseMatches = alert.diseases.length > 0
          ? alert.diseases.map(d => matchOutbreakToDiseases(d)).flat()
          : matchOutbreakToDiseases(alert.title);

        const recommendations = getOutbreakVaccineRecommendations(
          diseaseMatches.length > 0 ? diseaseMatches : matchOutbreakToDiseases(alert.title),
          completedVaccines
        );

        return (
          <div
            key={alert.id}
            className={`relative border-2 rounded-2xl p-4 sm:p-5 ${styles.container} animate-pulse-slow`}
          >
            {/* Dismiss button */}
            {!alert.isHardcoded && (
              <button
                onClick={() => handleDismiss(alert.id)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-xl ${styles.icon} bg-white/50 dark:bg-black/20`}>
                {alert.severity === 'critical' ? (
                  <ShieldExclamationIcon className="w-6 h-6" />
                ) : (
                  <ExclamationTriangleIcon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded-full ${styles.badge}`}>
                    {alert.severity === 'critical' ? 'Breaking' : 'Alert'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(alert.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {alert.source && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      &bull; {alert.source}
                    </span>
                  )}
                </div>
                <h3 className={`font-bold text-base sm:text-lg ${styles.title}`}>
                  {alert.title}
                </h3>
                {alert.summary && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1.5">
                    {alert.summary}
                  </p>
                )}
              </div>
            </div>

            {/* Vaccine Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-4 border-t border-black/10 dark:border-white/10 pt-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <ShieldExclamationIcon className="w-4 h-4" />
                  Vaccine Status for Your Baby
                </h4>
                <div className="space-y-2">
                  {recommendations.map(rec => (
                    <div key={rec.disease} className="flex flex-col gap-1.5">
                      {rec.isFullyVaccinated ? (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                          <span className="text-green-800 dark:text-green-300 font-medium">
                            Fully vaccinated against {rec.disease}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 text-sm mb-1.5">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                            <span className="text-red-800 dark:text-red-300 font-medium">
                              Pending {rec.disease} vaccines:
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 ml-7">
                            {rec.pendingVaccineKeys.map(key => (
                              <span
                                key={key}
                                className="px-2.5 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full"
                              >
                                {VACCINE_LABELS[key] || key}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alert.url && (
              <a
                href={alert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Read more &rarr;
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OutbreakAlert;

import { useState, useEffect } from 'react';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';

/** Ask a worker what it is. Resolves null if it does not answer. */
const askWorker = (worker) =>
  new Promise((resolve) => {
    if (!worker) return resolve(null);

    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), 2000);
    channel.port1.onmessage = (event) => {
      clearTimeout(timer);
      resolve(event.data);
    };
    worker.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
  });

/** Installed apps are the ones whose icon the operating system has cached. */
const isInstalled = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [incoming, setIncoming] = useState(null);
  const [reinstallAdvised, setReinstallAdvised] = useState(false);

  useEffect(() => {
    const handleUpdate = async (event) => {
      const reg = event.detail;
      setRegistration(reg);
      setShowUpdate(true);

      // The waiting worker knows which version it is, and whether that version
      // changed the app's icons or name.
      const [next, current] = await Promise.all([askWorker(reg?.waiting), askWorker(reg?.active)]);
      setIncoming(next?.version ?? null);
      setReinstallAdvised(
        Boolean(next && current && next.identity !== current.identity && isInstalled())
      );
    };

    window.addEventListener('swUpdateAvailable', handleUpdate);
    return () => window.removeEventListener('swUpdateAvailable', handleUpdate);
  }, []);

  const handleRefresh = () => {
    setUpdating(true);

    if (registration?.waiting) {
      // Reloading here would just re-run the old build: the new worker has not
      // taken over yet. Tell it to activate, and the controllerchange listener
      // in serviceWorkerRegistration reloads once it has.
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      // Belt and braces, in case activation never fires.
      setTimeout(() => window.location.reload(), 3000);
      return;
    }

    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 motion-slide-up"
    >
      <div className="card shadow-modal p-4 flex items-start gap-3">
        <span className="icon-tile w-9 h-9 shrink-0 bg-accent-soft text-accent-soft-fg">
          <ArrowPathIcon className="w-5 h-5" aria-hidden="true" />
        </span>

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-ink">
            {incoming ? `Version ${incoming} is ready` : 'Update available'}
          </h2>
          <p className="text-[13px] text-ink-2 mt-0.5">
            {incoming
              ? `You are on ${__APP_VERSION__}. Refresh to update.`
              : 'A new version is ready. Refresh to update.'}
          </p>

          {reinstallAdvised && (
            <p className="text-[13px] mt-2 p-2.5 rounded-control bg-soon-bg text-soon-fg">
              This update changes the app icon. Your device caches that, so if the icon still looks the
              same afterwards, uninstall the app and install it again from mybabycare.app.
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <Button size="sm" icon={updating ? ArrowPathIcon : undefined} loading={updating} onClick={handleRefresh}>
              {updating ? 'Updating' : 'Refresh now'}
            </Button>
            <Button size="sm" variant="secondary" disabled={updating} onClick={() => setShowUpdate(false)}>
              Later
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowUpdate(false)}
          className="btn-icon shrink-0 -mr-1 -mt-1"
          aria-label="Dismiss"
        >
          <XMarkIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;

import { useState, useEffect } from 'react';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from './ui/Button';

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const handleUpdate = (event) => {
      setRegistration(event.detail);
      setShowUpdate(true);
    };

    window.addEventListener('swUpdateAvailable', handleUpdate);
    return () => window.removeEventListener('swUpdateAvailable', handleUpdate);
  }, []);

  const handleRefresh = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
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
          <h2 className="text-sm font-semibold text-ink">Update available</h2>
          <p className="text-[13px] text-ink-2 mt-0.5">A new version is ready. Refresh to update.</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleRefresh}>
              Refresh now
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowUpdate(false)}>
              Later
            </Button>
          </div>
        </div>

        <button type="button" onClick={() => setShowUpdate(false)} className="btn-icon shrink-0 -mr-1 -mt-1" aria-label="Dismiss">
          <XMarkIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;

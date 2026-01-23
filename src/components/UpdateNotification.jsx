import { useState, useEffect } from 'react';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Listen for update available event
    const handleUpdate = (event) => {
      setRegistration(event.detail);
      setShowUpdate(true);
    };

    window.addEventListener('swUpdateAvailable', handleUpdate);
    return () => window.removeEventListener('swUpdateAvailable', handleUpdate);
  }, []);

  const handleRefresh = () => {
    if (registration && registration.waiting) {
      // Tell service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    // Reload the page
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-slide-up">
      <div className="glass-card border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 shrink-0">
            <ArrowPathIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Update Available
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              A new version is ready. Refresh to update.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Refresh Now
              </button>
              <button
                onClick={() => setShowUpdate(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowUpdate(false)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;

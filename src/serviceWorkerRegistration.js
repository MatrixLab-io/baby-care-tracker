const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const isDev = import.meta.env.DEV;

// An installed PWA can stay open for days without a navigation, and browsers
// only check for a new worker on navigation. So poll, and check again whenever
// the window is brought back to the front.
const UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes
const UPDATE_THROTTLE = 60 * 1000; // don't re-check on every tab focus

const log = (...args) => {
  if (isDev) console.log('[SW]', ...args);
};

export function register(config) {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    if (isLocalhost) {
      checkValidServiceWorker(swUrl, config);
    } else {
      registerValidSW(swUrl, config);
    }
  });

  // When the waiting worker takes over, the page is running against a new
  // build. Reload once so the loaded chunks match it.
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    // The browser must not answer the worker request from its own HTTP cache,
    // or a new deploy can go unnoticed.
    .register(swUrl, { updateViaCache: 'none' })
    .then((registration) => {
      const notify = () => {
        log('New content available.');
        config?.onUpdate?.(registration);
      };

      // An update may already be waiting from a previous visit.
      if (registration.waiting && navigator.serviceWorker.controller) {
        notify();
      }

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state !== 'installed') return;

          if (navigator.serviceWorker.controller) {
            notify();
          } else {
            log('Content is cached for offline use.');
            config?.onSuccess?.(registration);
          }
        };
      };

      scheduleUpdateChecks(registration);
    })
    .catch((error) => {
      if (isDev) console.error('[SW] Error during registration:', error);
    });
}

function scheduleUpdateChecks(registration) {
  let lastCheck = Date.now();

  const check = () => {
    lastCheck = Date.now();
    registration.update().catch(() => {
      // Offline, or the worker is unreachable. The next check will retry.
    });
  };

  setInterval(check, UPDATE_INTERVAL);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && Date.now() - lastCheck > UPDATE_THROTTLE) {
      check();
    }
  });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      log('No internet connection. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        if (isDev) console.error('[SW]', error.message);
      });
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

// Hide the initial loader once React is ready
const hideLoader = () => {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 300);
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Hide loader after React mounts
hideLoader();

// Register service worker for PWA with update notification
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    // Dispatch custom event for UpdateNotification component
    window.dispatchEvent(new CustomEvent('swUpdateAvailable', { detail: registration }));
  }
})

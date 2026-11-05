// Register Service Worker for PWA Offline Capability (Safe for AI Studio iframe & Dev mode)
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // In development, preview environment, or inside an iframe: unregister SW to prevent Vite caching issues
  const isIframe = window.self !== window.top;
  const isDev = import.meta.env.DEV;

  if (isDev || isIframe) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then(() => {
          console.log('Unregistered SW to ensure live development/iframe preview');
        });
      }
    });
    if ('caches' in window) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
      });
    }
    return;
  }

  // Only register for standalone production PWA installation
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Coder Kids SW registered successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Coder Kids SW registration skipped or failed:', error);
      });
  });
}

// Registrasi Service Worker untuk PWA
export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker aktif dengan scope:', registration.scope);
          
          // Tangani update service worker
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] Versi baru AZ GO tersedia. Siap diupdate.');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.warn('[PWA] Registrasi Service Worker gagal:', error);
        });
    });
  }
}

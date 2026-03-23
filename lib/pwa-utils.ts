/**
 * PWA Utilities for handling service worker updates and app installation
 */

/**
 * Register service worker with update checking
 */
export async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[PWA] Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[PWA] Service Worker registered:', registration);

    // Check for updates every 60 seconds
    setInterval(() => {
      registration.update().catch((err) => {
        console.error('[PWA] Failed to check for SW updates:', err);
      });
    }, 60000);

    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Check if app is running in standalone mode
 */
export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if running as PWA
  const isStandalone =
    (navigator as any).standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches;

  return isStandalone;
}

/**
 * Request install prompt
 */
let deferredPrompt: any;

export function setupInstallPrompt() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent automatic prompt
    event.preventDefault();
    // Store prompt for later use
    deferredPrompt = event;
    console.log('[PWA] Install prompt available');
  });
}

export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('[PWA] Install prompt not available');
    return false;
  }

  try {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    const installed = outcome === 'accepted';
    
    console.log(`[PWA] User ${installed ? 'installed' : 'dismissed'} the app`);
    
    deferredPrompt = null;
    return installed;
  } catch (error) {
    console.error('[PWA] Error showing install prompt:', error);
    return false;
  }
}

/**
 * Check if app was installed
 */
export function setupAppInstalledListener(callback: () => void) {
  if (typeof window === 'undefined') return;

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App was installed');
    callback();
  });
}

/**
 * Force update service worker
 */
export async function forceUpdateServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[PWA] Service Worker not available');
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      const success = await registration.unregister();
      if (success) {
        console.log('[PWA] Service Worker unregistered');
      }
    }

    // Re-register
    await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    console.log('[PWA] Service Worker re-registered');
    
    // Reload page to use new SW
    window.location.reload();
  } catch (error) {
    console.error('[PWA] Failed to force update:', error);
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches() {
  if (typeof window === 'undefined' || !('caches' in window)) {
    console.warn('[PWA] Cache API not available');
    return;
  }

  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
      console.log(`[PWA] Deleted cache: ${cacheName}`);
    }

    // Also notify service worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_CACHE',
      });
    }

    console.log('[PWA] All caches cleared');
  } catch (error) {
    console.error('[PWA] Failed to clear caches:', error);
  }
}

/**
 * Get cache storage information
 */
export async function getCacheInfo(): Promise<{
  caches: Array<{ name: string; size: number; items: number }>;
  totalSize: number;
} | null> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return null;
  }

  try {
    const cacheNames = await caches.keys();
    const caches_info = [];
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      // Estimate size
      let size = 0;
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          size += blob.size;
        }
      }

      totalSize += size;
      caches_info.push({
        name: cacheName,
        size,
        items: keys.length,
      });
    }

    return {
      caches: caches_info,
      totalSize,
    };
  } catch (error) {
    console.error('[PWA] Failed to get cache info:', error);
    return null;
  }
}

/**
 * Listen for controller change (new SW activated)
 */
export function onServiceWorkerUpdate(callback: () => void) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[PWA] Service Worker updated');
    callback();
  });
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('[PWA] Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('[PWA] Failed to request notification permission:', error);
      return false;
    }
  }

  return false;
}

/**
 * Show app update notification
 */
export function notifyAppUpdate() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification('Sherdor Toyxonasi', {
      title: 'App Updated',
      body: 'A new version is available. Refresh to update.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'app-update',
      requireInteraction: true,
    });
  }
}

/**
 * Get device information
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return null;
  }

  const ua = navigator.userAgent;
  
  return {
    userAgent: ua,
    isMobile: /iPhone|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua),
    isIOS: /iPhone|iPad|iPod/i.test(ua),
    isAndroid: /Android/i.test(ua),
    isStandalone: isStandaloneMode(),
    supportsServiceWorker: 'serviceWorker' in navigator,
    supportsPushNotifications: 'serviceWorker' in navigator && 'Notification' in window,
    supportsBackgroundSync: 'sync' in ServiceWorkerRegistration.prototype,
    supportsPeriodicSync: 'periodicSync' in ServiceWorkerRegistration.prototype,
  };
}

/**
 * Log PWA capabilities
 */
export function logPWACapabilities() {
  const info = getDeviceInfo();
  if (!info) {
    console.log('[PWA] Not in browser context');
    return;
  }

  console.log('[PWA] Device Capabilities:', {
    standalone: info.isStandalone,
    serviceWorker: info.supportsServiceWorker,
    notifications: info.supportsPushNotifications,
    backgroundSync: info.supportsBackgroundSync,
    periodicSync: info.supportsPeriodicSync,
    platform: info.isIOS ? 'iOS' : info.isAndroid ? 'Android' : 'Other',
  });
}

# PWA Setup Guide - Sherdor Toyxonasi

This guide explains the PWA (Progressive Web App) configuration for the Sherdor Toyxonasi event management system.

## Overview

Your application is now fully configured as a PWA with the following features:
- Works offline with intelligent caching strategies
- Can be installed on home screen (Android, iOS, Desktop)
- Automatic cache updates when new versions are deployed
- Proper service worker with skipWaiting() and clients.claim()
- Lighthouse PWA score optimization (100/100 possible)

## File Structure

```
public/
├── manifest.json          # PWA manifest configuration
├── sw.js                  # Service Worker
├── icon-192.png           # App icon (192x192px)
└── icon-512.png           # App icon (512x512px)

app/
└── layout.tsx             # Enhanced with PWA metadata and SW registration
```

## Configuration Details

### 1. Manifest File (`public/manifest.json`)

The manifest defines your PWA's appearance and behavior:

**Key Settings:**
- `display: "standalone"` - App runs in full-screen mode without browser UI
- `start_url: "/"` - Opens home page when launched
- `theme_color: "#1e3a8a"` - Primary color (matches your design)
- `background_color: "#ffffff"` - Splash screen background
- `icons` - Two sizes with both "any" and "maskable" purposes for compatibility

**Maskable Icons:**
- Include icons with safe areas for different OS designs
- Android can apply adaptive icon shape to maskable icons
- Improves appearance across devices

**Shortcuts:**
- Quick actions accessible from home screen
- Example: "View Events" shortcut

### 2. Service Worker (`public/sw.js`)

Implements intelligent caching strategies:

#### Caching Strategies Used:

**Network First (API Routes)**
- Try network first (fresh data)
- Fall back to cache if offline
- Used for: `/api/*` endpoints, dynamic data

**Cache First (Static Assets)**
- Use cached version immediately
- Update in background
- Used for: images, fonts, CSS, JS chunks

**Network First with Offline Fallback (HTML Pages)**
- Try network first for latest content
- Fall back to cached version if offline
- Used for: navigations, page requests

**Stale While Revalidate (Default)**
- Serve cached content immediately
- Update cache in background
- Used for: other resources

#### Key Features:

1. **Automatic Old Cache Cleanup**
   ```javascript
   // Deletes old cache versions on activation
   cacheNames.forEach((cacheName) => {
     if (!Object.values(CACHE_NAMES).includes(cacheName)) {
       caches.delete(cacheName);
     }
   });
   ```

2. **Skip Waiting & Claim**
   ```javascript
   // Activate new SW immediately without waiting
   return self.skipWaiting();
   
   // Take control of all clients immediately
   return self.clients.claim();
   ```

3. **Versioned Cache Names**
   ```javascript
   const CACHE_VERSION = 'v1';
   const CACHE_NAMES = {
     static: `static-${CACHE_VERSION}`,
     dynamic: `dynamic-${CACHE_VERSION}`,
     api: `api-${CACHE_VERSION}`,
   };
   ```

4. **Error Handling**
   - Broken responses are NOT cached
   - Failed requests fall back gracefully
   - 503 errors for unavailable resources
   - Placeholder SVG for missing images

5. **Background Updates**
   - Cache First strategy updates in background
   - Users get instant loading with fresh data following
   - No interruption to user experience

### 3. Layout Configuration (`app/layout.tsx`)

**Enhanced Metadata:**
- Comprehensive Open Graph tags for social sharing
- Apple Web App metadata (iOS support)
- Format detection for phone/email/address
- Keywords for discoverability

**Service Worker Registration:**
```javascript
navigator.serviceWorker.register('/sw.js', { scope: '/' })
  .then((registration) => {
    // Check for updates every 60 seconds
    setInterval(() => {
      registration.update();
    }, 60000);
  });
```

**Viewport Settings:**
- `width: device-width` - Responsive to device width
- `initialScale: 1` - No zoom on load
- `userScalable: false` - Prevent zooming (optional)
- `viewportFit: cover` - Use safe areas (notch support)

## Installation & Testing

### Browser Testing

1. **Desktop Chrome/Chromium:**
   - Open DevTools (F12)
   - Go to Application → Service Workers
   - Check "Update on reload" during development
   - Look for "Install" button in address bar

2. **Mobile Chrome (Android):**
   - Open DevTools on Android
   - Enable "Show install prompt"
   - Menu → "Install app"

3. **Safari (iOS):**
   - Tap Share button
   - Select "Add to Home Screen"
   - Works without service worker, uses manifest for config

### Lighthouse Audit

1. Open DevTools → Lighthouse
2. Run "PWA" audit
3. Target score: 100/100

**Checklist for 100/100:**
- ✅ Page is installable
- ✅ Web app manifest is valid
- ✅ Icons available in multiple sizes
- ✅ Viewport meta tag configured
- ✅ Service worker installed and active
- ✅ Works offline (200 response)
- ✅ Content is responsive
- ✅ Color contrast meets standards
- ✅ Fonts are optimized
- ✅ Browser compatibility checked

## Deployment Checklist

When deploying to Netlify or Vercel:

- [ ] Icons are in `public/icon-192.png` and `public/icon-512.png`
- [ ] `public/manifest.json` exists with correct configuration
- [ ] `public/sw.js` is properly formatted (no syntax errors)
- [ ] Service Worker registration works (check browser console)
- [ ] Old caches are cleaned up on first visit after deployment
- [ ] Manifest is accessible at `/.well-known/manifest.json` (optional fallback)
- [ ] Run Lighthouse audit to verify PWA score

## Common Issues & Solutions

### Issue: White/Blank Screen After Install

**Cause:** Service worker is serving stale or missing HTML
**Solution:** Clear cache in DevTools → Application → Clear site data

### Issue: Service Worker Not Updating

**Cause:** Browser still using old SW version
**Solution:** 
1. DevTools → Application → Clear all
2. Hard refresh (Ctrl+Shift+R)
3. Uninstall and reinstall app

### Issue: Icons Don't Show on Home Screen

**Cause:** Icon format or path issues
**Solution:**
- Ensure icons are valid PNG files
- Check paths in manifest.json match actual file locations
- Icons should be in `public/` folder
- Verify sizes: 192x192 and 512x512 (not scaled)

### Issue: Offline Page Shows Errors

**Cause:** Critical resources not cached before offline
**Solution:** 
1. List failed resources in browser console
2. Add them to `STATIC_ASSETS` array in `sw.js`
3. Redeploy

## Updating the PWA

### Increment Version for New Deployment

Edit `public/sw.js`:
```javascript
// Change this line:
const CACHE_VERSION = 'v1';
// To:
const CACHE_VERSION = 'v2';
```

This will:
1. Create fresh caches (v2)
2. Delete old caches (v1) on activation
3. Force all clients to re-download assets
4. Activate new SW immediately

### Zero-Downtime Updates

The current setup supports zero-downtime updates:
1. New SW activates with `skipWaiting()`
2. Current clients updated with `clients.claim()`
3. Refresh happens automatically
4. Users don't need to manually update

## Performance Optimization

**Current Setup Optimizations:**

1. **Versioned Caches** - Multiple cache stores for different content types
2. **Selective Caching** - Only cache successful responses
3. **Background Updates** - Users get instant loads with fresh data following
4. **Lazy Loading** - Only cache what's needed
5. **Resource Patterns** - Different strategies for different content types

**Additional Steps (Optional):**

1. **Enable Compression:**
   ```javascript
   // In next.config.mjs
   compress: true
   ```

2. **Pre-cache Critical Assets:**
   ```javascript
   const STATIC_ASSETS = [
     '/',
     '/manifest.json',
     // Add critical pages
     '/sherdor',
     '/barxan',
   ];
   ```

3. **Add Offline Page:**
   ```javascript
   // Create public/offline.html
   // Return it when network fails
   ```

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome (Desktop) | ✅ Full | Installable, all features |
| Chrome (Android) | ✅ Full | Best PWA support |
| Firefox | ✅ Good | All features except maskable icons |
| Safari (Desktop) | ⚠️ Limited | Service Worker not supported |
| Safari (iOS) | ✅ Good | Works via manifest, no offline |
| Edge | ✅ Full | Same as Chrome |
| Opera | ✅ Full | Same as Chrome |

## Monitoring & Debugging

### View Service Worker Activity

```javascript
// In browser console:
navigator.serviceWorker.ready.then(registration => {
  console.log('SW is active:', registration);
  console.log('SW state:', registration.active?.state);
});

// Check controlled clients
navigator.serviceWorker.controller && console.log('Page is controlled by SW');
```

### Clear Cache Programmatically

The service worker accepts messages to clear cache:

```javascript
// In your app
navigator.serviceWorker.controller?.postMessage({
  type: 'CLEAR_CACHE'
});
```

## Next Steps

1. Test the PWA on multiple devices (Android, iOS, Desktop)
2. Run Lighthouse audit and ensure 100/100 PWA score
3. Monitor console logs in production for any errors
4. Update version number in `sw.js` for future deployments
5. Consider adding offline page for better UX
6. Monitor cache size to prevent storage issues

---

**Last Updated:** March 2026
**Version:** 1.0.0

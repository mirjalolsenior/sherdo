# PWA Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment ✓

### Files & Structure
- [ ] `public/manifest.json` exists
- [ ] `public/sw.js` exists
- [ ] `public/icon-192.png` exists (192x192px)
- [ ] `public/icon-512.png` exists (512x512px)
- [ ] `public/robots.txt` exists
- [ ] `lib/pwa-utils.ts` exists
- [ ] `app/layout.tsx` updated with PWA metadata

### Configuration
- [ ] `next.config.mjs` has PWA headers configured
- [ ] `manifest.json` has correct theme_color (check your brand)
- [ ] `manifest.json` has correct start_url: "/"
- [ ] `manifest.json` icons reference correct paths
- [ ] Service Worker in `public/sw.js` (NOT in `pages/`)

### Service Worker Settings
- [ ] Check CACHE_VERSION in `public/sw.js`
- [ ] Verify STATIC_ASSETS list is complete
- [ ] Check API_ROUTES patterns for your endpoints
- [ ] Verify CACHE_FIRST_PATTERNS includes all asset types

## Local Testing

### Development
```bash
npm run dev
# Visit http://localhost:3000
# Check DevTools → Application → Service Workers
```

### Production Build
```bash
npm run build
npm run start
# Visit http://localhost:3000
```

**Checklist:**
- [ ] Build completes without errors: `npm run build`
- [ ] No console errors in DevTools
- [ ] Service Worker appears in DevTools
- [ ] Manifest.json is accessible at `/.well-known/manifest.json`
- [ ] Icons are accessible and load correctly

### DevTools Testing
1. **Application Tab**
   - [ ] Service Worker shows "activated and running"
   - [ ] Manifest is valid (no red ❌)
   - [ ] Icons load correctly

2. **Network Tab**
   - [ ] No 404 errors for manifest.json or sw.js
   - [ ] Icons load with 200 status
   - [ ] MIME types correct

3. **Offline Test**
   - [ ] Check "Offline" in Network tab
   - [ ] Refresh page - should still load
   - [ ] Navigate between pages - should work
   - [ ] Data pages (with API calls) show cached data or graceful fallback

### Lighthouse Audit
```bash
# In Chrome DevTools → Lighthouse
# Run "PWA" audit
```

**Target Scores:**
- [ ] PWA: 100/100
- [ ] Performance: 90+/100
- [ ] Accessibility: 90+/100
- [ ] Best Practices: 90+/100
- [ ] SEO: 90+/100

**Required for PWA 100:**
- [ ] Page is installable
- [ ] Web app manifest is valid
- [ ] Color scheme colors are defined
- [ ] Content is responsive
- [ ] Viewport meta tag configured
- [ ] Service Worker installed
- [ ] Works offline (200 response)
- [ ] Themed address bar
- [ ] Display mode standalone

### Mobile Testing

#### Android (Chrome)
- [ ] App installs successfully
- [ ] Opens without white flash
- [ ] Back button works correctly
- [ ] Works in offline mode
- [ ] Icons display correctly on home screen
- [ ] App name displays correctly

#### iOS (Safari)
- [ ] Add to Home Screen works
- [ ] App launches in fullscreen
- [ ] Navigation works properly
- [ ] Icons display correctly
- [ ] Splash screen shows

## Deployment

### To Netlify

1. **Prepare**
   - [ ] All files committed to Git
   - [ ] Build succeeds locally
   - [ ] No console errors

2. **Deploy**
   - [ ] Push to `main` branch (if auto-deploy enabled)
   - OR manually deploy: `netlify deploy --prod`

3. **Post-Deploy**
   - [ ] Visit production URL
   - [ ] Open DevTools and check Service Worker
   - [ ] Run Lighthouse audit again
   - [ ] Test offline mode
   - [ ] Test installation on mobile

### To Vercel

1. **Prepare**
   - [ ] All files committed to Git
   - [ ] Build succeeds locally
   - [ ] No console errors

2. **Deploy**
   - [ ] Push to GitHub (triggers auto-deploy)
   - [ ] OR use: `vercel --prod`

3. **Post-Deploy**
   - [ ] Visit production URL
   - [ ] Open DevTools and check Service Worker
   - [ ] Run Lighthouse audit again
   - [ ] Test offline mode
   - [ ] Test installation on mobile

### Other Hosting

1. **Ensure Files Served Correctly**
   - [ ] `public/manifest.json` → served as `/manifest.json`
   - [ ] `public/sw.js` → served as `/sw.js`
   - [ ] `public/icon-*.png` → served as `/icon-*.png`

2. **Set Correct Headers**
   ```
   manifest.json:
   - Content-Type: application/manifest+json
   - Cache-Control: public, max-age=0, must-revalidate

   sw.js:
   - Cache-Control: public, max-age=0, must-revalidate
   - Service-Worker-Allowed: /

   icons:
   - Cache-Control: public, max-age=31536000, immutable
   ```

3. **Security Headers**
   ```
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: SAMEORIGIN
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin
   ```

## Post-Deployment

### Monitor
- [ ] Check browser console for errors
- [ ] Monitor Service Worker registration in analytics
- [ ] Track installation rates (if you added tracking)
- [ ] Monitor cache hit rates

### Test On Real Devices
- [ ] Samsung Galaxy (Android 12+)
- [ ] iPhone 12+ (iOS 15+)
- [ ] Pixel 6 (Android 12+)
- [ ] iPad (iPadOS 15+)
- [ ] Windows laptop (Chrome/Edge)
- [ ] Mac (Chrome/Safari)

### User Communication
- [ ] Add install prompt (optional)
- [ ] Notify users about offline capability
- [ ] Explain update behavior
- [ ] Share PWA benefits

## Monitoring Checklist

### Daily
- [ ] No console errors in browser
- [ ] Service Worker still registered
- [ ] Cache not growing excessively

### Weekly
- [ ] Run Lighthouse audit
- [ ] Test offline functionality
- [ ] Verify installation on mobile device
- [ ] Check for any user-reported issues

### Before Each Deploy
- [ ] Increment CACHE_VERSION in sw.js
- [ ] Test build locally
- [ ] Run Lighthouse
- [ ] Test offline mode
- [ ] Verify manifest.json is valid

## Troubleshooting During Deployment

### Service Worker Not Appearing
```bash
# Check file exists
ls -la public/sw.js

# Check syntax
node -c public/sw.js

# Check manifest.json
cat public/manifest.json | jq .

# Clear browser cache
# DevTools → Application → Clear site data
```

### White Screen After Install
```bash
# In browser console:
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
location.reload();
```

### Cache Version Mismatch
```javascript
// In public/sw.js, increment version:
const CACHE_VERSION = 'v2'; // was 'v1'
```

### Icons Not Showing
1. Verify file size isn't huge
2. Check PNG is valid: `file public/icon-192.png`
3. Verify dimensions: `identify public/icon-192.png`
4. Check manifest.json syntax: `jq . public/manifest.json`

## Rollback Plan

If something breaks:

1. **Immediate (Quick Fix)**
   ```bash
   # Unregister service worker temporarily
   # Users can still use app, just not cached
   ```

2. **Short Term (1 hour)**
   ```bash
   # Revert manifest.json to previous version
   # Clear CACHE_VERSION or reset to v0
   npm run build && deploy
   ```

3. **Long Term (next day)**
   ```bash
   # Fix root cause
   # Test thoroughly locally
   # Deploy with new version number
   ```

## Performance Targets

After deployment, monitor these metrics:

| Metric | Target | How to Measure |
|--------|--------|---|
| First Load | <3s | DevTools → Network |
| Repeat Visit | <500ms | DevTools → Network (with cache) |
| Offline Load | <100ms | DevTools offline mode |
| Lighthouse PWA | 100 | Chrome DevTools → Lighthouse |
| Lighthouse Performance | 90+ | Chrome DevTools → Lighthouse |
| Cache Size | <50MB | `getCacheInfo()` in console |

## Maintenance

### Monthly
- [ ] Check for new updates to dependencies
- [ ] Review error logs
- [ ] Analyze cache hit rates
- [ ] Update CACHE_VERSION if needed

### Quarterly
- [ ] Full Lighthouse audit
- [ ] Security review
- [ ] Performance profiling
- [ ] User feedback review

### Annually
- [ ] PWA feature audit (new features available?)
- [ ] Browser compatibility review
- [ ] Update manifest.json if needed
- [ ] Review service worker strategies

## Success Criteria ✓

Your PWA deployment is successful when:

✅ Service Worker is registered and active
✅ All icons load correctly
✅ Manifest.json is valid and accessible
✅ App works completely offline
✅ Installation works on Android and iOS
✅ Lighthouse PWA score is 100/100
✅ No console errors
✅ Cache updates automatically with new versions
✅ Performance targets met
✅ Users can install and use the app

---

**Checklist Version:** 1.0.0
**Last Updated:** March 2026

**Need Help?** See PWA_SETUP.md or PWA_IMPLEMENTATION.md

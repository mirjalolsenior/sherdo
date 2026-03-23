# PWA Architecture & Caching Flow

Visual guide to how your PWA works.

## System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      User's Device                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Browser / Installed PWA App                 │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Sherdor Toyxonasi UI (React Components)       │  │  │
│  │  │  - Event Management Pages                      │  │  │
│  │  │  - Payment Tracking                            │  │  │
│  │  │  - Admin Dashboard                             │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                        ▲                               │  │
│  │                        │ Requests                      │  │
│  │                        ▼                               │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Service Worker (sw.js)                        │  │  │
│  │  │  - Intercepts all requests                     │  │  │
│  │  │  - Applies caching strategy                    │  │  │
│  │  │  - Handles offline scenarios                   │  │  │
│  │  │  - Manages versioned caches                    │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │       ▲                            ▲                  │  │
│  │       │ Cache Hit                  │ Cache Miss       │  │
│  │       │                            │                  │  │
│  │  ┌────┴────────────────┐  ┌────────┴──────────────┐  │  │
│  │  │                     │  │                       │  │  │
│  │  ▼                     │  ▼                       │  │  │
│  │ Browser Cache         │  Network Request        │  │  │
│  │ - static-v1           │  │                       │  │  │
│  │ - dynamic-v1          │  └────────────┬──────────┘  │  │
│  │ - api-v1              │               │              │  │
│  │                       │               ▼              │  │
│  │ (Indexed DB)          │  ┌────────────────────────┐ │  │
│  │                       │  │   Supabase API / CDN   │ │  │
│  │                       │  │   - Fresh data         │ │  │
│  │                       │  │   - Updates            │ │  │
│  │                       │  │   - Real-time events   │ │  │
│  │                       │  └────────────────────────┘ │  │
│  │                       └──────────────────────────────┘  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└────────────────────────────────────────────────────────────┘
         │                              ▲
         │ Offline                      │ Online
         ▼                              │
    ✅ App Works            ──────────────┘
    ✅ Uses Cache
    ✅ No Network Needed
```

## Request Flow by Content Type

### 1. API Requests (Network First)

```
User Action
    │
    ▼
Service Worker Intercepts
    │
    ├─ Network Available? ──YES──> Fetch from Server
    │                                    │
    │                                    ├─ Success?
    │                                    │  ├─ YES: Cache + Return
    │                                    │  └─ NO: Return cached or error
    │
    └─ No Network ─────────────────> Return Cached Data
                                        │
                                        ├─ Found?
                                        │  ├─ YES: Return
                                        │  └─ NO: Error message

Used for: /api/*, real-time data, form submissions
```

### 2. Static Assets (Cache First)

```
User Request
    │
    ▼
Service Worker Checks Cache
    │
    ├─ In Cache? ───YES──> Return Immediately ✓ FAST
    │                           │
    │                           └─ Fetch in Background
    │                               Update cache (silent)
    │
    └─ Not in Cache ────> Fetch from Network
                              │
                              ├─ Success?
                              │  ├─ YES: Cache + Return
                              │  └─ NO: Return placeholder
```

Used for: images, CSS, JavaScript, fonts, icons

### 3. HTML Pages (Network First + Fallback)

```
User Navigates
    │
    ▼
Service Worker Intercepts
    │
    ├─ Network Available? ──YES──> Fetch Latest HTML
    │                                    │
    │                                    ├─ Success?
    │                                    │  ├─ YES: Cache + Return
    │                                    │  └─ NO: Use cached
    │
    └─ No Network ─────────────────> Return Cached HTML
                                        │
                                        ├─ Found?
                                        │  ├─ YES: Return
                                        │  └─ NO: Return home page
```

Used for: page navigation, direct URLs

### 4. Other Resources (Stale While Revalidate)

```
User Request
    │
    ▼
Service Worker
    │
    ├─ Return Cached Version Immediately
    │       │
    │       └─ User gets instant response
    │
    └─ Fetch Fresh Version in Background
            │
            ├─ Success?
            │  ├─ YES: Update cache
            │  │       Next request gets fresh data
            │  └─ NO: Keep using old cache

Used for: everything else
```

## Cache Structure

```
┌─────────────────────────────────────────────────────┐
│              Browser's IndexedDB                     │
│  (Accessed by Service Worker)                       │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Cache: static-v1                             │   │
│  │ ├─ /icon-192.png                             │   │
│  │ ├─ /icon-512.png                             │   │
│  │ ├─ /_next/static/chunks/main.js              │   │
│  │ ├─ /manifest.json                            │   │
│  │ └─ /_next/static/css/...                     │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Cache: dynamic-v1                            │   │
│  │ ├─ / (home page HTML)                        │   │
│  │ ├─ /sherdor (events page HTML)               │   │
│  │ ├─ /barxan (events page HTML)                │   │
│  │ ├─ /_next/static/chunks/...                  │   │
│  │ └─ ... (user-generated pages)                │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Cache: api-v1                                │   │
│  │ ├─ /api/events                               │   │
│  │ ├─ /api/payments                             │   │
│  │ └─ ... (API responses)                       │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Update Flow

### First Visit

```
User Visits App
    │
    ▼
Service Worker Registers
    │
    ├─ sw.js downloaded
    ├─ Installation starts
    ├─ Static assets cached
    │
    ▼
Service Worker Activated
    │
    ├─ skipWaiting() called (doesn't wait)
    ├─ clients.claim() called (takes control)
    ├─ Old caches deleted (if any)
    │
    ▼
App Ready
    │
    └─ Next requests use caching strategies
```

### New Version Deployed (Cache Version Incremented)

```
User Visits App
    │
    ▼
Background Check (every 60s)
    │
    ├─ New sw.js detected?
    │
    ▼
New Service Worker Installs
    │
    ├─ New caches created (v2)
    ├─ Static assets re-cached
    │
    ▼
New Service Worker Activates
    │
    ├─ skipWaiting() - activate immediately
    ├─ clients.claim() - control all clients
    ├─ Delete old caches (v1)
    │
    ▼
Next Request Gets New Content
    │
    └─ User sees updated version
```

## Offline vs Online Behavior

### Online Mode

```
┌─────────────────────────────────────┐
│         Online - Connected          │
│                                     │
│  Request → Network First ──────────>│
│              ✓ Check Server         │
│              ✓ Fresh Data           │
│              ✓ Update Cache         │
│              ✓ User Sees Latest     │
│                                     │
└─────────────────────────────────────┘
```

### Offline Mode

```
┌─────────────────────────────────────┐
│      Offline - No Connection        │
│                                     │
│  Request → Cache Only ──────────────>│
│            ✓ Instant Response       │
│            ✓ Uses Cached Data       │
│            ✓ App Still Works        │
│            ✓ No Network Needed      │
│                                     │
└─────────────────────────────────────┘
```

### Transitioning Online

```
Offline  ───────────────>  Online
  │                          │
  ├─ Cached data shown       ├─ Fresh data fetches
  ├─ User actions queued     ├─ Cache updates
  └─ Features limited        └─ Full functionality
```

## Performance Timeline

### First Load (with caching)

```
Time: 0s  ───────────────────────────────────────> 3s
Action:   Navigate to app
          │
          ├─ HTML starts downloading
          │  │
          │  ├─ Service Worker registers (background)
          │  │
          │  ├─ React loads and renders
          │  │  └─ Display basic structure
          │  │
          │  └─ Static assets load
          │      └─ CSS/JS/Images cached
          │
          └─ Page complete and interactive
             └─ Service Worker activated

Result: ✅ App fully loaded and cached
```

### Repeat Load (with cache)

```
Time: 0s  ─────────────> 0.3s
Action:   Navigate to app
          │
          ├─ Service Worker intercepts
          │  └─ Checks cache
          │
          ├─ Cache hit! Serve cached files
          │  └─ HTML served from cache (instant)
          │  └─ CSS/JS/Images from cache
          │
          └─ Page complete and interactive

Result: ⚡ Blazing fast (cached)
```

### Offline Load

```
Time: 0s  ──> 0.1s
Action:   Navigate to app
          │
          ├─ Service Worker intercepts
          │  └─ No network, use cache
          │
          ├─ All files served from cache
          │  └─ Instant response
          │
          └─ Page loads immediately

Result: 🔥 Ultra fast (fully cached, no network)
```

## Cache Versioning

```
Version 1 Deployed
    │
    ├─ Cache: static-v1, dynamic-v1, api-v1
    ├─ Users' browsers cache everything
    │
    ▼
New Features Added
    │
    ├─ Change in sw.js: 'v1' → 'v2'
    ├─ Commit & Deploy
    │
    ▼
User Visits App (next 60s)
    │
    ├─ Browser detects sw.js change
    ├─ New SW activates
    │
    ▼
Cache Cleanup
    │
    ├─ Delete: static-v1, dynamic-v1, api-v1
    ├─ Create: static-v2, dynamic-v2, api-v2
    │
    ▼
Fresh Assets Cached
    │
    └─ User gets new version automatically
        └─ No manual refresh needed!
```

## Installation Flow

### Android Chrome

```
User Visits App
    │
    └─ Criteria Met?
       ├─ Has HTTPS ✓
       ├─ Has manifest.json ✓
       ├─ Has service worker ✓
       ├─ Icons available ✓
       │
       ▼
    "Install" Button Appears
    (in address bar or menu)
       │
    User Clicks Install
       │
       ├─ Show install prompt
       ├─ User confirms
       │
       ▼
    App Installed
       │
       ├─ Icon on home screen
       ├─ Launches in fullscreen
       ├─ Works offline
       │
       └─ ✅ Now a "Native-like" App
```

### iOS Safari

```
User Visits App
    │
    └─ No automatic install prompt
       (iOS limitation)
       │
       ▼
    User Taps Share
       │
       ├─ "Add to Home Screen" appears
       │
       ▼
    User Confirms
       │
       ├─ Icon added to home screen
       ├─ Launches with manifest settings
       │
       └─ ✅ Works like web app
           (offline not supported, but manifest works)
```

## Error Handling

```
Request Fails
    │
    ├─ Network Error?
    │  └─ Cached available?
    │     ├─ YES: Return cache
    │     └─ NO: Fallback response
    │
    ├─ 404 Error?
    │  └─ Return placeholder
    │
    ├─ 503 Error?
    │  └─ Return offline message
    │
    └─ Other Error?
       └─ Return cached or generic error
```

## Browser Support

```
Chrome/Edge/Opera
├─ ✅ Service Worker
├─ ✅ Install Prompt
├─ ✅ Offline Support
├─ ✅ Background Sync
└─ ✅ Notifications

Firefox
├─ ✅ Service Worker
├─ ✅ Install (can add)
├─ ✅ Offline Support
├─ ⚠️ Maskable Icons (partial)
└─ ⚠️ Advanced features

Safari (iOS/Mac)
├─ ⚠️ Service Worker (macOS only)
├─ ✅ Manifest support
├─ ✅ Add to Home Screen
├─ ❌ Offline (file-based only)
└─ ❌ Advanced features

IE 11
├─ ❌ Not supported
└─ → Use modern browser

Mobile Browsers
├─ ✅ Chrome Android
├─ ✅ Firefox Android
├─ ✅ Safari iOS (manifest only)
└─ ✅ Opera Android
```

## Key Metrics

### Cache Statistics

```
Typical Cache Sizes:
├─ static-v1: 2-5 MB (CSS, JS, images)
├─ dynamic-v1: 1-3 MB (HTML pages)
├─ api-v1: 0.5-1 MB (API responses)
└─ Total: 3.5-9 MB

Device Limits:
├─ Chrome: ~500 MB per origin
├─ Firefox: ~500 MB per origin  
├─ Safari: ~50 MB per origin
└─ Edge: ~500 MB per origin
```

### Performance Metrics

```
Metric                  First Load    Repeat Load    Offline
─────────────────────────────────────────────────────────────
Time to Interactive    2-3 seconds   <500ms         <100ms
Bandwidth Used         2-5 MB        ~50 KB         0 KB
Network Requests       20-30         5-10           0
Cache Hits             0             80-95%         100%
User Experience        Good          Excellent      Perfect
```

---

**This diagram helps you understand how your PWA works internally. Refer to it when:**
- Wondering where files come from
- Debugging cache issues
- Optimizing performance
- Explaining to others how it works

**Visual Legend:**
- `─────>` = Request/response flow
- `├─` = Decision point
- `✓` = Condition met
- `✅` = Success state
- `⚡` = Performance indicator
- `🔥` = Excellent performance

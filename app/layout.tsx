import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sherdor Toyxonasi - Event Manager',
  description: 'Professional event and payment management system for Sherdor and Barxan ceremonies',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    apple: '/icon-192.png',
    shortcut: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sherdor Toyxonasi',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  keywords: ['event management', 'payment tracking', 'ceremonies', 'sherdor', 'barxan'],
  authors: [{ name: 'Sherdor Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Sherdor Toyxonasi - Event Manager',
    description: 'Professional event and payment management system for ceremonies',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Sherdor Logo',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
  minimumScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Event Manager" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}

function ServiceWorkerRegistration() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then((registration) => {
                  console.log('[PWA] Service Worker registered successfully:', registration);
                  
                  // Check for updates periodically
                  setInterval(() => {
                    registration.update().catch(err => {
                      console.error('[PWA] Failed to check for SW updates:', err);
                    });
                  }, 60000); // Check every minute
                })
                .catch((err) => {
                  console.error('[PWA] Service Worker registration failed:', err);
                });
              
              // Listen for controller change (new SW activated)
              navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('[PWA] New Service Worker activated');
              });
            });
            
            // Handle update available message
            if (navigator.serviceWorker.controller) {
              navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                  console.log('[PWA] Update available');
                  // Optional: Notify user about update
                }
              });
            }
          }
        `,
      }}
    />
  );
}

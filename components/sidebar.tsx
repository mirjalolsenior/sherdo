'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: '/sherdor', label: t('sherdor') },
    { href: '/barxan', label: t('barxan') },
    { href: '/qidiruv', label: t('qidiruv') },
    { href: '/hisobotlar', label: t('hisobotlar') },
    { href: '/arxiv', label: t('arxiv') },
    { href: '/admin', label: t('admin') },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const navIcons = {
    '/sherdor': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>,
    '/barxan': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    '/qidiruv': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    '/hisobotlar': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    '/arxiv': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    '/admin': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 bg-gradient-to-b from-sidebar to-sidebar/95 border-r border-sidebar-border h-screen flex-col fixed left-0 top-0 backdrop-blur-xl">
        <div className="p-6 border-b border-sidebar-border/50 flex items-center justify-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('appTitle') || 'Toyxona'}</h1>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">{t('navigation')}</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 font-semibold'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/10 border border-transparent'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={active ? 'text-primary' : 'text-muted-foreground'}>{navIcons[item.href as keyof typeof navIcons]}</span>
                  <span>{item.label}</span>
                  {active && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-sidebar-border/50 p-4 space-y-3">
          <button
            onClick={() => setLanguage(language === 'uz' ? 'en' : 'uz')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sidebar-accent/20 text-sidebar-foreground hover:bg-sidebar-accent/30 transition-colors border border-sidebar-accent/30 font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502-.684l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v1M3 5v6h18V5" />
            </svg>
            {language.toUpperCase()}
          </button>
        </div>
      </nav>

      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-card border-b border-border p-4 z-40 flex items-center justify-between backdrop-blur-xl">
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('appTitle') || 'Toyxona'}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'uz' ? 'en' : 'uz')}
            className="px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold transition-colors"
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-border rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Sidebar Menu */}
      {isOpen && (
        <nav className="fixed left-0 top-16 h-screen w-48 bg-card border-r border-border flex flex-col p-4 z-35 md:hidden">
          <div className="space-y-1 flex-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 font-semibold'
                      : 'text-foreground hover:bg-secondary/10 border border-transparent'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={active ? 'text-primary' : 'text-muted-foreground'}>{navIcons[item.href as keyof typeof navIcons]}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}

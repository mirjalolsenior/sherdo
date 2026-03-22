'use client';

import { useState, useEffect } from 'react';
import { type Language, translations } from '@/lib/translations';

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>('uz');

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'uz' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof typeof translations.uz): string => {
    return translations[language][key] || key;
  };

  return {
    language,
    setLanguage,
    t,
  };
}

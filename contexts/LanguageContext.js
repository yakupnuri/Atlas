'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { defaultLocale, getLocaleFromStorage, setLocaleInStorage } from '@/lib/i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(defaultLocale);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial locale from storage
    const savedLocale = getLocaleFromStorage();
    setLocale(savedLocale);
    loadTranslations(savedLocale);
  }, []);

  const loadTranslations = async (loc) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/translations/${loc}`);
      const data = await response.json();
      setTranslations(data.translations || {});
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to default
      try {
        const fallback = await import(`@/messages/${loc}.json`);
        setTranslations(fallback.default);
      } catch (e) {
        console.error('Fallback failed:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    setLocaleInStorage(newLocale);
    loadTranslations(newLocale);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLocale, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

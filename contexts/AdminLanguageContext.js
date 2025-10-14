'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { adminDefaultLocale, getAdminLocaleFromStorage, setAdminLocaleInStorage } from '@/lib/i18n';

const AdminLanguageContext = createContext();

export function AdminLanguageProvider({ children }) {
  const [locale, setLocale] = useState(adminDefaultLocale);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLocale = getAdminLocaleFromStorage();
    setLocale(savedLocale);
    loadTranslations(savedLocale);
  }, []);

  const loadTranslations = async (loc) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/translations/admin/${loc}`);
      const data = await response.json();
      setTranslations(data.translations || {});
    } catch (error) {
      console.error('Error loading admin translations:', error);
      try {
        const fallback = await import(`@/messages/admin-${loc}.json`);
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
    setAdminLocaleInStorage(newLocale);
    loadTranslations(newLocale);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value || key;
  };

  return (
    <AdminLanguageContext.Provider value={{ locale, changeLocale, t, loading }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error('useAdminLanguage must be used within AdminLanguageProvider');
  }
  return context;
}

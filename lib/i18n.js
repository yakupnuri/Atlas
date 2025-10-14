// i18n configuration
export const locales = ['nl', 'en', 'tr'];
export const defaultLocale = 'nl';
export const adminDefaultLocale = 'tr';

export const localeNames = {
  nl: { name: 'Nederlands', flag: '🇳🇱', nativeName: 'Nederlands' },
  en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
  tr: { name: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe' },
};

export function getLocaleFromStorage() {
  if (typeof window === 'undefined') return defaultLocale;
  return localStorage.getItem('locale') || defaultLocale;
}

export function setLocaleInStorage(locale) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
}

export function getAdminLocaleFromStorage() {
  if (typeof window === 'undefined') return adminDefaultLocale;
  return localStorage.getItem('adminLocale') || adminDefaultLocale;
}

export function setAdminLocaleInStorage(locale) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adminLocale', locale);
}

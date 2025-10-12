'use client'

import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { localeNames } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { locale, changeLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const availableLocales = ['nl', 'en', 'tr'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-[#05B6C4] transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{localeNames[locale]?.flag}</span>
        <span className="hidden lg:inline text-sm">{localeNames[locale]?.name}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
            {availableLocales.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  changeLocale(loc);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between transition-colors ${
                  locale === loc ? 'bg-blue-50 text-[#05B6C4]' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{localeNames[loc]?.flag}</span>
                  <span className="text-sm font-medium">{localeNames[loc]?.name}</span>
                </div>
                {locale === loc && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

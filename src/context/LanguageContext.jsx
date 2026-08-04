import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations as es } from '../translations/es';
import { translations as en } from '../translations/en';

export const LanguageContext = createContext();

const DICTS = { es, en };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved === 'en' ? 'en' : 'es';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => setLanguageState(lang === 'en' ? 'en' : 'es');
  const toggleLanguage = () => setLanguageState((prev) => (prev === 'es' ? 'en' : 'es'));

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t: DICTS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = () => useContext(LanguageContext).t;
export const useLanguage = () => useContext(LanguageContext);

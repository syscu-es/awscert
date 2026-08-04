import React from 'react';
import { useLanguage, useTranslations } from '../context/LanguageContext';

const LanguageToggle = ({ isDarkMode, className = '' }) => {
  const { language, toggleLanguage } = useLanguage();
  const translations = useTranslations();

  return (
    <button
      onClick={toggleLanguage}
      className={`px-3 py-2 rounded-lg font-bold text-xs tracking-wider transition-colors ${
        isDarkMode ? 'glass text-slate-200 hover:border-[#00C9DB]/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      } ${className}`}
      title={language === 'es' ? translations.menu.languageSwitchToEn : translations.menu.languageSwitchToEs}
    >
      {language === 'es' ? 'EN' : 'ES'}
    </button>
  );
};

export default LanguageToggle;

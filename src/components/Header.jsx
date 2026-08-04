import React, { useState, useContext } from 'react';
import { X, Clock, ClipboardCheck, Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslations } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Header = ({ onBack, quizConfig, domains, timeLeft, formatTime, quizFinished, finishQuiz }) => {
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const translations = useTranslations();

  const domainMeta = domains?.find((d) => d.number === quizConfig?.domainId);
  const domainTitle = domainMeta
    ? `${translations.menu.domainWord} ${domainMeta.number}: ${domainMeta.title}`
    : `${translations.menu.domainWord} ${quizConfig?.domainId}`;

  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .modal-overlay {
      animation: fadeIn 0.2s ease-in-out;
    }
    .modal-content {
      animation: zoomIn 0.3s ease-in-out;
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
    <nav className={`border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? 'glass border-slate-700' : 'bg-white/90 backdrop-blur border-slate-200'}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowAbandonDialog(true)}
          className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/5 text-slate-400 hover:text-red-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <X className="w-5 h-5" />
        </button>
        <div className={`h-6 w-[1px] ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} mx-2`} />
        <h2 className={`font-display font-bold hidden sm:block ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
          {quizConfig?.type === 'domain' ? domainTitle : translations.header.certificationExam}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <LanguageToggle isDarkMode={isDarkMode} />
        <button
          onClick={() => toggleTheme()}
          className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'glass text-slate-200 hover:border-[#00C9DB]/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          title={isDarkMode ? translations.header.switchToLight : translations.header.switchToDark}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold ${isDarkMode ? 'glass text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
          <Clock className="w-4 h-4 text-[#FF9900]" />
          {formatTime(timeLeft)}
        </div>
        {!quizFinished && (
          <button
            onClick={finishQuiz}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <ClipboardCheck className="w-4 h-4" />
            {translations.header.finish}
          </button>
        )}
      </div>
    </nav>

    {showAbandonDialog && (
      <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`modal-content rounded-2xl p-8 max-w-md shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{translations.header.abandonTest}</h3>
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{translations.header.abandonConfirm}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAbandonDialog(false)}
              className={`flex-1 py-2 rounded-lg font-bold transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              {translations.header.cancel}
            </button>
            <button
              onClick={() => {
                setShowAbandonDialog(false);
                onBack();
              }}
              className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors"
            >
              {translations.header.abandon}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Header;

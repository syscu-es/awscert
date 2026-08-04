import React, { useState, useContext, useEffect } from 'react';
import { Flag, BookMarked, Info } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { translations } from '../translations/es';

const QuestionPanel = ({
  currentQ,
  currentIndex,
  flags,
  setFlags,
  notes,
  setNotes,
  userAns,
  showFeedback,
  quizConfig,
  onSubmit,
  excludedAnswers,
  setExcludedAnswers,
  quizFinished,
  handleAdvanceQuestion, // New prop
  goToNextQuestion,
  goToPreviousQuestion,
  questions,
}) => {
  const [showNotesBox, setShowNotesBox] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const [tempAns, setTempAns] = useState(userAns || []);
  const [tempExcluded, setTempExcluded] = useState([]);

  useEffect(() => {
    setTempAns(userAns || []);
    setTempExcluded((prev) => []);
  }, [currentIndex]);

  useEffect(() => {
    if (typeof excludedAnswers !== 'undefined') {
      const e = excludedAnswers[currentIndex] || [];
      setTempExcluded(e);
    }
  }, [currentIndex, excludedAnswers]);

  const isUserCorrect = (() => {
    try {
      const ua = (userAns || []).slice().sort();
      const ca = (currentQ.correct || []).slice().sort();
      return JSON.stringify(ua) === JSON.stringify(ca);
    } catch (e) {
      return false;
    }
  })();

  // New useEffect for automatic advance
  useEffect(() => {
    let timer;
    if (quizConfig?.type === 'domain' && showFeedback) { // Only for domain quizzes with feedback
      timer = setTimeout(() => {
        handleAdvanceQuestion();
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [showFeedback, quizConfig, handleAdvanceQuestion]);


  const Feedback = ({ isUserCorrect, currentQ }) => (
    <div className={`p-4 rounded-2xl mb-6 ${isUserCorrect ? isDarkMode ? 'bg-slate-700 border border-slate-600 text-emerald-400' : 'bg-emerald-50 border border-emerald-100 text-emerald-800' : isDarkMode ? 'bg-slate-700 border border-slate-600 text-red-400' : 'bg-red-50 border border-red-100 text-red-800'}`}>
      <div className="flex items-start gap-3">
        <div>
          <p className="font-bold mb-1">{isUserCorrect ? translations.questionPanel.correct : translations.questionPanel.incorrect}</p>
          <p className="text-sm opacity-90 mb-2">{translations.questionPanel.explanation}: {currentQ.correct.map(i => String.fromCharCode(65 + i)).join(', ')} - {currentQ.correct.map(i => currentQ.options[i]).join('; ')}</p>
          <p className="text-sm opacity-90">{currentQ.explanation}</p>
        </div>
      </div>
    </div>
  );

  if (!currentQ) return null;

  const animationStyles = `
    @keyframes slideDown {
      from {
        opacity: 0;
        max-height: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        max-height: 500px;
        transform: translateY(0);
      }
    }
    @keyframes slideUp {
      from {
        opacity: 1;
        max-height: 500px;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        max-height: 0;
        transform: translateY(-10px);
      }
    }
    .notes-box {
      animation: ${showNotesBox ? 'slideDown' : 'slideUp'} 0.3s ease-in-out forwards;
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isDarkMode ? 'text-slate-400 bg-slate-700' : 'text-slate-400 bg-slate-100'}`}>
            {translations.questionPanel.question} {currentIndex + 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setFlags({...flags, [currentIndex]: !flags[currentIndex]})}
              className={`p-2 rounded-lg border transition-all ${flags[currentIndex] ? isDarkMode ? 'bg-orange-900 border-orange-700 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-500' : isDarkMode ? 'bg-slate-700 text-slate-400 border-slate-600 hover:border-slate-500' : 'text-slate-400 border-slate-200 hover:border-slate-300'}`}
              title={translations.questionPanel.flag}
            >
              <Flag className={`w-5 h-5 ${flags[currentIndex] ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setShowNotesBox(!showNotesBox)}
              className={`p-2 rounded-lg border transition-all ${showNotesBox ? isDarkMode ? 'bg-blue-900 border-blue-700 text-blue-400' : 'bg-blue-50 border-blue-200' : isDarkMode ? 'bg-slate-700 text-slate-400 border-slate-600 hover:border-slate-500' : 'text-slate-400 border-slate-200 hover:border-slate-300'}`}
              title={translations.questionPanel.notes}
            >
              <BookMarked className={`w-5 h-5 ${showNotesBox ? isDarkMode ? 'text-blue-400' : 'text-blue-500' : isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>

        <h3 className={`text-2xl font-semibold leading-snug mb-8 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          {currentQ.text}
        </h3>

        {/* Notes box with animation */}
        {showNotesBox && (
          <div className="notes-box">
            <textarea
              placeholder={translations.questionPanel.addNote}
              value={notes[currentIndex] || ''}
              onChange={(e) => setNotes({...notes, [currentIndex]: e.target.value})}
              className={`w-full p-4 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all border ${isDarkMode ? 'bg-slate-700 border-blue-600 text-white' : 'bg-slate-50 border-blue-200'}`}
              rows={3}
              autoFocus
            />
          </div>
        )}

        <div className="space-y-4 mb-6">
          {currentQ.options.map((opt, idx) => {
            const isSelected = showFeedback ? userAns.includes(idx) : tempAns.includes(idx);
            const isCorrect = currentQ.correct.includes(idx);
            let stateStyle = isDarkMode ? "glass border-slate-700 text-slate-200 hover:border-[#FF9900]/60" : "bg-white border-slate-200 text-slate-700 hover:border-orange-300";

            const isExcluded = tempExcluded.includes(idx);

            if (isSelected) stateStyle = isDarkMode ? "glass border-[#FF9900] text-orange-200 ring-1 ring-[#FF9900]" : "bg-orange-50 border-orange-500 text-orange-900 ring-1 ring-orange-500";
            if (isExcluded) stateStyle = isDarkMode ? "bg-slate-800/60 border-slate-700 text-slate-500 line-through" : "bg-slate-100 border-slate-200 text-slate-400 line-through";
            if (quizConfig?.immediateFeedback && showFeedback) {
              if (isCorrect) stateStyle = isDarkMode ? "glass border-emerald-500 text-emerald-300 ring-2 ring-emerald-500" : "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500";
              else if (isSelected && !isCorrect) stateStyle = isDarkMode ? "glass border-red-500 text-red-300 ring-2 ring-red-500" : "bg-red-50 border-red-500 text-red-900 ring-2 ring-red-500";
            }

            const disabled = quizFinished || (quizConfig?.type === 'domain' && showFeedback) || isExcluded;

            const maxSelectionsReached = currentQ.type === 'multiple' && tempAns.length >= 2 && !tempAns.includes(idx);

            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (disabled || maxSelectionsReached) return;
                    if (currentQ.type === 'single') setTempAns([idx]);
                    else setTempAns(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
                  }
                }}
                onClick={() => {
                  if (disabled || maxSelectionsReached) return;
                  if (isExcluded) {
                    const parentExcluded = (typeof excludedAnswers !== 'undefined' && excludedAnswers) ? excludedAnswers : {};
                    const next = tempExcluded.filter(i => i !== idx);
                    setTempExcluded(next);
                    if (setExcludedAnswers) setExcludedAnswers({ ...parentExcluded, [currentIndex]: next });
                    return;
                  }
                  if (currentQ.type === 'single') setTempAns([idx]);
                  else setTempAns(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
                }}
                aria-disabled={disabled || maxSelectionsReached}
                className={`w-full flex items-center p-5 rounded-2xl border transition-all text-left shadow-sm ${stateStyle} ${disabled || maxSelectionsReached ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0 ${
                  quizConfig?.immediateFeedback && showFeedback
                    ? isCorrect ? isDarkMode ? 'bg-emerald-500 text-white' : 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    : isSelected ? 'bg-orange-500 text-white' : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="font-medium">{opt}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const parentExcluded = (typeof excludedAnswers !== 'undefined' && excludedAnswers) ? excludedAnswers : {};
                    if (tempExcluded.includes(idx)) {
                      const next = tempExcluded.filter(i => i !== idx);
                      setTempExcluded(next);
                      if (setExcludedAnswers) setExcludedAnswers({ ...parentExcluded, [currentIndex]: next });
                    } else {
                      const next = [...tempExcluded, idx];
                      setTempExcluded(next);
                      if (setExcludedAnswers) setExcludedAnswers({ ...parentExcluded, [currentIndex]: next });
                      setTempAns(prev => prev.filter(i => i !== idx));
                    }
                  }}
                  title={isExcluded ? translations.sidebar.restoreAnswer : translations.sidebar.eliminateAnswer}
                  className="ml-3 text-sm text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            );
          })}

        {quizConfig && quizConfig.immediateFeedback && showFeedback && (
          <Feedback isUserCorrect={isUserCorrect} currentQ={currentQ} />
        )}

        <div className="mt-4 mb-6">
          {currentQ.type === 'multiple' && tempAns.length > 2 && (
            <div className="text-xs text-red-600 mb-2">Has seleccionado más de 2 opciones. Reduce tus opciones para continuar.</div>
          )}
          {quizConfig?.type !== 'full' && (
            <button
              onClick={() => onSubmit && onSubmit(tempAns)}
              disabled={quizFinished || JSON.stringify(tempAns.slice().sort()) === JSON.stringify((userAns || []).slice().sort()) || (currentQ.type === 'multiple' && tempAns.length > 2)}
              className="w-full py-3 bg-gradient-to-r from-[#FF9900] to-[#FF6B2C] text-[#14110A] rounded-xl font-bold transition-all hover:shadow-[0_0_36px_rgba(255,153,0,0.4)] disabled:opacity-50 disabled:shadow-none"
            >
              {translations.questionPanel.continue}
            </button>
          )}
          {quizConfig?.type === 'full' && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Update user answers before navigating
                  onSubmit && onSubmit(tempAns);
                  // Navigate to previous question using parent function
                  goToPreviousQuestion && goToPreviousQuestion();
                }}
                disabled={currentIndex === 0}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 ${
                  currentIndex === 0 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-slate-500 hover:bg-slate-600 text-white'
                }`}
              >
                {translations.sidebar.previous}
              </button>
              <button
                onClick={() => {
                  // Update user answers before navigating
                  onSubmit && onSubmit(tempAns);
                  // Navigate to next question using parent function
                  goToNextQuestion && goToNextQuestion();
                }}
                disabled={currentIndex === questions.length - 1}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 ${
                  currentIndex === questions.length - 1 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {translations.sidebar.next}
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default QuestionPanel;
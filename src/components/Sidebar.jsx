import React, { useContext } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslations } from '../context/LanguageContext';

const Sidebar = ({
  currentQ,
  questions,
  currentIndex,
  setCurrentIndex,
  flags,
  userAnswers,
  setShowFeedback,
  quizConfig,
  reviewOpen,
  setReviewOpen,
  reviewAcknowledged,
  setReviewAcknowledged,
  finalizeFinish,
  quizFinished,
  notes
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const translations = useTranslations();

  if (!currentQ) return null;

  return (
    <div className="max-w-md mx-auto h-full flex flex-col">
      {!quizFinished ? (
        <>
            {reviewOpen ? (
              <div className="space-y-4 mb-6">
                <h4 className="font-bold mb-3">{translations.sidebar.review}</h4>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {questions.map((q, idx) => {
                    const ans = userAnswers[idx] || [];
                    const hasAnswer = ans && ans.length > 0;
                    return (
                      <div key={idx} className={`p-3 rounded-lg border ${hasAnswer ? isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white' : isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50'} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <button onClick={() => { setCurrentIndex(idx); setShowFeedback(false); }} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-100'}`}>{idx+1}</button>
                          <div>
                            <div className="text-sm font-medium">{translations.questionPanel.question} {idx + 1}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{hasAnswer ? translations.sidebar.answered : translations.sidebar.unanswered}</div>
                          </div>
                        </div>
                        <div>
                          {hasAnswer ? <span className="text-sm text-emerald-600 font-bold">{translations.sidebar.answered}</span> : <span className="text-sm text-red-600 font-bold">{translations.sidebar.open}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={reviewAcknowledged} onChange={(e) => setReviewAcknowledged(e.target.checked)} />
                    <span className="text-sm">{translations.sidebar.acknowledgeReview}</span>
                  </label>
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={() => { setReviewOpen(false); setReviewAcknowledged(false); }} className={`flex-1 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100'}`}>{translations.header.cancel}</button>
                  <button onClick={() => { if (reviewAcknowledged) finalizeFinish(); }} disabled={!reviewAcknowledged} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50">{translations.sidebar.submitExam}</button>
                </div>
              </div>
            ) : (
              <><a href="https://www.syscu.es" target="_blank" rel="noopener noreferrer"><img src={isDarkMode ? "/logo.png" : "/logo1.png"} alt="Syscu Logo" className="mx-auto mb-4 w-24 h-auto" /></a>
                  <div className="justify-center">
                <div className={`mt-auto pt-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>

                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {questions.map((q, idx) => {
                        const ans = userAnswers[idx] || [];
                        const hasAnswer = ans && ans.length > 0;
                        const isCorrect = hasAnswer && JSON.stringify(ans.slice().sort()) === JSON.stringify(q.correct.slice().sort());
                        const isIncorrect = hasAnswer && !isCorrect;
                        const hasNotes = notes && notes[idx] && notes[idx].trim().length > 0;

                        const disabledGrid = quizConfig?.type === 'domain' && hasAnswer;

                        const baseStyle = `${currentIndex === idx ? 'ring-2 ring-orange-500 border-orange-500' : 'border-transparent'}`;
                        
                        // For exam mode (full), only show answered/unanswered. For domain mode, show correct/incorrect
                        const statusStyle = quizConfig?.type === 'full'
                          ? flags[idx]
                            ? isDarkMode ? 'bg-slate-700 text-orange-400 border-slate-600' : 'bg-orange-100 text-orange-600 border-orange-200'
                            : hasAnswer
                              ? isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-200 text-slate-700 border-slate-300'
                              : isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-white text-slate-400 border-slate-200'
                          : flags[idx]
                            ? isDarkMode ? 'bg-slate-700 text-orange-400 border-slate-600' : 'bg-orange-100 text-orange-600 border-orange-200'
                            : isCorrect
                              ? isDarkMode ? 'bg-slate-700 text-emerald-400 border-slate-600' : 'bg-emerald-100 text-emerald-600 border-emerald-200'
                              : isIncorrect
                                ? isDarkMode ? 'bg-slate-700 text-red-400 border-slate-600' : 'bg-red-100 text-red-600 border-red-200'
                                : isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-white text-slate-400 border-slate-200';

                        return (
                          <div key={idx} className="relative">
                            <button
                              onClick={() => { if (!disabledGrid) { setCurrentIndex(idx); setShowFeedback(false); } }}
                              disabled={disabledGrid}
                              aria-disabled={disabledGrid}
                              className={`w-full aspect-square text-[10px] font-bold rounded-lg flex items-center justify-center transition-all border ${baseStyle} ${statusStyle}`}
                            >
                              {idx + 1}
                            </button>
                            {hasNotes && (
                              <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
        </>
      ) : (
        <div className="h-full flex flex-col justify-center">
           <h3 className="kicker text-xs mb-6">{translations.sidebar.performanceBreakdown}</h3>
           <div className="space-y-4">
              {[...new Set(questions.map(q => q.domain))].sort((a, b) => a - b).map(dom => {
                const domQs = questions.filter(q => q.domain === dom);
                const correctInDom = domQs.filter((q) => {
                  const globalIdx = questions.indexOf(q);
                  const ans = userAnswers[globalIdx] || [];
                  return JSON.stringify(ans.slice().sort()) === JSON.stringify(q.correct.slice().sort());
                }).length;
                const pct = Math.round((correctInDom / domQs.length) * 100) || 0;

                return (
                  <div key={dom} className={`p-4 rounded-xl border shadow-sm ${isDarkMode ? 'glass border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-end mb-2">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{translations.menu.domainWord} {dom}</span>
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>{pct}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                      <div
                        className={`h-full transition-all duration-1000 ${pct >= 70 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
           </div>
           <div className={`mt-12 p-6 rounded-2xl border ${isDarkMode ? 'glass border-[#146EB4]/30' : 'bg-blue-50 border-blue-100'}`}>
             <h4 className={`font-bold flex items-center gap-2 mb-2 italic ${isDarkMode ? 'text-[#4DD8E6]' : 'text-blue-800'}`}>
               <Info className="w-4 h-4" /> {translations.sidebar.awsRecommendation}
             </h4>
             <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-blue-700'}`}>
               {translations.sidebar.awsRecommendationText}
             </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

import React, { useState, useEffect, useContext } from 'react';
import { CERTIFICATIONS } from './data/certifications';
import { formatTime as formatTimeUtil, calculateScore as calculateScoreUtil, shuffle as shuffleUtil } from './utils/helpers';
import Header from './components/Header';
import Menu from './components/Menu';
import QuestionPanel from './components/QuestionPanel';
import Sidebar from './components/Sidebar';
import Result from './components/Result';
import { ThemeContext } from './context/ThemeContext';
import { translations } from './translations/es';

const shuffleQuestionOptions = (question) => {
  const optionsWithIndices = question.options.map((opt, idx) => ({ option: opt, originalIdx: idx }));
  const shuffled = shuffleUtil(optionsWithIndices);
  const newOptions = shuffled.map(item => item.option);
  const newCorrect = question.correct.map(correctIdx => shuffled.findIndex(item => item.originalIdx === correctIdx));
  
  return {
    ...question,
    options: newOptions,
    correct: newCorrect
  };
};

const App = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [view, setView] = useState('menu'); // 'menu', 'quiz'
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [notes, setNotes] = useState({});
  const [excludedAnswers, setExcludedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(5400); // 90 min
  const [quizFinished, setQuizFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewAcknowledged, setReviewAcknowledged] = useState(false);
  const [lastPerformance, setLastPerformance] = useState(null);
  const [lastFullExamPerformance, setLastFullExamPerformance] = useState(null);
  const [lastFullExamScore, setLastFullExamScore] = useState(null);

  // Load lastPerformance from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lastPerformance');
    if (saved) {
      try {
        setLastPerformance(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse lastPerformance from localStorage', e);
      }
    }

    const savedFull = localStorage.getItem('lastFullExamPerformance');
    if (savedFull) {
      try {
        setLastFullExamPerformance(JSON.parse(savedFull));
      } catch (e) {
        console.error('Failed to parse lastFullExamPerformance from localStorage', e);
      }
    }

    const savedScore = localStorage.getItem('lastFullExamScore');
    if (savedScore) {
      try {
        setLastFullExamScore(parseInt(savedScore));
      } catch (e) {
        console.error('Failed to parse lastFullExamScore from localStorage', e);
      }
    }
  }, []);

  // Save lastPerformance to localStorage whenever it changes
  useEffect(() => {
    if (lastPerformance) {
      localStorage.setItem('lastPerformance', JSON.stringify(lastPerformance));
    }
  }, [lastPerformance]);

  // Save lastFullExamPerformance to localStorage whenever it changes
  useEffect(() => {
    if (lastFullExamPerformance) {
      localStorage.setItem('lastFullExamPerformance', JSON.stringify(lastFullExamPerformance));
    }
  }, [lastFullExamPerformance]);

  // Save lastFullExamScore to localStorage whenever it changes
  useEffect(() => {
    if (lastFullExamScore !== null) {
      localStorage.setItem('lastFullExamScore', lastFullExamScore.toString());
    }
  }, [lastFullExamScore]);

  const startQuiz = (certificationId, type, domainId = null) => {
    const certification = CERTIFICATIONS[certificationId];
    if (!certification) {
      alert('Certification not found!');
      return;
    }

    let selected = [];
    const questionBank = certification.questionBank;

    if (type === 'domain') {
      selected = shuffleUtil(questionBank.filter(q => q.domain === domainId)).slice(0, 30);
    } else {
      // For full exam, implement improved domain distribution
      const domains = [...new Set(questionBank.map(q => q.domain))];
      let fullQuizQuestions = [];

      // Shuffle each domain pool separately to ensure proper randomization within domains
      domains.forEach(domain => {
        const domainQuestions = questionBank.filter(q => q.domain === domain);
        const shuffledDomainQuestions = shuffleUtil(domainQuestions);
        // Take proportional number of questions from each domain
        const questionsFromDomain = shuffledDomainQuestions.slice(0, Math.max(1, Math.floor(65 / domains.length)));
        fullQuizQuestions = [...fullQuizQuestions, ...questionsFromDomain];
      });

      // If we don't have enough questions after proportional allocation, fill with additional random questions
      if (fullQuizQuestions.length < 65) {
        const remainingQuestions = shuffleUtil(questionBank.filter(q => !fullQuizQuestions.includes(q))).slice(0, 65 - fullQuizQuestions.length);
        fullQuizQuestions = [...fullQuizQuestions, ...remainingQuestions];
      }

      selected = shuffleUtil(fullQuizQuestions).slice(0, 65);
    }

    selected = selected.map(q => shuffleQuestionOptions(q));

    setQuestions(selected);
    if (!selected || selected.length === 0) {
      alert(`No hay preguntas disponibles para el Dominio ${domainId}`);
    }
    setQuizConfig({ type, domainId, immediateFeedback: type === 'domain', certificationId });
    setView('quiz');
    setCurrentIndex(0);
    setUserAnswers({});
    setFlags({});
    setNotes({});
    setExcludedAnswers({});
    setShowFeedback(false);
    setQuizFinished(false);
    setTimeLeft(5400);
  };
  
  const startQuizWrapper = (certificationId, type, domainId = null) => {
    try {
      startQuiz(certificationId, type, domainId);
    } catch (err) {
      alert('Error al iniciar el examen: ' + (err && err.message));
    }
  };

  useEffect(() => {
    let timer;
    if (view === 'quiz' && !quizFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setQuizFinished(true);
    }
    return () => clearInterval(timer);
  }, [view, quizFinished, timeLeft]);

  const requestFinish = () => {
    if (quizConfig?.type === 'full') {
      setReviewOpen(true);
      setReviewAcknowledged(false);
      return;
    }
    finalizeFinish();
  };

  const finalizeFinish = () => {
    if (quizConfig?.type === 'domain') {
      // For domain tests, calculate performance by domain
      const perf = {};
      const domains = [...new Set(questions.map(q => q.domain))];
      domains.forEach(dom => {
        const domQs = questions.filter(q => q.domain === dom);
        const correctInDom = domQs.filter((q) => {
          const globalIdx = questions.indexOf(q);
          const ans = userAnswers[globalIdx] || [];
          return JSON.stringify(ans.slice().sort()) === JSON.stringify(q.correct.slice().sort());
        }).length;
        const pct = Math.round((correctInDom / (domQs.length || 1)) * 100) || 0;
        perf[dom] = pct;
      });
      setLastPerformance(perf);
    } else {
      // For full exams, implement experimental question system
      // Randomly select 50 questions out of 65 to count toward the score
      const allIndices = Array.from({ length: questions.length }, (_, i) => i);
      const shuffledIndices = shuffleUtil(allIndices);
      const scoredQuestionIndices = shuffledIndices.slice(0, 50).sort((a, b) => a - b);

      // Calculate score based only on the 50 scored questions
      let correctCount = 0;
      scoredQuestionIndices.forEach((idx) => {
        const q = questions[idx];
        const ans = userAnswers[idx] || [];
        if (JSON.stringify(ans.slice().sort()) === JSON.stringify(q.correct.slice().sort())) {
          correctCount++;
        }
      });

      const scaledScore = Math.round(100 + (correctCount / 50) * 900);
      setLastFullExamScore(scaledScore);

      // Calculate performance by domain for full exam
      const perf = {};
      const domains = [...new Set(questions.map(q => q.domain))];
      domains.forEach(dom => {
        // Count correct answers only among scored questions in this domain
        const domQs = questions.filter((q, idx) => q.domain === dom && scoredQuestionIndices.includes(idx));
        const correctInDom = domQs.filter((q, originalIdx) => {
          const actualIdx = questions.indexOf(q);
          const ans = userAnswers[actualIdx] || [];
          return JSON.stringify(ans.slice().sort()) === JSON.stringify(q.correct.slice().sort());
        }).length;
        const pct = Math.round((correctInDom / (domQs.length || 1)) * 100) || 0;
        perf[dom] = pct;
      });
      setLastFullExamPerformance(perf);
    }
    setQuizFinished(true);
    setReviewOpen(false);
  };

  const handleSubmit = (submittedAns) => {
    setUserAnswers({ ...userAnswers, [currentIndex]: submittedAns });
    if (quizConfig?.type === 'domain') {
      setShowFeedback(true);
      return;
    }
    setShowFeedback(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleAdvanceQuestion = () => {
    let nextUnanswered = null;
    for (let i = currentIndex + 1; i < questions.length; i++) {
      const ans = userAnswers[i] || [];
      if (!ans || ans.length === 0) {
        nextUnanswered = i;
        break;
      }
    }

    if (nextUnanswered !== null) {
      setCurrentIndex(nextUnanswered);
      setShowFeedback(false);
    } else {
      finalizeFinish();
    }
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const score = quizFinished ?
    (quizConfig?.type === 'full' && lastFullExamScore ? lastFullExamScore : calculateScoreUtil(questions, userAnswers))
    : null;

  // Anti-cheating measures - only active during quiz
  useEffect(() => {
    if (view === 'quiz' && !quizFinished) {
      // Prevent taking screenshots
      const handleKeyDown = (e) => {
        // Block PrintScreen
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          return false;
        }
        // Block Ctrl+Shift+S, Windows+Shift+S
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
          e.preventDefault();
          return false;
        }
        // Block Windows+Shift+S
        if (e.key === 's' && e.getModifierState('Win') && e.shiftKey) {
          e.preventDefault();
          return false;
        }
      };

      // Prevent right-click context menu
      const handleContextMenu = (e) => {
        if (view === 'quiz') {
          e.preventDefault();
          return false;
        }
      };

      // Prevent text selection and copying
      const handleCopy = (e) => {
        if (view === 'quiz') {
          e.preventDefault();
          return false;
        }
      };

      const handleSelectStart = (e) => {
        if (view === 'quiz') {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('copy', handleCopy);
      document.addEventListener('selectstart', handleSelectStart);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('copy', handleCopy);
        document.removeEventListener('selectstart', handleSelectStart);
      };
    }
  }, [view, quizFinished]);

  if (view === 'menu') {
    return <Menu certifications={CERTIFICATIONS} startQuiz={startQuizWrapper} lastPerformance={lastPerformance} setSelectedCertification={setSelectedCertification} selectedCertification={selectedCertification} />;
  }

  if (view === 'quiz' && (!questions || questions.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">{translations.app.noQuestionsLoaded}</h2>
          <p className="text-sm text-slate-500 mb-4">{translations.app.noQuestionsDescription}</p>
          <button onClick={() => { setView('menu'); setSelectedCertification(null); }} className="px-4 py-2 bg-orange-500 text-white rounded">{translations.app.back}</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const userAns = userAnswers[currentIndex] || [];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Header onBack={() => { setView('menu'); setSelectedCertification(null); }} quizConfig={quizConfig} domains={CERTIFICATIONS[quizConfig.certificationId]?.domains} timeLeft={timeLeft} formatTime={formatTimeUtil} quizFinished={quizFinished} finishQuiz={requestFinish} />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className={`flex-1 md:w-3/5 overflow-y-auto p-6 md:p-12 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          {!quizFinished ? (
            <div>
              <div className={`mb-4 text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400 bg-slate-800' : 'text-slate-400 bg-slate-100'} px-3 py-1 rounded-full inline-block`}>
                {CERTIFICATIONS[quizConfig.certificationId].name} - {translations.questionPanel.question} {currentIndex + 1} {translations.questionPanel.of} {questions.length}
              </div>
              <QuestionPanel
                currentQ={currentQ}
                currentIndex={currentIndex}
                flags={flags}
                setFlags={setFlags}
                notes={notes}
                setNotes={setNotes}
                userAns={userAns}
                showFeedback={showFeedback}
                quizConfig={quizConfig}
                onSubmit={handleSubmit}
                excludedAnswers={excludedAnswers}
                setExcludedAnswers={setExcludedAnswers}
                quizFinished={quizFinished}
                handleAdvanceQuestion={handleAdvanceQuestion}
                goToNextQuestion={goToNextQuestion}
                goToPreviousQuestion={goToPreviousQuestion}
                questions={questions}
              />
            </div>
          ) : (
            <Result score={score} onRetry={() => startQuiz(quizConfig.certificationId, quizConfig.type, quizConfig.domainId)} onBack={() => { setView('menu'); setSelectedCertification(null); }} />
          )}
        </div>

        <div className={`md:w-2/5 border-t md:border-t-0 md:border-l ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'} p-6 md:p-12 overflow-y-auto`}>
            <Sidebar
            currentQ={currentQ}
            questions={questions}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            flags={flags}
            userAnswers={userAnswers}
            setShowFeedback={setShowFeedback}
            quizConfig={quizConfig}
              reviewOpen={reviewOpen}
              setReviewOpen={setReviewOpen}
              reviewAcknowledged={reviewAcknowledged}
              setReviewAcknowledged={setReviewAcknowledged}
              finalizeFinish={finalizeFinish}
            quizFinished={quizFinished}
            notes={notes}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
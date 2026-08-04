import React, { useState, useEffect, useContext } from 'react';
import {
  BookOpen, ShieldCheck, Cloud, Trophy, Info, Loader, Moon, Sun,
  Sparkles, Boxes, Code2, Server, Database, BrainCircuit, Layers, Settings2, Network, ArrowLeft,
  Building2, Handshake, ExternalLink,
} from 'lucide-react';
import Footer from './Footer';
import Countdown from './Countdown';
import { ThemeContext } from '../context/ThemeContext';
import { translations } from '../translations/es';

// AWS's own certification path: start Foundational, then pick an Associate role track,
// go Professional once experienced, add Specialty certs to deepen a specific domain.
const LEVEL_ORDER = ['foundational', 'associate', 'professional', 'specialty'];
const LEVEL_LABELS = {
  foundational: 'Fundamentos — empieza aqui',
  associate: 'Associate — elige tu rol',
  professional: 'Professional — experiencia avanzada',
  specialty: 'Specialty — profundiza en un area',
};
// Accent per level (mirrors AWS's own palette) — used for card glow/hover on each group.
const LEVEL_ACCENT = {
  foundational: { hex: '#FF9900', hoverBorder: 'hover:border-[#FF9900]/60', hoverShadow: 'hover:shadow-[0_0_36px_-10px_rgba(255,153,0,0.55)]' },
  associate: { hex: '#146EB4', hoverBorder: 'hover:border-[#146EB4]/60', hoverShadow: 'hover:shadow-[0_0_36px_-10px_rgba(20,110,180,0.55)]' },
  professional: { hex: '#B388FF', hoverBorder: 'hover:border-[#B388FF]/60', hoverShadow: 'hover:shadow-[0_0_36px_-10px_rgba(179,136,255,0.55)]' },
  specialty: { hex: '#00C9DB', hoverBorder: 'hover:border-[#00C9DB]/60', hoverShadow: 'hover:shadow-[0_0_36px_-10px_rgba(0,201,219,0.55)]' },
};
// Suggested order to attempt certs within each level (AWS's recommended path); anything
// not listed here falls back to alphabetical order after the ones that are.
const CODE_PRIORITY = [
  'CLF-C02', 'AIF-C01',
  'SAA-C03', 'DVA-C02', 'SOA-C03', 'DEA-C01', 'MLA-C01',
  'SAP-C02', 'DOP-C02', 'AIP-C01',
  'SCS-C03', 'ANS-C01',
];
// A quick visual identity per cert so selector cards aren't plain text.
const CODE_ICON = {
  'CLF-C02': Cloud, 'AIF-C01': Sparkles,
  'SAA-C03': Boxes, 'DVA-C02': Code2, 'SOA-C03': Server, 'DEA-C01': Database, 'MLA-C01': BrainCircuit,
  'SAP-C02': Layers, 'DOP-C02': Settings2, 'AIP-C01': Sparkles,
  'SCS-C03': ShieldCheck, 'ANS-C01': Network,
};

function groupCertificationsByLevel(certifications) {
  const groups = new Map();

  for (const [code, cert] of Object.entries(certifications)) {
    const level = cert.level || 'foundational';
    if (!groups.has(level)) groups.set(level, []);
    groups.get(level).push({ code, ...cert });
  }

  for (const certs of groups.values()) {
    certs.sort((a, b) => {
      const pa = CODE_PRIORITY.indexOf(a.code);
      const pb = CODE_PRIORITY.indexOf(b.code);
      if (pa === -1 && pb === -1) return a.name.localeCompare(b.name);
      if (pa === -1) return 1;
      if (pb === -1) return -1;
      return pa - pb;
    });
  }

  return LEVEL_ORDER.filter((level) => groups.has(level)).map((level) => ({
    level,
    label: LEVEL_LABELS[level] || level,
    certs: groups.get(level),
  }));
}

const Menu = ({ certifications: CERTIFICATIONS, startQuiz, lastPerformance, selectedCertification, setSelectedCertification }) => {
  const [activeTab, setActiveTab] = useState('tests');
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    setIsLoading(false);
    window.scrollTo(0, 0);
  }, [activeTab, selectedCertification]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) {
      window.scrollTo(0, 0);
    } else {
      setIsLoading(true);
      setActiveTab(tab);
    }
  };

  if (!selectedCertification) {
    return (
      <div className={`min-h-screen flex flex-col ${isDarkMode ? '' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
        {isDarkMode && <div className="grid-overlay" aria-hidden="true" />}

        <div className={`sticky top-0 z-20 flex items-center justify-between px-6 md:px-12 py-4 ${isDarkMode ? 'glass border-b border-slate-800' : 'bg-white/80 backdrop-blur border-b border-slate-200'}`}>
          <a href="https://www.syscu.es" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <img src={isDarkMode ? '/logo.png' : '/logo1.png'} alt="Syscu" className="h-8 w-auto" />
          </a>
          <button
            onClick={() => toggleTheme()}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'glass text-slate-200 hover:border-[#00C9DB]/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            title={isDarkMode ? translations.header.switchToLight : translations.header.switchToDark}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex-1 p-6 md:p-12 font-sans">
          <header className="max-w-6xl mx-auto mb-12 text-center">
            <p className="kicker justify-center mb-4">AWS Certification Path</p>
            <h1 className="font-display gradient-text text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              {translations.menu.certificationSelectorTitle}
            </h1>
            <p className={`text-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-8`}>{translations.menu.certificationSelectorSubtitle}</p>
          </header>
          <main className="max-w-3xl mx-auto space-y-10">
            {groupCertificationsByLevel(CERTIFICATIONS).map(({ level, label, certs }, groupIdx) => {
              const accent = LEVEL_ACCENT[level] || LEVEL_ACCENT.foundational;
              return (
                <section key={level}>
                  <h3 className="kicker mb-4">{label}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {certs.map(({ code, name, domains }, idx) => {
                      const Icon = CODE_ICON[code] || Cloud;
                      return (
                        <button
                          key={code}
                          onClick={() => setSelectedCertification(code)}
                          style={{ '--c': accent.hex, animationDelay: `${(groupIdx * 0.05) + idx * 0.06}s` }}
                          className={`accent-card reveal-in w-full text-left p-6 rounded-2xl border shadow-sm transition-all group hover-smooth-scale ${accent.hoverShadow} ${
                            isDarkMode ? `glass border-slate-700 ${accent.hoverBorder}` : `bg-white border-slate-200 ${accent.hoverBorder}`
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="p-3 rounded-xl flex-shrink-0 text-white shadow-lg transition-transform group-hover:scale-110"
                              style={{ background: `linear-gradient(135deg, ${accent.hex}, ${accent.hex}99)` }}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h2 className={`font-display text-lg font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{name}</h2>
                              <p className="text-xs font-mono uppercase tracking-wider mt-1" style={{ color: accent.hex }}>
                                {code} • {domains?.length ?? 0} dominios
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </main>
        </div>
        <Countdown />
        <Footer onTabChange={handleTabChange} />
      </div>
    );
  }

  const certification = CERTIFICATIONS[selectedCertification];
  const domainNumbers = [...new Set(certification.questionBank.map(q => q.domain))];
  const domainMetaByNumber = new Map(certification.domains.map(d => [d.number, d]));

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? '' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {isDarkMode && <div className="grid-overlay" aria-hidden="true" />}
      {isLoading && (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-slate-900 bg-opacity-75' : 'bg-white bg-opacity-75'} flex items-center justify-center z-50`}>
          <Loader className="w-12 h-12 text-[#FF9900] animate-spin" />
        </div>
      )}

      <div className="flex-1 p-6 md:p-12 font-sans">
        <header className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-12">
            <button
              onClick={() => setSelectedCertification(null)}
              className={`inline-flex items-center gap-2 mb-4 px-4 py-2.5 rounded-full font-bold text-sm transition-colors ${
                isDarkMode
                  ? 'text-orange-400 hover:bg-white/5 hover:text-orange-300'
                  : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {translations.menu.backToCertifications}
            </button>
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-[#FF9900] to-[#FF6B2C] p-4 rounded-2xl shadow-lg shadow-orange-500/30">
                <Cloud className="text-white w-12 h-12" />
              </div>
            </div>
            <h1 className="font-display gradient-text text-5xl md:text-6xl font-extrabold tracking-tight mb-2">
              {certification.name}
            </h1>
            <p className={`text-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-8`}>{translations.menu.description}</p>

            <div className="flex gap-2 justify-center mb-8 flex-wrap">
              <button
                onClick={() => handleTabChange('tests')}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  activeTab === 'tests'
                    ? 'bg-[#FF9900] text-[#14110A] shadow-lg shadow-orange-500/40'
                    : isDarkMode ? 'glass text-slate-100 border-slate-600 hover:border-slate-500' : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
                }`}
              >
                <Trophy className="w-5 h-5 inline-block mr-2" />
                {translations.menu.practiceTests}
              </button>
              <button
                onClick={() => handleTabChange('about')}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  activeTab === 'about'
                    ? 'bg-[#FF9900] text-[#14110A] shadow-lg shadow-orange-500/40'
                    : isDarkMode ? 'glass text-slate-100 border-slate-600 hover:border-slate-500' : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
                }`}
              >
                <Info className="w-5 h-5 inline-block mr-2" />
                {translations.menu.about}
              </button>
              <div className="w-[1px] mx-2" />
              <button
                onClick={() => toggleTheme()}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  isDarkMode
                    ? 'glass text-slate-200 hover:border-[#00C9DB]/50'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
                title={isDarkMode ? translations.header.switchToLight : translations.header.switchToDark}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          {activeTab === 'tests' && (
            <div className="space-y-8">
              <div>
                <p className="kicker mb-3">Domain mastery</p>
                <h2 className={`font-display text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{translations.menu.domainMasteryTests}</h2>
                <p className={`mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{translations.menu.domainDescription}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {domainNumbers.map(domainId => {
                    const domainMeta = domainMetaByNumber.get(domainId);
                    const domainInfo = domainMeta
                      ? { title: `Dominio ${domainMeta.number}: ${domainMeta.title}`, weight: `${domainMeta.weightPct}%` }
                      : { title: `Dominio ${domainId}`, weight: 'N/A' };
                    const pct = lastPerformance ? lastPerformance[domainId] : null;
                    const radius = 50;
                    const circumference = 2 * Math.PI * radius;
                    const offset = pct !== null ? ((100 - pct) / 100) * circumference : circumference;
                    const isGood = pct && pct >= 80;

                    return (
                      <button
                        key={domainId}
                        onClick={() => startQuiz(selectedCertification, 'domain', domainId)}
                        className={`flex items-center p-6 rounded-2xl border shadow-sm hover:shadow-xl transition-shadow group text-left hover-smooth-scale relative ${
                          isDarkMode ? 'glass border-slate-700 hover:border-[#FF9900]/50' : 'bg-white border-slate-200 hover:border-orange-300'
                        }`}
                      >
                        {pct !== null && (
                          <div className="absolute top-2 right-2 flex items-center justify-center">
                            <svg className="w-20 h-20" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r={radius} fill="none" stroke={isDarkMode ? '#475569' : '#cbd5e1'} strokeWidth="8" />
                              <circle cx="60" cy="60" r={radius} fill="none" stroke={isGood ? '#10b981' : '#ef4444'} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }} transform="rotate(-90 60 60)" />
                              <text x="60" y="68" textAnchor="middle" fontFamily="inherit" fontSize="28" fontWeight="700" fill={isGood ? '#10b981' : '#ef4444'}>{pct}%</text>
                            </svg>
                          </div>
                        )}
                        <div className="bg-gradient-to-br from-[#146EB4] to-[#00C9DB] text-white p-4 rounded-xl mr-5 group-hover:scale-110 transition-transform flex-shrink-0 shadow-lg shadow-blue-500/20">
                          <BookOpen />
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg leading-tight ${isDarkMode ? 'text-white' : ''}`}>{domainInfo.title}</h3>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>{translations.menu.weight}: {domainInfo.weight} • 30 {translations.menu.questions}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className={`rounded-2xl p-8 text-white shadow-2xl border ${isDarkMode ? 'glass border-slate-700' : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700'}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="bg-[#FF9900] w-fit p-3 rounded-xl mb-4 shadow-lg shadow-orange-500/30">
                        <Trophy className="w-7 h-7" />
                      </div>
                      <h2 className="font-display text-3xl font-bold mb-2">{translations.menu.fullExamSimulation}</h2>
                      <p className="text-slate-300">{translations.menu.fullExamDescription}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-slate-300 text-sm mb-8">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#00C9DB] rounded-full flex-shrink-0 shadow-[0_0_8px_#00C9DB]" /><span>{translations.menu.examFeatures.randomized}</span></li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#FF9900] rounded-full flex-shrink-0 shadow-[0_0_8px_#FF9900]" /><span>{translations.menu.examFeatures.timeLimit}</span></li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#B388FF] rounded-full flex-shrink-0 shadow-[0_0_8px_#B388FF]" /><span>{translations.menu.examFeatures.distribution}</span></li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-[#00C9DB] rounded-full flex-shrink-0 shadow-[0_0_8px_#00C9DB]" /><span>{translations.menu.examFeatures.unscored}</span></li>
                  </ul>
                  <button
                    onClick={() => startQuiz(selectedCertification, 'full')}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#FF9900] to-[#FF6B2C] text-[#14110A] rounded-xl font-bold text-lg transition-all shadow-lg shadow-orange-900/30 hover:shadow-[0_0_50px_rgba(255,153,0,0.45)] hover:-translate-y-0.5"
                  >
                    {translations.menu.startFullExam}
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-8 rounded-2xl border shadow-sm ${isDarkMode ? 'glass border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`font-display text-2xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                    <div className="bg-[#146EB4] p-2 rounded-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    {translations.menu.aboutTool}
                  </h3>
                  <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {translations.menu.aboutDescription}
                  </p>
                  <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {translations.menu.aboutDescription2}
                  </p>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    {translations.menu.aboutDescription3}
                  </p>
                </div>

                <div className={`p-8 rounded-2xl border shadow-sm ${isDarkMode ? 'glass border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`font-display text-2xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                    <div className="bg-[#FF9900] p-2 rounded-lg">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    {translations.menu.howToUse}
                  </h3>
                  <ul className={`space-y-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <li className="flex gap-3">
                      <span className="font-bold text-[#FF9900] flex-shrink-0">1.</span>
                      <span>{translations.menu.howToSteps[1]}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[#FF9900] flex-shrink-0">2.</span>
                      <span>{translations.menu.howToSteps[2]}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[#FF9900] flex-shrink-0">3.</span>
                      <span>{translations.menu.howToSteps[3]}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[#FF9900] flex-shrink-0">4.</span>
                      <span>{translations.menu.howToSteps[4]}</span>
                    </li>
                  </ul>
                </div>

                <div className={`p-8 rounded-2xl border shadow-sm ${isDarkMode ? 'glass border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`font-display text-2xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                    <div className="bg-[#00C9DB] p-2 rounded-lg">
                      <Cloud className="w-6 h-6 text-white" />
                    </div>
                    {translations.menu.studyTips}
                  </h3>
                  <ul className={`space-y-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <li className="flex gap-3">
                      <span className="font-bold text-[#00C9DB] flex-shrink-0">✓</span>
                      <span>{translations.menu.studyTipsList[1]}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[#00C9DB] flex-shrink-0">✓</span>
                      <span>{translations.menu.studyTipsList[2]}</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-[#00C9DB] flex-shrink-0">✓</span>
                      <span>{translations.menu.studyTipsList[3]}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-[#FF9900] to-[#FF6B2C] p-8 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                  <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                    <div className="bg-white bg-opacity-30 p-2 rounded-lg">
                      <Info className="w-6 h-6 text-orange-600" />
                    </div>
                    {translations.menu.important}
                  </h3>
                  <p className="mb-4">
                    {translations.menu.importantText}
                  </p>
                  <p>
                    {translations.menu.importantText2}
                  </p>
                </div>

                <div className={`md:col-span-2 p-8 rounded-2xl border shadow-sm ${isDarkMode ? 'glass border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className={`font-display text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : ''}`}>
                      <div className="bg-[#146EB4] p-2 rounded-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      {translations.menu.aboutSyscuTitle}
                    </h3>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                      isDarkMode ? 'bg-white/5 text-[#00C9DB] border border-[#00C9DB]/30' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    }`}>
                      <Handshake className="w-3.5 h-3.5" />
                      {translations.menu.aboutSyscuBadge}
                    </span>
                  </div>
                  <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {translations.menu.aboutSyscuDescription}
                  </p>
                  <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {translations.menu.aboutSyscuDescription2}
                  </p>
                  <a
                    href="https://www.syscu.es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#146EB4] to-[#00C9DB] hover:shadow-[0_0_30px_rgba(0,201,219,0.35)] text-white px-5 py-2.5 rounded-lg transition-shadow text-sm font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {translations.menu.aboutSyscuCta}
                  </a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Countdown />
      <Footer onTabChange={handleTabChange} />
    </div>
  );
};

export default Menu;

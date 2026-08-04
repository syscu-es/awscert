import React, { useContext, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslations } from '../context/LanguageContext';
import cloudQuestHero from '../assets/cloudquest/hero.webp';

const LAUNCH_TARGET = new Date('2026-08-11T13:00:00Z').getTime();
const CLOUD_QUEST_URL = 'https://skillbuilder.aws/search?page=1&typeId=aws_cloud_quest';

const getTimeParts = (target) => {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

const pad = (n) => String(n).padStart(2, '0');

const Countdown = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const translations = useTranslations();
  const [parts, setParts] = useState(() => getTimeParts(LAUNCH_TARGET));

  useEffect(() => {
    const id = setInterval(() => setParts(getTimeParts(LAUNCH_TARGET)), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: translations.countdown.days, value: parts.days },
    { label: translations.countdown.hours, value: pad(parts.hours) },
    { label: translations.countdown.minutes, value: pad(parts.minutes) },
    { label: translations.countdown.seconds, value: pad(parts.seconds) },
  ];

  return (
    <section className="cq-countdown-section">
      <div className="max-w-4xl mx-auto px-6">
        <div className={`cq-cq-card ${isDarkMode ? 'cq-cq-card-dark' : ''}`}>
          <img
            src={cloudQuestHero}
            alt={translations.countdown.heading}
            className="cq-cq-hero"
            loading="lazy"
          />
          <div className="text-center px-6 pb-8 pt-6">
            <p className="kicker justify-center mb-3">{translations.countdown.heading}</p>
            <h2 className={`font-display text-2xl md:text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {translations.countdown.title}
            </h2>
            <p className={`max-w-2xl mx-auto mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {translations.countdown.description}
            </p>

            <div className="cq-countdown mb-6">
              {units.map((u) => (
                <div key={u.label} className={`cq-cd ${isDarkMode ? 'cq-cd-dark' : ''}`}>
                  <span>{u.value}</span>
                  <small>{u.label}</small>
                </div>
              ))}
            </div>

            <a
              href={CLOUD_QUEST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9900] to-[#FF6B2C] hover:shadow-[0_0_30px_rgba(255,153,0,0.4)] text-[#14110A] px-5 py-3 rounded-lg transition-shadow text-sm font-bold"
            >
              <ExternalLink className="w-4 h-4" />
              {translations.countdown.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Countdown;

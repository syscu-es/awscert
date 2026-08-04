import React from 'react';
import { Github, ExternalLink, Heart } from 'lucide-react';
import { translations } from '../translations/es';

const Footer = ({ onTabChange }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#060B12] text-white py-12 px-6 md:px-12 border-t border-white/10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#FF9900] via-transparent to-[#00C9DB] opacity-60" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-display font-bold text-lg mb-3">AWS Certification Practice Exams</h3>
            <p className="text-slate-400 text-sm">Simulador gratuito de exámenes de práctica para las 12 certificaciones vigentes de AWS, sin registro.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="kicker mb-3">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => onTabChange('tests')} className="hover:text-[#FF9900] transition-colors cursor-pointer">{translations.footer.practiceTests}</button></li>
              <li><button onClick={() => onTabChange('about')} className="hover:text-[#FF9900] transition-colors cursor-pointer">{translations.footer.about}</button></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="kicker mb-3">Conectar</h3>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/syscu/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#00C9DB]/50 text-white px-4 py-2 rounded-lg transition-colors text-sm font-bold"
              >
                <ExternalLink className="w-4 h-4" />
                Linkedin
              </a>
              <a
                href="https://www.syscu.es"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9900] to-[#FF6B2C] hover:shadow-[0_0_30px_rgba(255,153,0,0.4)] text-[#14110A] px-4 py-2 rounded-lg transition-shadow text-sm font-bold"
              >
                <ExternalLink className="w-4 h-4" />
                {translations.footer.website}
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <p className="text-slate-400 text-sm flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
            <span>© {currentYear} {translations.footer.madeWith}</span>
            <Heart className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{translations.footer.by}</span>
            <a href="https://www.syscu.es" target="_blank" rel="noopener noreferrer" className="text-[#FF9900] hover:text-[#FFB74D] font-bold transition-colors">
              syscu
            </a>
          </p>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-[#00C9DB]/30 text-[#00C9DB]">
            AWS Partner Network
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

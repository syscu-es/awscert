import React, { useContext } from 'react';
import { Trophy, Share2 } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslations } from '../context/LanguageContext';
import html2canvas from 'html2canvas';

const Result = ({ score, onRetry, onBack }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const translations = useTranslations();

  // Function to share result on LinkedIn
  const shareOnLinkedIn = async () => {
    try {
      // Create a temporary element with the result content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div class="linkedin-share-result" style="
          width: 600px;
          height: 400px;
          background: ${isDarkMode ? '#1e293b' : '#ffffff'};
          color: ${isDarkMode ? '#f1f5f9' : '#1e293b'};
          padding: 30px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: Arial, sans-serif;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          text-align: center;
          position: relative;
          overflow: hidden;
        ">
          <div style="position: absolute; top: 15px; left: 15px; font-size: 14px; color: ${isDarkMode ? '#94a3b8' : '#64748b'};">${translations.result.shareCardBrand}</div>
          <div style="margin-bottom: 20px;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: ${score >= 700 ? (isDarkMode ? '#10b981' : '#059669') : (isDarkMode ? '#ef4444' : '#dc2626')}; display: block;">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="${score >= 700 ? (isDarkMode ? '#10b981' : '#059669') : (isDarkMode ? '#ef4444' : '#dc2626')}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="${score >= 700 ? (isDarkMode ? '#10b981' : '#059669') : (isDarkMode ? '#ef4444' : '#dc2626')}"/>
            </svg>
          </div>
          <h2 style="font-size: 28px; font-weight: bold; margin: 10px 0; color: ${score >= 700 ? (isDarkMode ? '#10b981' : '#059669') : (isDarkMode ? '#ef4444' : '#dc2626')}">${score >= 700 ? translations.result.passed : translations.result.notPassed}</h2>
          <p style="font-size: 18px; margin: 10px 0; color: ${isDarkMode ? '#cbd5e1' : '#334155'}">${translations.result.estimatedScore}</p>
          <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin: 20px 0; width: 100%;">
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: bold; color: ${isDarkMode ? '#f1f5f9' : '#1e293b'}">${score}</div>
              <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: ${isDarkMode ? '#94a3b8' : '#64748b'}">${translations.result.points}</div>
            </div>
            <div style="width: 1px; height: 40px; background: ${isDarkMode ? '#334155' : '#cbd5e1'}"></div>
            <div style="text-align: center;">
              <div style="font-size: 36px; font-weight: bold; color: ${isDarkMode ? '#f1f5f9' : '#1e293b'}">700</div>
              <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: ${isDarkMode ? '#94a3b8' : '#64748b'}">${translations.result.minimumToPass}</div>
            </div>
          </div>
          <p style="font-size: 16px; margin-top: 20px; color: ${isDarkMode ? '#94a3b8' : '#64748b'}; font-style: italic;">${translations.result.shareCardFooter}</p>
          <div style="position: absolute; bottom: 15px; right: 15px; font-size: 12px; color: ${isDarkMode ? '#64748b' : '#94a3b8'};">awscert.syscu.es</div>
        </div>
      `;
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.zIndex = '-9999';
      tempDiv.style.width = '600px';
      tempDiv.style.height = '400px';
      document.body.appendChild(tempDiv);

      // Wait a moment for the SVG to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempDiv, {
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true
      });

      const imageData = canvas.toDataURL('image/png');

      // Remove the temporary element
      document.body.removeChild(tempDiv);

      // Create the LinkedIn share URL with pre-filled content
      const title = encodeURIComponent(translations.result.shareLinkedInTitle.replace('{score}', score));
      const summary = encodeURIComponent(translations.result.shareLinkedInSummary);
      const url = encodeURIComponent('https://awscert.syscu.es');

      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}&source=AWS%20Certification%20Prep`;

      // Download the image first
      const link = document.createElement('a');
      link.download = `aws-certification-score-${score}.png`;
      link.href = imageData;
      link.click();

      // Then open the LinkedIn share dialog in a new tab/window
      window.open(linkedInUrl, '_blank');

      // Show a message to the user with clear instructions
      alert(translations.result.shareAlert.replace('{score}', score));
    } catch (error) {
      console.error('Error generating image:', error);
      alert(translations.result.shareError);
    }
  };

  return (
    <div className="result-container max-w-xl mx-auto text-center py-12">
      <div className="mb-8 flex justify-center">
        <div className={`p-8 rounded-full ${score >= 700 ? isDarkMode ? 'glass text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.25)]' : 'bg-emerald-100 text-emerald-600' : isDarkMode ? 'glass text-red-400 shadow-[0_0_40px_rgba(239,68,68,0.25)]' : 'bg-red-100 text-red-600'}`}>
          <Trophy className="w-16 h-16" />
        </div>
      </div>
      <h2 className={`font-display text-4xl font-extrabold mb-2 ${isDarkMode ? 'text-white' : ''}`}>
        {score >= 700 ? translations.result.passed : translations.result.notPassed}
      </h2>
      <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{translations.result.estimatedScore}</p>

      <div className="flex items-center justify-center gap-8 mb-12">
        <div className="text-center">
          <div className={`text-5xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{score}</div>
          <div className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>{translations.result.points}</div>
        </div>
        <div className={`w-[1px] h-12 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <div className="text-center">
          <div className={`text-5xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>700</div>
          <div className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>{translations.result.minimumToPass}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-4 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
        >
          {translations.result.backToHome}
        </button>
        <button
          onClick={onRetry}
          className="p-4 bg-gradient-to-r from-[#FF9900] to-[#FF6B2C] text-[#14110A] rounded-xl font-bold transition-all hover:shadow-[0_0_36px_rgba(255,153,0,0.4)]"
        >
          {translations.result.retryTest}
        </button>
      </div>

      {/* LinkedIn Share Button */}
      <div className="mb-8">
        <button
          onClick={shareOnLinkedIn}
          className="flex items-center justify-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors w-full max-w-xs mx-auto"
        >
          <Share2 className="w-5 h-5" />
          {translations.result.shareOnLinkedIn}
        </button>
        <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">
          {translations.result.shareDescription}
        </p>
      </div>
    </div>
  );
};

export default Result;
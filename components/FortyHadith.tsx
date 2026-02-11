
import React from 'react';
import { FORTY_HADITH } from '../constants';
import { useTheme } from '../context/ThemeContext';

const FortyHadith: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`space-y-6 animate-fade-in pb-24 px-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} p-8 rounded-3xl text-center shadow-xl mb-8`}>
        <h2 className="text-3xl font-black text-amber-500 quran-text">الأربعين النووية</h2>
        <p className={`text-xs mt-2 font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>أربعون حديثاً نبوياً جمعها الإمام النووي</p>
      </div>

      {FORTY_HADITH.map(h => (
        <div 
          key={h.id} 
          className={`${isDark ? 'bg-slate-900 border-red-700' : 'bg-white border-red-500'} p-8 rounded-3xl shadow-xl border-r-8 transition-all active:scale-[0.98]`}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-black text-amber-500">{h.title}</h4>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}>حديث #{h.id}</span>
          </div>
          <p className={`${isDark ? 'text-white' : 'text-slate-800'} text-lg font-bold leading-relaxed mb-6 quran-text text-right`}>
            "{h.hadith}"
          </p>
          <div className={`${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'} p-6 rounded-2xl border`}>
            <p className={`text-xs font-black mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>الشرح والفوائد:</p>
            <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-sm font-bold leading-relaxed`}>{h.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FortyHadith;

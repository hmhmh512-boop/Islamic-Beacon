import React, { useState } from 'react';
import { PROPHET_STORIES } from '../prophet-stories';
import { useTheme } from '../context/ThemeContext';

const ProphetStories: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedProphet, setSelectedProphet] = useState<any>(null);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} pb-32`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className={`text-3xl font-black quran-text text-center mb-8 ${isDark ? 'text-amber-400' : 'text-emerald-800'}`}>سير الأنبياء</h1>

        {selectedProphet ? (
          <div className="space-y-6 animate-fade-in">
            <button
              onClick={() => setSelectedProphet(null)}
              className={`px-6 py-2 rounded-xl font-black text-xs ${isDark ? 'bg-slate-900 text-amber-500' : 'bg-white text-emerald-700 border border-emerald-100'}`}
            >
              ← العودة للقائمة
            </button>

            <div className={`p-8 rounded-[2.5rem] border-b-8 shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-emerald-100 text-slate-900'}`}>
              <h2 className="text-4xl font-black quran-text text-amber-500 mb-2">{selectedProphet.nameArabic}</h2>
              <p className="text-sm font-bold opacity-70 mb-6">{selectedProphet.title}</p>
              
              <div className={`p-6 rounded-2xl mb-6 leading-[2] text-lg text-right quran-text whitespace-pre-wrap ${isDark ? 'bg-black/20' : 'bg-emerald-50/50'}`}>
                {selectedProphet.fullStory}
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-amber-500">💡 من إنجازاته:</h3>
                <p className="text-sm font-bold opacity-80">{selectedProphet.mainAchievements}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROPHET_STORIES.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProphet(p)}
                className={`p-6 rounded-2xl border-b-4 text-right transition-all active:scale-95 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-emerald-100 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">📜</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded ${isDark ? 'bg-slate-800 text-amber-500' : 'bg-emerald-50 text-emerald-700'}`}>#{p.id}</span>
                </div>
                <h3 className="text-xl font-black quran-text text-amber-500">{p.nameArabic}</h3>
                <p className="text-[10px] font-bold opacity-60 line-clamp-1">{p.title}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProphetStories;

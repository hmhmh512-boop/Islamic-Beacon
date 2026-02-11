
import React, { useEffect, useState } from 'react';
import { FORTY_HADITH, SUNNAHS } from '../constants';
import { FORTY_HADITH_COMPLETE, ABANDONED_SUNNAH_EXTENDED } from '../hadith-content';
import { useTheme } from '../context/ThemeContext';

interface HadithFilters {
  authenticity: 'all' | 'صحيح' | 'حسن' | 'ضعيف';
}

const SunnahHadith: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [view, setView] = useState<'hadith' | 'sunnah'>('hadith');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<HadithFilters>({ authenticity: 'all' });
  const [filteredHadith, setFilteredHadith] = useState(FORTY_HADITH_COMPLETE);
  const [filteredSunnah, setFilteredSunnah] = useState(ABANDONED_SUNNAH_EXTENDED);

  // Filter and search hadith
  useEffect(() => {
    let result = FORTY_HADITH_COMPLETE;

    // Apply authenticity filter
    if (filters.authenticity !== 'all') {
      result = result.filter(h => h.authenticity === filters.authenticity);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(h =>
        h.title.toLowerCase().includes(term) ||
        h.hadith.toLowerCase().includes(term) ||
        h.explanation.toLowerCase().includes(term) ||
        h.authenticity.includes(term)
      );
    }

    setFilteredHadith(result);
  }, [searchTerm, filters.authenticity]);

  // Filter and search sunnah
  useEffect(() => {
    let result = ABANDONED_SUNNAH_EXTENDED;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
      );
    }

    setFilteredSunnah(result);
  }, [searchTerm]);

  const getAuthenticityColor = (auth: string) => {
    switch (auth) {
      case 'صحيح':
        return 'bg-emerald-900 text-emerald-200';
      case 'حسن':
        return 'bg-blue-900 text-blue-200';
      case 'ضعيف':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-slate-900 text-slate-200';
    }
  };

  return (
    <div className={`animate-fade-in space-y-6 pb-32 w-full min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className={`p-5 border-r-4 shadow-lg text-[11px] font-bold leading-relaxed mx-2 rounded-xl ${
        isDark ? 'border-amber-600 bg-slate-900/80 text-white' : 'border-emerald-600 bg-white text-slate-700'
      }`}>
        <p>
          في هذا القسم ستجد أحاديث نبوية مختارة وسنناً عملية مهجورة، جميع النصوص محفوظة محلياً ويمكن قراءتها في أي وقت دون الحاجة لاتصال بالإنترنت.
        </p>
      </div>

      <div className={`flex rounded-2xl p-1.5 shadow-inner border mx-2 ${
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <button 
          onClick={() => setView('hadith')}
          className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all ${
            view === 'hadith' 
              ? isDark ? 'bg-red-900 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
              : 'text-slate-500'
          }`}
        >
          الأربعون النووية
        </button>
        <button 
          onClick={() => setView('sunnah')}
          className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all ${
            view === 'sunnah' 
              ? isDark ? 'bg-emerald-900 text-white shadow-lg' : 'bg-emerald-600 text-white shadow-lg'
              : 'text-slate-500'
          }`}
        >
          سنن مهجورة
        </button>
      </div>

      <div className="px-2 space-y-3">
        <div className={`border rounded-2xl flex items-center px-4 py-2 gap-3 ${
          isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className="text-slate-400 text-lg">🔍</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={view === 'hadith' ? 'ابحث في الأحاديث أو الشروحات...' : 'ابحث في السنن...'}
            className={`flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-500 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          />
        </div>

        {view === 'hadith' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
            <button
              onClick={() => setFilters({ ...filters, authenticity: 'all' })}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black transition-all ${
                filters.authenticity === 'all'
                  ? isDark ? 'bg-slate-700 text-white' : 'bg-slate-600 text-white'
                  : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}
            >
              الكل ({FORTY_HADITH_COMPLETE.length})
            </button>
            <button
              onClick={() => setFilters({ ...filters, authenticity: 'صحيح' })}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black transition-all ${
                filters.authenticity === 'صحيح'
                  ? 'bg-emerald-600 text-white'
                  : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}
            >
              صحيح ({FORTY_HADITH_COMPLETE.filter(h => h.authenticity === 'صحيح').length})
            </button>
            <button
              onClick={() => setFilters({ ...filters, authenticity: 'حسن' })}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black transition-all ${
                filters.authenticity === 'حسن'
                  ? 'bg-blue-600 text-white'
                  : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}
            >
              حسن ({FORTY_HADITH_COMPLETE.filter(h => h.authenticity === 'حسن').length})
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5 px-2 pb-10">
        {view === 'hadith' ? (
          filteredHadith.length > 0 ? (
            filteredHadith.map(h => (
              <div key={h.id} className={`p-8 border-b-4 rounded-[2rem] shadow-xl relative overflow-hidden group transition-all ${
                isDark ? 'border-red-900 bg-slate-900/80 text-white' : 'border-red-600 bg-white text-slate-900'
              }`}>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full ${getAuthenticityColor(h.authenticity)}`}>
                    {h.authenticity}
                  </span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                    isDark ? 'text-amber-300 bg-red-900/60' : 'text-white bg-red-600'
                  }`}>
                    الحديث رقم {h.id}
                  </span>
                </div>
                <h3 className={`text-lg font-black mb-3 quran-text ${isDark ? 'text-amber-400' : 'text-red-800'}`}>{h.title}</h3>
                <pre className={`text-[15px] font-bold leading-relaxed mb-6 text-right quran-text whitespace-pre-wrap ${
                  isDark ? 'text-white' : 'text-slate-800'
                }`}>
                  {h.hadith}
                </pre>
                {h.explanation && (
                  <div className={`mt-4 border-t pt-3 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <p className={`text-[12px] font-bold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <span className={`font-black ${isDark ? 'text-amber-400' : 'text-red-700'}`}>الشرح: </span>
                      {h.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 font-bold">لا توجد أحاديث مطابقة للبحث</div>
          )
        ) : filteredSunnah.length > 0 ? (
          filteredSunnah.map(s => (
            <div key={s.id} className={`p-8 border-r-4 shadow-lg rounded-[2rem] ${
              isDark ? 'border-emerald-800 bg-slate-900/80 text-white' : 'border-emerald-600 bg-white text-slate-900'
            }`}>
              <h4 className={`font-black text-xl mb-3 quran-text ${isDark ? 'text-amber-400' : 'text-emerald-800'}`}>{s.title}</h4>
              <pre className={`text-sm leading-relaxed font-bold whitespace-pre-wrap text-right ${
                isDark ? 'text-slate-100' : 'text-slate-700'
              }`}>
                {s.description}
              </pre>
              <div className="mt-4 flex justify-end">
                <span className="text-[8px] font-black text-white bg-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-md">سنة ﷺ</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 font-bold">لا توجد سنن مطابقة للبحث</div>
        )}
      </div>
    </div>
  );
};

export default SunnahHadith;

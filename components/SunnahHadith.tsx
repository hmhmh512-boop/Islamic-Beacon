
import React, { useEffect, useState } from 'react';
import { FORTY_HADITH, SUNNAHS } from '../constants';
import { FORTY_HADITH_COMPLETE, ABANDONED_SUNNAH_EXTENDED } from '../hadith-content';

interface HadithFilters {
  authenticity: 'all' | 'صحيح' | 'حسن' | 'ضعيف';
}

const SunnahHadith: React.FC = () => {
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
    <div className="animate-fade-in space-y-6 pb-32 w-full">
      <div className="luxury-card p-5 border-r-4 border-amber-600 bg-slate-900/80 text-white text-[11px] font-bold leading-relaxed mx-2">
        <p>
          في هذا القسم ستجد أحاديث نبوية مختارة وسنناً عملية مهجورة، جميع النصوص محفوظة محلياً ويمكن قراءتها في أي وقت دون الحاجة لاتصال بالإنترنت، مع الحرص على أن تكون من المصادر الصحيحة الموثوقة قدر الإمكان.
        </p>
      </div>

      <div className="flex bg-slate-800 rounded-2xl p-1.5 shadow-inner border border-slate-700 mx-2">
        <button 
          onClick={() => setView('hadith')}
          className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all ${view === 'hadith' ? 'bg-red-900 text-white shadow-lg' : 'text-slate-500'}`}
        >
          الأربعون النووية
        </button>
        <button 
          onClick={() => setView('sunnah')}
          className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all ${view === 'sunnah' ? 'bg-emerald-900 text-white shadow-lg' : 'text-slate-500'}`}
        >
          سنن مهجورة
        </button>
      </div>

      <div className="px-2 space-y-3">
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl flex items-center px-4 py-2 gap-3">
          <span className="text-slate-400 text-lg">🔍</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={view === 'hadith' ? 'ابحث في الأحاديث أو الشروحات...' : 'ابحث في السنن...'}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-100 font-bold placeholder:text-slate-500"
          />
        </div>

        {view === 'hadith' && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setFilters({ ...filters, authenticity: 'all' })}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black transition-all ${
                filters.authenticity === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              الكل ({FORTY_HADITH_COMPLETE.length})
            </button>
            <button
              onClick={() => setFilters({ ...filters, authenticity: 'صحيح' })}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black transition-all ${
                filters.authenticity === 'صحيح'
                  ? 'bg-emerald-900 text-emerald-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              صحيح ({FORTY_HADITH_COMPLETE.filter(h => h.authenticity === 'صحيح').length})
            </button>
            <button
              onClick={() => setFilters({ ...filters, authenticity: 'حسن' })}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black transition-all ${
                filters.authenticity === 'حسن'
                  ? 'bg-blue-900 text-blue-200'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              حسن ({FORTY_HADITH_COMPLETE.filter(h => h.authenticity === 'حسن').length})
            </button>
          </div>
        )}
      </div>

      <div className="space-y-5 px-2">
        {view === 'hadith' ? (
          filteredHadith.length > 0 ? (
            filteredHadith.map(h => (
              <div key={h.id} className="luxury-card p-8 border-b-4 border-red-800 bg-slate-800/90 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full ${getAuthenticityColor(h.authenticity)}`}>
                    {h.authenticity}
                  </span>
                  <span className="text-[10px] font-black text-amber-300 bg-red-900/60 px-3 py-1 rounded-full">
                    الحديث رقم {h.id}
                  </span>
                </div>
                <h3 className="text-lg font-black text-amber-400 mb-3 quran-text">{h.title}</h3>
                <pre className="text-[15px] text-white font-bold leading-relaxed mb-6 text-right quran-text high-contrast-text whitespace-pre-wrap">
                  {h.hadith}
                </pre>
                {h.explanation && (
                  <div className="mt-4 border-t border-white/5 pt-3">
                    <p className="text-[12px] text-slate-300 font-bold leading-relaxed">
                      <span className="text-amber-400 font-black">الشرح: </span>
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
            <div key={s.id} className="luxury-card p-8 border-r-4 border-emerald-800 bg-slate-800/90 shadow-lg">
              <h4 className="font-black text-amber-400 text-xl mb-3 quran-text">{s.title}</h4>
              <pre className="text-slate-100 text-sm leading-relaxed font-bold high-contrast-text whitespace-pre-wrap text-right">
                {s.description}
              </pre>
              <div className="mt-4 flex justify-end">
                <span className="text-[8px] font-black text-white bg-emerald-900 px-3 py-1 rounded-full uppercase tracking-widest shadow-md">سنة ﷺ</span>
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

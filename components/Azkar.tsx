
import React, { useEffect, useState } from 'react';
import { AZKAR as BUILTIN_AZKAR } from '../constants';
import { AZKAR_DATABASE, AzkarEntry, searchAzkar, getRandomAzkar } from '../assistant-knowledge-base';
import { useTheme } from '../context/ThemeContext';
import ExpandableText from './ExpandableText';

interface AzkarProps {
  forcedCategory?: string;
}

const Azkar: React.FC<AzkarProps> = ({ forcedCategory }) => {
  // FIX: Use theme context instead of prop
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<'morning' | 'evening' | 'sleep' | 'travel' | 'prayer' | 'general' | 'fear' | 'gratitude'>(
    (forcedCategory as any) || 'morning'
  );
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [azkarList, setAzkarList] = useState<AzkarEntry[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [expandedNoteIds, setExpandedNoteIds] = useState<Set<string>>(new Set());

  const azkarCategories = [
    { key: 'morning' as const, label: '🌅 الصباح', emoji: '☀️' },
    { key: 'evening' as const, label: '🌙 المساء', emoji: '🌙' },
    { key: 'sleep' as const, label: '😴 النوم', emoji: '😴' },
    { key: 'travel' as const, label: '✈️ السفر', emoji: '✈️' },
    { key: 'prayer' as const, label: '🕌 الصلاة', emoji: '🕌' },
    { key: 'general' as const, label: '📿 عام', emoji: '📿' },
    { key: 'fear' as const, label: '💪 القلق', emoji: '💪' },
    { key: 'gratitude' as const, label: '🙏 الشكر', emoji: '🙏' },
  ];

  useEffect(() => {
    const filtered = AZKAR_DATABASE.filter(a => 
      a.category === activeCategory &&
      (a.titleArabic.toLowerCase().includes(search.toLowerCase()) || a.zikr.includes(search))
    );
    setAzkarList(filtered);
  }, [activeCategory, search]);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('azkar_progress_v2');
      if (raw) setProgress(JSON.parse(raw));
      const rawNotes = localStorage.getItem('azkar_notes_v2');
      if (rawNotes) setNotes(JSON.parse(rawNotes));
    } catch (e) {
      console.warn('Failed loading azkar state', e);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('azkar_progress_v2', JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed saving azkar state', e);
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem('azkar_notes_v2', JSON.stringify(notes));
    } catch (e) {
      console.warn('Failed saving azkar notes', e);
    }
  }, [notes]);

  const increment = (id: string) => {
    setProgress(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    if (window.navigator?.vibrate) window.navigator.vibrate([40]);
  };

  const resetProgress = () => {
    if (confirm('هل تريد إعادة ضبط جميع العدادات؟')) {
      setProgress({});
    }
  };

  const saveNote = (id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  const toggleExpandNote = (id: string) => {
    const newSet = new Set(expandedNoteIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedNoteIds(newSet);
  };

  const categoryConfig = azkarCategories.find(c => c.key === activeCategory);

  return (
    <div className={`animate-fade-in space-y-6 sm:space-y-8 pb-32 w-full min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {!forcedCategory && (
        <>
          {/* Header Card */}
          <div className={`
            mx-2 sm:mx-3 md:mx-4
            rounded-2xl sm:rounded-3xl
            p-6 sm:p-8 md:p-10
            shadow-xl
            border-b-4 sm:border-b-8
            transition-all duration-300
            relative overflow-hidden
            ${isDark
              ? 'bg-gradient-to-br from-red-900 to-red-950 border-amber-600 text-white'
              : 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-400 text-slate-900'
            }
          `}>
            <div className="relative z-10">
              <h3 className={`text-2xl sm:text-3xl font-black quran-text glow-gold ${isDark ? 'text-amber-400' : 'text-rose-700'}`}>
                {categoryConfig?.label || 'الأذكار'}
              </h3>
              <p className={`text-[9px] sm:text-[10px] font-bold mt-2 uppercase tracking-widest ${isDark ? 'text-white/70' : 'text-slate-700/70'}`}>
                🔒 جميع الأذكار محفوظة على جهازك وتعمل بدون إنترنت
              </p>
            </div>
            <span className="absolute top-2 sm:top-4 left-4 sm:left-6 text-5xl sm:text-7xl opacity-10">📿</span>
          </div>

          {/* Categories - Responsive Grid */}
          <div className="px-2 sm:px-3 md:px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {azkarCategories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`
                    px-3 sm:px-4 py-2 sm:py-3
                    rounded-xl sm:rounded-2xl
                    text-[9px] sm:text-[11px]
                    font-black
                    transition-all duration-200
                    border-b-2 sm:border-b-4
                    active:scale-95
                    ${activeCategory === cat.key 
                      ? isDark
                        ? 'bg-emerald-700 border-emerald-950 text-white scale-105 shadow-lg'
                        : 'bg-emerald-500 border-emerald-700 text-white scale-105 shadow-lg'
                      : isDark
                      ? 'bg-slate-800 border-slate-900 text-slate-400'
                      : 'bg-slate-200 border-slate-300 text-slate-600'
                    }
                  `}
                >
                  <span className="block text-base sm:text-lg">{cat.emoji}</span>
                  <span className="text-[7px] sm:text-[9px]">{cat.label.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Reset */}
          <div className="px-2 sm:px-3 md:px-4 space-y-2 sm:space-y-3">
            <div className={`
              border rounded-xl sm:rounded-2xl
              flex items-center px-3 sm:px-4 py-2 sm:py-3
              gap-2 sm:gap-3
              transition-all duration-300
              ${isDark
                ? 'bg-slate-900/70 border-slate-700'
                : 'bg-white border-slate-300'
              }
            `}>
              <span className="text-base sm:text-lg">🔍</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث في الأذكار..."
                className={`
                  flex-1 bg-transparent border-none outline-none
                  text-sm sm:text-base
                  font-bold
                  placeholder:opacity-50
                  ${isDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}
                `}
              />
              <span className="text-[8px] sm:text-[9px] font-black whitespace-nowrap opacity-70">
                {azkarList.length}
              </span>
            </div>
            <button 
              onClick={resetProgress}
              className={`
                w-full px-3 sm:px-4 py-2 sm:py-3
                rounded-xl sm:rounded-2xl
                font-black
                text-xs sm:text-sm
                transition-all active:scale-95
                ${isDark
                  ? 'bg-red-700/40 border border-red-600/50 text-red-200 hover:bg-red-700/60'
                  : 'bg-red-200 border border-red-300 text-red-700 hover:bg-red-300'
                }
              `}
            >
              🔄 إعادة ضبط جميع العدادات
            </button>
          </div>
        </>
      )}

      {/* Azkar List */}
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-3 md:px-4">
        {azkarList.map((azkar) => {
          const currentCount = progress[azkar.id] || 0;
          const hasNote = notes[azkar.id] && notes[azkar.id].trim() !== '';
          
          return (
            <div 
              key={azkar.id}
              className={`
                rounded-xl sm:rounded-2xl md:rounded-3xl
                p-4 sm:p-6 md:p-8
                border-r-4 sm:border-r-8
                transition-all duration-300
                shadow-lg sm:shadow-xl
                ${currentCount > 0
                  ? isDark
                    ? 'border-emerald-500 bg-slate-900/40'
                    : 'border-emerald-600 bg-green-50'
                  : isDark
                  ? 'border-amber-500 bg-slate-900'
                  : 'border-amber-400 bg-white'
                }
              `}
            >
              {/* Title */}
              <h4 className={`text-lg sm:text-xl md:text-2xl font-black mb-4 sm:mb-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                {azkar.titleArabic}
              </h4>

              {/* Main Zikr Text - Full Display */}
              <div className={`
                text-right mb-4 sm:mb-8
                p-4 sm:p-6 md:p-8
                rounded-lg sm:rounded-2xl
                border
                transition-all duration-300
                ${isDark
                  ? 'bg-slate-800/50 border-amber-500/20 text-white'
                  : 'bg-amber-50 border-amber-300 text-slate-900'
                }
              `}>
                <p className={`text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose quran-text font-bold whitespace-pre-wrap break-words`}>
                  "{azkar.zikr}"
                </p>
              </div>

              {/* Details Grid - Responsive */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-[10px] sm:text-[11px] font-bold">
                {/* Transliteration */}
                <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${
                  isDark
                    ? 'bg-slate-800/30 border-slate-700/30 text-slate-300'
                    : 'bg-blue-50 border-blue-200 text-slate-800'
                }`}>
                  <span className="text-lg sm:text-xl mt-0.5">🔤</span>
                  <div className="flex-1">
                    <p className={`font-black mb-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>النطق:</p>
                    <ExpandableText 
                      text={azkar.transliteration}
                      maxLength={100}
                      isDark={isDark}
                      className={`${isDark ? 'text-slate-400' : 'text-slate-700'}`}
                    />
                  </div>
                </div>

                {/* Meaning */}
                <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${
                  isDark
                    ? 'bg-emerald-800/20 border-emerald-700/30 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-slate-800'
                }`}>
                  <span className="text-lg sm:text-xl mt-0.5">📖</span>
                  <div className="flex-1">
                    <p className={`font-black mb-1 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>المعنى:</p>
                    <ExpandableText 
                      text={azkar.meaning}
                      maxLength={120}
                      isDark={isDark}
                      className={`${isDark ? 'text-slate-400' : 'text-slate-700'}`}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${
                  isDark
                    ? 'bg-rose-800/20 border-rose-700/30 text-rose-300'
                    : 'bg-rose-50 border-rose-200 text-slate-800'
                }`}>
                  <span className="text-lg sm:text-xl mt-0.5">🏆</span>
                  <div className="flex-1">
                    <p className={`font-black mb-1 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>الفضل:</p>
                    <ExpandableText 
                      text={azkar.reward}
                      maxLength={120}
                      isDark={isDark}
                      className={`${isDark ? 'text-slate-400' : 'text-slate-700'}`}
                    />
                  </div>
                </div>

                {/* Timing */}
                <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${
                  isDark
                    ? 'bg-sky-800/20 border-sky-700/30 text-sky-300'
                    : 'bg-sky-50 border-sky-200 text-slate-800'
                }`}>
                  <span className="text-lg sm:text-xl mt-0.5">⏰</span>
                  <div className="flex-1">
                    <p className={`font-black mb-1 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>الوقت والتكرار:</p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-700'}>{azkar.timing} - {azkar.frequency}</p>
                  </div>
                </div>

                {/* Related Verse */}
                {azkar.relatedVerse && (
                  <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${
                    isDark
                      ? 'bg-amber-900/20 border-amber-700/30 text-amber-200'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    <span className="text-lg sm:text-xl mt-0.5">📚</span>
                    <div className="flex-1">
                      <p className={`font-black mb-1 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>الآية الكريمة:</p>
                      <ExpandableText 
                        text={azkar.relatedVerse}
                        maxLength={100}
                        isDark={isDark}
                        className={isDark ? 'text-amber-100' : 'text-amber-900'}
                      />
                    </div>
                  </div>
                )}

                {/* Related Hadith */}
                {azkar.relatedHadith && (
                  <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${
                    isDark
                      ? 'bg-green-900/20 border-green-700/30 text-green-200'
                      : 'bg-green-50 border-green-300 text-green-900'
                  }`}>
                    <span className="text-lg sm:text-xl mt-0.5">🕌</span>
                    <div className="flex-1">
                      <p className={`font-black mb-1 ${isDark ? 'text-green-300' : 'text-green-800'}`}>الحديث:</p>
                      <ExpandableText 
                        text={azkar.relatedHadith}
                        maxLength={100}
                        isDark={isDark}
                        className={isDark ? 'text-green-100' : 'text-green-900'}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              {hasNote && (
                <div className={`rounded-lg p-3 sm:p-4 mb-6 border ${
                  isDark
                    ? 'bg-sky-900/20 border-sky-700/30 text-sky-200'
                    : 'bg-sky-50 border-sky-300 text-sky-900'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-black text-sm sm:text-base">📝 ملاحظة</p>
                    <button
                      onClick={() => toggleExpandNote(azkar.id)}
                      className={`text-[8px] font-bold transition-all ${isDark ? 'text-sky-300 hover:text-sky-200' : 'text-sky-700 hover:text-sky-900'}`}
                    >
                      {expandedNoteIds.has(azkar.id) ? '▲ إخفاء' : '▼ عرض'}
                    </button>
                  </div>
                  {expandedNoteIds.has(azkar.id) && (
                    <p className={`text-[9px] sm:text-[10px] leading-relaxed whitespace-pre-wrap break-words ${isDark ? 'text-sky-100' : 'text-sky-950'}`}>
                      {notes[azkar.id]}
                    </p>
                  )}
                </div>
              )}

              {/* Counter and Actions */}
              <div className={`flex items-center justify-between border-t pt-4 sm:pt-6 ${isDark ? 'border-white/5' : 'border-slate-300/30'}`}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const note = prompt('أضف ملاحظة على هذا الذكر:', notes[azkar.id] || '');
                      if (note !== null) saveNote(azkar.id, note);
                    }}
                    className={`
                      px-3 sm:px-4 py-2
                      rounded-lg sm:rounded-2xl
                      text-[9px] sm:text-[10px]
                      font-black
                      transition-all active:scale-95
                      ${isDark
                        ? 'bg-sky-700/40 border border-sky-600/50 text-sky-300 hover:bg-sky-700/60'
                        : 'bg-sky-200 border border-sky-300 text-sky-700 hover:bg-sky-300'
                      }
                    `}
                  >
                    📝 ملاحظة
                  </button>
                  <button
                    onClick={() => setProgress(prev => ({ ...prev, [azkar.id]: 0 }))}
                    className={`
                      px-3 sm:px-4 py-2
                      rounded-lg sm:rounded-2xl
                      text-[9px] sm:text-[10px]
                      font-black
                      transition-all active:scale-95
                      ${isDark
                        ? 'bg-amber-700/40 border border-amber-600/50 text-amber-300 hover:bg-amber-700/60'
                        : 'bg-amber-200 border border-amber-300 text-amber-700 hover:bg-amber-300'
                      }
                    `}
                  >
                    🔄 إعادة
                  </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="text-center">
                    <div className={`text-2xl sm:text-3xl font-black glow-gold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      {currentCount}
                    </div>
                    <div className={`text-[8px] font-bold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      مرات
                    </div>
                  </div>
                  <button
                    onClick={() => increment(azkar.id)}
                    className={`
                      w-14 sm:w-16 h-14 sm:h-16
                      rounded-lg sm:rounded-2xl
                      flex items-center justify-center
                      text-2xl sm:text-3xl
                      font-black
                      shadow-lg sm:shadow-xl
                      transition-all active:scale-90
                      ${isDark
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      }
                    `}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {azkarList.length === 0 && (
          <div className={`
            text-center p-8 sm:p-12
            rounded-2xl
            ${isDark
              ? 'bg-slate-900/40 text-slate-400'
              : 'bg-slate-100 text-slate-600'
            }
          `}>
            <p className="font-black text-base sm:text-lg">لم يتم العثور على أذكار تطابق البحث</p>
            <p className={`text-[11px] sm:text-[12px] mt-2 opacity-75 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
              جرب كلمات أخرى أو غير الفئة المختارة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Azkar;

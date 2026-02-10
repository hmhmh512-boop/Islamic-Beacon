import React, { useState } from 'react';
import { RAMADAN_AZKAR, RamadanAzkar } from '../constants/ramadanContent';
import { useTheme } from '../context/ThemeContext';
import ExpandableText from './ExpandableText';

const RamadanSpecial: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string>('suhoor');
  const [expandedNoteIds, setExpandedNoteIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});

  const categories = [
    { key: 'suhoor', label: '🌙 السحور', emoji: '🍽️' },
    { key: 'iftar', label: '🌅 الإفطار', emoji: '🥤' },
    { key: 'fasting', label: '⏳ الصيام', emoji: '🙏' },
    { key: 'taraweeh', label: '📿 التراويح', emoji: '📖' },
    { key: 'qiyam', label: '✨ القيام', emoji: '🌃' },
    { key: 'dua', label: '🤲 الدعاء', emoji: '💫' },
    { key: 'charity', label: '❤️ الصدقة', emoji: '🎁' },
  ];

  const filteredAzkar = RAMADAN_AZKAR.filter(a => a.category === activeCategory);

  const getDynamicClasses = () => {
    if (isDark) {
      return {
        bg: 'bg-slate-950',
        headerGradient: 'from-purple-900 via-red-900 to-slate-950',
        headerText: 'text-amber-400',
        headerBorder: 'border-purple-700/50',
        text: 'text-slate-100',
        textSecondary: 'text-slate-300',
        cardBg: 'bg-slate-900/60',
        cardBorder: 'border-purple-700/30',
        categoryBg: 'bg-purple-800/50',
        categoryActive: 'bg-purple-700 border-purple-600',
        categoryInactive: 'bg-slate-800 border-slate-700',
        transliterationBg: 'bg-blue-900/30 border-blue-700/30',
        transliterationText: 'text-blue-300',
        meaningBg: 'bg-emerald-900/30 border-emerald-700/30',
        meaningText: 'text-emerald-300',
        rewardBg: 'bg-rose-900/30 border-rose-700/30',
        rewardText: 'text-rose-300',
        sourceBg: 'bg-amber-900/30 border-amber-700/30',
        sourceText: 'text-amber-300',
        timingBg: 'bg-sky-900/30 border-sky-700/30',
        timingText: 'text-sky-300',
        tipsText: 'text-slate-200',
        emptyBg: 'bg-slate-900/40',
        emptyText: 'text-slate-400',
      };
    }
    return {
      bg: 'bg-gradient-to-b from-red-50 to-pink-50',
      headerGradient: 'from-purple-600 via-red-600 to-pink-600',
      headerText: 'text-amber-100',
      headerBorder: 'border-purple-400',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      cardBg: 'bg-white border-purple-200',
      cardBorder: 'border-purple-300',
      categoryBg: 'bg-purple-100',
      categoryActive: 'bg-purple-600 border-purple-700 text-white',
      categoryInactive: 'bg-white border-purple-200 text-slate-700',
      transliterationBg: 'bg-blue-100 border-blue-300',
      transliterationText: 'text-blue-800',
      meaningBg: 'bg-emerald-100 border-emerald-300',
      meaningText: 'text-emerald-800',
      rewardBg: 'bg-rose-100 border-rose-300',
      rewardText: 'text-rose-800',
      sourceBg: 'bg-amber-100 border-amber-300',
      sourceText: 'text-amber-800',
      timingBg: 'bg-sky-100 border-sky-300',
      timingText: 'text-sky-800',
      tipsText: 'text-slate-800',
      emptyBg: 'bg-slate-100',
      emptyText: 'text-slate-600',
    };
  };

  const classes = getDynamicClasses();

  const toggleExpandNote = (id: string) => {
    setExpandedNoteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={`${classes.bg} animate-fade-in space-y-6 sm:space-y-8 pb-32 w-full`}>
      {/* Header */}
      <div className={`bg-gradient-to-b ${classes.headerGradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mx-2 sm:mx-3 md:mx-4 text-white shadow-2xl relative overflow-hidden border-b-4 sm:border-b-8 ${classes.headerBorder}`}>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black quran-text ${classes.headerText} glow-gold mb-3`}>
          🌙 أذكار رمضان المبارك 🌙
        </h2>
        <p className="text-[10px] sm:text-[11px] font-bold opacity-80 uppercase tracking-widest">
          أذكار وأدعية شاملة لشهر الرحمة والمغفرة
        </p>
        <span className="absolute top-4 right-4 text-6xl sm:text-8xl opacity-20">🕌</span>
      </div>

      {/* Categories */}
      <div className="px-2 sm:px-3 md:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-[10px] md:text-[11px] transition-all border-2 sm:border-3 ${
                activeCategory === cat.key
                  ? `${classes.categoryActive}`
                  : `${classes.categoryInactive} hover:bg-opacity-80`
              }`}
            >
              {cat.emoji}
              <br />
              {cat.label.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Azkar List */}
      <div className="px-2 sm:px-3 md:px-4 space-y-4 sm:space-y-6">
        {filteredAzkar.length > 0 ? (
          filteredAzkar.map(azkar => (
            <div
              key={azkar.id}
              className={`${classes.cardBg} p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl border-l-4 sm:border-l-8 ${classes.cardBorder} border-b-4 sm:border-b-8 border-purple-500/50 shadow-lg transition-all hover:shadow-xl`}
            >
              {/* Title */}
              <h3 className={`text-lg sm:text-xl md:text-2xl font-black ${isDark ? 'text-purple-400' : 'text-purple-700'} mb-3 sm:mb-4`}>
                {azkar.titleArabic}
              </h3>

              {/* Main Zikr */}
              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} p-4 sm:p-6 rounded-lg sm:rounded-xl mb-4 sm:mb-6 border-r-4 ${isDark ? 'border-purple-500' : 'border-purple-400'}`}>
                <p className={`text-lg sm:text-xl md:text-2xl leading-loose text-right font-bold quran-text ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  "{azkar.zikr}"
                </p>
              </div>

              {/* Details Grid */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {/* Transliteration */}
                {azkar.transliteration && (
                  <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${classes.transliterationBg}`}>
                    <span className={`text-lg sm:text-xl ${classes.transliterationText} mt-1 flex-shrink-0`}>🔤</span>
                    <div className="flex-1">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.transliterationText} mb-2`}>
                        النطق اللاتيني
                      </p>
                      <p className={`text-[10px] sm:text-[11px] font-bold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {azkar.transliteration}
                      </p>
                    </div>
                  </div>
                )}

                {/* Meaning */}
                {azkar.meaning && (
                  <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${classes.meaningBg}`}>
                    <span className={`text-lg sm:text-xl ${classes.meaningText} mt-1 flex-shrink-0`}>💭</span>
                    <div className="flex-1">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.meaningText} mb-2`}>
                        المعنى
                      </p>
                      <ExpandableText
                        text={azkar.meaning}
                        maxLength={120}
                        isDark={isDark}
                        className={`text-[10px] sm:text-[11px] font-bold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                      />
                    </div>
                  </div>
                )}

                {/* Reward */}
                {azkar.reward && (
                  <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${classes.rewardBg}`}>
                    <span className={`text-lg sm:text-xl ${classes.rewardText} mt-1 flex-shrink-0`}>🏆</span>
                    <div className="flex-1">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.rewardText} mb-2`}>
                        الفضل والثواب
                      </p>
                      <ExpandableText
                        text={azkar.reward}
                        maxLength={120}
                        isDark={isDark}
                        className={`text-[10px] sm:text-[11px] font-bold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                      />
                    </div>
                  </div>
                )}

                {/* Source */}
                {azkar.source && (
                  <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${classes.sourceBg}`}>
                    <span className={`text-lg sm:text-xl ${classes.sourceText} mt-1 flex-shrink-0`}>📚</span>
                    <div className="flex-1">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.sourceText} mb-2`}>
                        المصدر
                      </p>
                      <p className={`text-[10px] sm:text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {azkar.source}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timing */}
                {azkar.timing && (
                  <div className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border ${classes.timingBg}`}>
                    <span className={`text-lg sm:text-xl ${classes.timingText} mt-1 flex-shrink-0`}>⏰</span>
                    <div className="flex-1">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.timingText} mb-2`}>
                        الوقت والتكرار
                      </p>
                      <p className={`text-[10px] sm:text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {azkar.timing}
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Tips */}
                {azkar.additionalTips && (
                  <div className={`${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-100 border-slate-300'} flex items-start gap-3 p-3 sm:p-4 rounded-lg border`}>
                    <span className={`text-lg sm:text-xl ${isDark ? 'text-amber-400' : 'text-amber-600'} mt-1 flex-shrink-0`}>💡</span>
                    <div className="flex-1">
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'} mb-2`}>
                        نصائح مهمة
                      </p>
                      <p className={`text-[10px] sm:text-[11px] font-bold ${classes.tipsText}`}>
                        {azkar.additionalTips}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              {notes[azkar.id] && (
                <div className={`${isDark ? 'bg-sky-900/20 border-sky-700/30' : 'bg-sky-100 border-sky-300'} border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6`}>
                  <p className={`font-black text-[9px] sm:text-[10px] mb-2 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                    📝 ملاحظة:
                  </p>
                  <p className={`text-[10px] sm:text-[11px] whitespace-pre-wrap font-bold ${isDark ? 'text-sky-200' : 'text-sky-800'}`}>
                    {notes[azkar.id]}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    const note = prompt('أضف ملاحظة على هذا الذكر:', notes[azkar.id] || '');
                    if (note !== null) {
                      setNotes(prev => ({ ...prev, [azkar.id]: note }));
                    }
                  }}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-black rounded-lg transition-all ${
                    isDark
                      ? 'bg-purple-700/40 hover:bg-purple-700/60 text-purple-300 border border-purple-600/50'
                      : 'bg-purple-200 hover:bg-purple-300 text-purple-800 border border-purple-400'
                  }`}
                >
                  📝 ملاحظة
                </button>
                <button
                  onClick={() => setNotes(prev => ({ ...prev, [azkar.id]: '' }))}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-black rounded-lg transition-all ${
                    isDark
                      ? 'bg-red-700/40 hover:bg-red-700/60 text-red-300 border border-red-600/50'
                      : 'bg-red-200 hover:bg-red-300 text-red-800 border border-red-400'
                  }`}
                >
                  ✕ مسح
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center p-8 sm:p-12 ${classes.emptyBg} rounded-2xl`}>
            <p className={`text-lg sm:text-xl font-black ${classes.emptyText}`}>
              لا توجد أذكار في هذه الفئة
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RamadanSpecial;

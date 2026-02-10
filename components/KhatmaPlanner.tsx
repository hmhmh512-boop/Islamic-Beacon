import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  isRamadanPeriod,
  getDayInRamadan,
  getRamadanDayLabel,
} from '../utils/seasonalModes';
import { RAMADAN_KHATMA_PLAN } from '../constants/ramadanContent';

interface DailyProgress {
  day: number;
  completed: boolean;
  pagesRead: number;
}

const KhatmaPlanner: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [progress, setProgress] = useState<DailyProgress[]>(() => {
    try {
      const saved = localStorage.getItem('khatma_progress_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load Khatma progress', e);
    }
    return RAMADAN_KHATMA_PLAN.map(plan => ({
      day: plan.day,
      completed: false,
      pagesRead: 0,
    }));
  });

  useEffect(() => {
    localStorage.setItem('khatma_progress_v1', JSON.stringify(progress));
  }, [progress]);

  const currentDay = getDayInRamadan() || 1;
  const currentPlan = RAMADAN_KHATMA_PLAN[currentDay - 1];
  const completedDays = progress.filter(p => p.completed).length;

  const getDynamicClasses = () => {
    if (isDark) {
      return {
        bg: 'bg-gradient-to-b from-slate-950 to-blue-950',
        headerGradient: 'from-blue-900 via-indigo-900 to-slate-950',
        headerText: 'text-amber-400',
        headerBorder: 'border-blue-700/50',
        cardBg: 'bg-slate-900/60 border-blue-700/30',
        currentDayBg: 'bg-blue-900/40 border-blue-700/40',
        surahBg: 'bg-slate-800/50 border-slate-700/30',
        progressBg: 'bg-slate-800/50 border-blue-700/30',
        text: 'text-slate-100',
        textSecondary: 'text-slate-300',
        completedBg: 'bg-emerald-900/30 border-emerald-700/40',
        completedText: 'text-emerald-300',
        pendingBg: 'bg-slate-800/50 border-slate-700/40',
        pendingText: 'text-slate-400',
      };
    }
    return {
      bg: 'bg-gradient-to-b from-blue-50 to-cyan-50',
      headerGradient: 'from-blue-600 via-indigo-600 to-cyan-600',
      headerText: 'text-amber-100',
      headerBorder: 'border-blue-400',
      cardBg: 'bg-white border-blue-300',
      currentDayBg: 'bg-blue-100 border-blue-400',
      surahBg: 'bg-white border-blue-200',
      progressBg: 'bg-white border-blue-300',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      completedBg: 'bg-emerald-100 border-emerald-400',
      completedText: 'text-emerald-800',
      pendingBg: 'bg-white border-slate-300',
      pendingText: 'text-slate-600',
    };
  };

  const classes = getDynamicClasses();

  const toggleProgress = (day: number) => {
    setProgress(prev =>
      prev.map(p =>
        p.day === day ? { ...p, completed: !p.completed } : p
      )
    );
  };

  const updatePages = (day: number, pages: number) => {
    setProgress(prev =>
      prev.map(p =>
        p.day === day ? { ...p, pagesRead: pages } : p
      )
    );
  };

  if (!isRamadanPeriod()) {
    return (
      <div className={`${classes.bg} animate-fade-in p-6 sm:p-8 text-center space-y-6 pb-32`}>
        <div className={`${classes.cardBg} p-8 sm:p-12 rounded-3xl border shadow-lg`}>
          <p className={`text-2xl sm:text-3xl font-black mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            📖 مخطط الختمة 📖
          </p>
          <p className={`text-lg sm:text-xl font-bold ${classes.textSecondary}`}>
            سيكون مخطط الختمة اليومي متاحاً خلال شهر رمضان
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${classes.bg} animate-fade-in space-y-6 sm:space-y-8 pb-32 w-full`}>
      {/* Header */}
      <div className={`bg-gradient-to-b ${classes.headerGradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mx-2 sm:mx-3 md:mx-4 text-white shadow-2xl relative overflow-hidden border-b-4 sm:border-b-8 ${classes.headerBorder}`}>
        <div className="absolute top-4 right-4 text-6xl sm:text-8xl opacity-20">📖</div>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black quran-text ${classes.headerText} glow-gold mb-2`}>
          📖 مخطط الختمة اليومي 📖
        </h2>
        <p className="text-[10px] sm:text-[11px] font-bold opacity-80 uppercase tracking-widest">
          اختم القرآن في 30 يوماً مع التدبر والفهم
        </p>
      </div>

      {/* Summary */}
      <div className="px-2 sm:px-3 md:px-4">
        <div className={`${classes.cardBg} p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-lg`}>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className={`${classes.currentDayBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-sm sm:text-base font-black uppercase text-blue-400 mb-2`}>
                اليوم الحالي
              </p>
              <p className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                {currentDay}
              </p>
            </div>

            <div className={`${classes.currentDayBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-sm sm:text-base font-black uppercase text-emerald-400 mb-2`}>
                اكتمل منها
              </p>
              <p className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {completedDays}
              </p>
            </div>

            <div className={`${classes.currentDayBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-sm sm:text-base font-black uppercase text-blue-400 mb-2`}>
                المتبقي
              </p>
              <p className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                {30 - completedDays}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 sm:mt-6">
            <div className={`h-3 sm:h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'} rounded-full overflow-hidden`}>
              <div
                className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500`}
                style={{ width: `${(completedDays / 30) * 100}%` }}
              />
            </div>
            <p className={`text-[8px] sm:text-[9px] font-bold mt-2 text-center ${classes.textSecondary}`}>
              {completedDays} / 30 يوم
            </p>
          </div>
        </div>
      </div>

      {/* Today's Plan */}
      {currentPlan && (
        <div className="px-2 sm:px-3 md:px-4">
          <div className={`${classes.currentDayBg} p-5 sm:p-7 rounded-2xl sm:rounded-3xl border-2 sm:border-4 shadow-2xl`}>
            <h3 className={`text-2xl sm:text-3xl font-black mb-3 sm:mb-4 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
              🎯 مخطط اليوم
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {/* Surah Info */}
              <div className={`${classes.surahBg} p-4 sm:p-6 rounded-xl border-l-4 sm:border-l-8 border-blue-500`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div>
                    <p className={`text-[9px] sm:text-[10px] font-black uppercase ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-1`}>
                      من سورة
                    </p>
                    <p className={`text-sm sm:text-base font-black ${classes.text}`}>
                      {currentPlan.surahStart === currentPlan.surahEnd
                        ? `سورة ${currentPlan.surahStart}`
                        : `سورة ${currentPlan.surahStart} - ${currentPlan.surahEnd}`}
                    </p>
                  </div>

                  {currentPlan.ayahStart && (
                    <div>
                      <p className={`text-[9px] sm:text-[10px] font-black uppercase ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-1`}>
                        الآيات
                      </p>
                      <p className={`text-sm sm:text-base font-black ${classes.text}`}>
                        {currentPlan.ayahStart} - {currentPlan.ayahEnd}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className={`text-[9px] sm:text-[10px] font-black uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'} mb-1`}>
                      الموضوع
                    </p>
                    <p className={`text-sm sm:text-base font-black ${classes.text}`}>
                      {currentPlan.theme}
                    </p>
                  </div>
                </div>

                {/* Spiritual Reflection */}
                <div className={`${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} p-3 sm:p-4 rounded-lg border border-opacity-30`}>
                  <p className={`text-[9px] sm:text-[10px] font-black uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'} mb-2`}>
                    💫 التدبر الروحي
                  </p>
                  <p className={`text-[10px] sm:text-[11px] font-bold leading-relaxed ${classes.text}`}>
                    {currentPlan.spiritualReflection}
                  </p>
                </div>
              </div>

              {/* Progress Input */}
              <div className={`${classes.surahBg} p-4 sm:p-6 rounded-xl border`}>
                <p className={`text-sm sm:text-base font-black mb-3 ${classes.text}`}>
                  صفحات قرأت اليوم
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={progress[currentDay - 1]?.pagesRead || 0}
                    onChange={(e) => updatePages(currentDay, parseInt(e.target.value) || 0)}
                    className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 font-black text-center ${
                      isDark
                        ? 'bg-slate-800 border-blue-700 text-white'
                        : 'bg-white border-blue-400 text-slate-900'
                    }`}
                  />
                  <span className={`font-black text-lg sm:text-xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    صفحة
                  </span>
                </div>
              </div>

              {/* Mark as Completed */}
              <button
                onClick={() => toggleProgress(currentDay)}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-black text-sm sm:text-base transition-all ${
                  progress[currentDay - 1]?.completed
                    ? `${isDark ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`
                    : `${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`
                }`}
              >
                {progress[currentDay - 1]?.completed ? '✓ تم الانتهاء' : '🎯 اكتمال اليوم'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Days Schedule */}
      <div className="px-2 sm:px-3 md:px-4">
        <h3 className={`text-xl sm:text-2xl font-black mb-4 sm:mb-6 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
          📅 جدول الختمة الكامل
        </h3>

        <div className="space-y-3 sm:space-y-4">
          {RAMADAN_KHATMA_PLAN.map((plan) => {
            const dayProgress = progress[plan.day - 1];
            return (
              <div
                key={plan.day}
                className={`p-4 sm:p-6 rounded-xl border-l-4 sm:border-l-8 transition-all cursor-pointer hover:shadow-md ${
                  dayProgress?.completed
                    ? `${classes.completedBg} border-emerald-600`
                    : `${classes.pendingBg} border-blue-600`
                }`}
                onClick={() => toggleProgress(plan.day)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-[10px] sm:text-[11px] ${
                    dayProgress?.completed
                      ? `${isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white'}`
                      : `${isDark ? 'bg-blue-600/40 text-blue-300' : 'bg-blue-200 text-blue-700'}`
                  }`}>
                    {dayProgress?.completed ? '✓' : plan.day}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2">
                      <h4 className={`text-sm sm:text-base font-black ${
                        dayProgress?.completed
                          ? `${isDark ? 'text-emerald-300 line-through' : 'text-emerald-800 line-through'}`
                          : classes.text
                      }`}>
                        اليوم {plan.day}
                      </h4>
                      <span className={`text-[8px] sm:text-[9px] font-black px-2 py-1 rounded-full ${
                        isDark ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-200 text-blue-700'
                      }`}>
                        {plan.theme}
                      </span>
                    </div>

                    <p className={`text-[9px] sm:text-[10px] font-bold mb-2 ${classes.textSecondary}`}>
                      سورة {plan.surahStart}{plan.surahEnd !== plan.surahStart ? ` - ${plan.surahEnd}` : ''}
                      {plan.ayahStart ? ` (الآيات ${plan.ayahStart}-${plan.ayahEnd})` : ''}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className={`text-[9px] sm:text-[10px] font-bold ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
                        {dayProgress?.pagesRead || 0} صفحة
                      </p>
                      {plan.day === currentDay && (
                        <span className={`text-[8px] sm:text-[9px] font-black px-2 py-1 rounded ${
                          isDark ? 'bg-purple-600/30 text-purple-300' : 'bg-purple-200 text-purple-700'
                        }`}>
                          🎯 اليوم
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KhatmaPlanner;

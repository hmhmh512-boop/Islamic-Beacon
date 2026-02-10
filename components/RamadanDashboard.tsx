import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  isRamadanPeriod,
  getDayInRamadan,
  getDaysRemainingInRamadan,
  getRamadanProgress,
  getRamadanDayLabel,
} from '../utils/seasonalModes';
import { RAMADAN_DAILY_MISSIONS, RamadanMission } from '../constants/ramadanContent';

interface RamadanTracking {
  fasting: boolean;
  prayersCompleted: number;
  quranPages: number;
  charitiesDone: number;
  qiyamCompleted: boolean;
  taraweehAttended: boolean;
  missionsCompleted: Set<string>;
}

const RamadanDashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [tracking, setTracking] = useState<RamadanTracking>(() => {
    try {
      const saved = localStorage.getItem('ramadan_tracking_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          missionsCompleted: new Set(parsed.missionsCompleted || []),
        };
      }
    } catch (e) {
      console.warn('Failed to load Ramadan tracking', e);
    }
    return {
      fasting: false,
      prayersCompleted: 0,
      quranPages: 0,
      charitiesDone: 0,
      qiyamCompleted: false,
      taraweehAttended: false,
      missionsCompleted: new Set(),
    };
  });

  const dayNumber = getDayInRamadan();
  const daysRemaining = getDaysRemainingInRamadan();
  const progress = getRamadanProgress();

  useEffect(() => {
    localStorage.setItem('ramadan_tracking_v1', JSON.stringify({
      ...tracking,
      missionsCompleted: Array.from(tracking.missionsCompleted),
    }));
  }, [tracking]);

  const getDynamicClasses = () => {
    if (isDark) {
      return {
        bg: 'bg-gradient-to-b from-slate-950 to-purple-950',
        headerGradient: 'from-purple-900 via-red-900 to-slate-950',
        headerText: 'text-amber-400',
        headerBorder: 'border-purple-700/50',
        cardBg: 'bg-slate-900/60 border-purple-700/30',
        statCardBg: 'bg-purple-900/40 border-purple-700/40',
        progressBg: 'bg-slate-800/50 border-purple-700/30',
        text: 'text-slate-100',
        textSecondary: 'text-slate-300',
        buttonActive: 'bg-emerald-700 hover:bg-emerald-600 text-white',
        buttonInactive: 'bg-slate-700/40 hover:bg-slate-700/60 text-slate-400',
        missionCompleted: 'bg-emerald-900/30 border-emerald-700/40',
        missionPending: 'bg-slate-800/50 border-slate-700/40',
      };
    }
    return {
      bg: 'bg-gradient-to-b from-red-50 via-pink-50 to-purple-50',
      headerGradient: 'from-purple-600 via-red-600 to-pink-600',
      headerText: 'text-amber-100',
      headerBorder: 'border-purple-400',
      cardBg: 'bg-white border-purple-300',
      statCardBg: 'bg-purple-100 border-purple-400',
      progressBg: 'bg-white border-purple-300',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      buttonActive: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      buttonInactive: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
      missionCompleted: 'bg-emerald-100 border-emerald-400',
      missionPending: 'bg-white border-slate-300',
    };
  };

  const classes = getDynamicClasses();

  const getTodaysMissions = (): RamadanMission[] => {
    if (!dayNumber) return [];
    return RAMADAN_DAILY_MISSIONS.filter(m => m.day === dayNumber);
  };

  const toggleMission = (missionId: string) => {
    setTracking(prev => {
      const newSet = new Set(prev.missionsCompleted);
      if (newSet.has(missionId)) {
        newSet.delete(missionId);
      } else {
        newSet.add(missionId);
      }
      return { ...prev, missionsCompleted: newSet };
    });
  };

  const toggleFasting = () => setTracking(prev => ({ ...prev, fasting: !prev.fasting }));
  const toggleQiyam = () => setTracking(prev => ({ ...prev, qiyamCompleted: !prev.qiyamCompleted }));
  const toggleTaraweeh = () => setTracking(prev => ({ ...prev, taraweehAttended: !prev.taraweehAttended }));

  const addPrayerCompletion = () => setTracking(prev => ({ ...prev, prayersCompleted: prev.prayersCompleted + 1 }));
  const addQuranPages = () => setTracking(prev => ({ ...prev, quranPages: prev.quranPages + 1 }));
  const addCharity = () => setTracking(prev => ({ ...prev, charitiesDone: prev.charitiesDone + 1 }));

  if (!isRamadanPeriod()) {
    return (
      <div className={`${classes.bg} animate-fade-in p-6 sm:p-8 text-center space-y-6 pb-32`}>
        <div className={`${classes.cardBg} p-8 sm:p-12 rounded-3xl border shadow-lg`}>
          <p className={`text-2xl sm:text-3xl font-black mb-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
            🌙 لسنا في رمضان 🌙
          </p>
          <p className={`text-lg sm:text-xl font-bold ${classes.textSecondary}`}>
            ستكون لوحة معلومات رمضان متاحة خلال شهر الرحمة والمغفرة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${classes.bg} animate-fade-in space-y-6 sm:space-y-8 pb-32 w-full`}>
      {/* Main Header */}
      <div className={`bg-gradient-to-b ${classes.headerGradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mx-2 sm:mx-3 md:mx-4 text-white shadow-2xl relative overflow-hidden border-b-4 sm:border-b-8 ${classes.headerBorder}`}>
        <div className="absolute top-4 right-4 text-6xl sm:text-8xl opacity-20">🕌</div>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black quran-text ${classes.headerText} glow-gold mb-2`}>
          🌙 لوحة رمضان 🌙
        </h2>
        <p className="text-[10px] sm:text-[11px] font-bold opacity-80 uppercase tracking-widest">
          تتبع عبادتك وإحرزك التقدم خلال شهر البركة
        </p>
      </div>

      {/* Progress Overview */}
      <div className="px-2 sm:px-3 md:px-4 space-y-4 sm:space-y-6">
        {/* Day Info Card */}
        <div className={`${classes.cardBg} p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-lg`}>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* Current Day */}
            <div className={`${classes.statCardBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-sm sm:text-base font-black uppercase text-purple-400 mb-2`}>
                اليوم الحالي
              </p>
              <p className={`text-3xl sm:text-4xl md:text-5xl font-black ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                {dayNumber}
              </p>
              <p className={`text-[8px] sm:text-[9px] font-bold mt-2 ${classes.textSecondary}`}>
                {getRamadanDayLabel(dayNumber || 1).split(' ')[1]}
              </p>
            </div>

            {/* Days Remaining */}
            <div className={`${classes.statCardBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-sm sm:text-base font-black uppercase text-amber-400 mb-2`}>
                الأيام المتبقية
              </p>
              <p className={`text-3xl sm:text-4xl md:text-5xl font-black ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
                {daysRemaining}
              </p>
              <p className={`text-[8px] sm:text-[9px] font-bold mt-2 ${classes.textSecondary}`}>
                من 30 يوماً
              </p>
            </div>

            {/* Progress % */}
            <div className={`${classes.statCardBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-sm sm:text-base font-black uppercase text-emerald-400 mb-2`}>
                التقدم
              </p>
              <p className={`text-3xl sm:text-4xl md:text-5xl font-black ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                {progress}%
              </p>
              <p className={`text-[8px] sm:text-[9px] font-bold mt-2 ${classes.textSecondary}`}>
                من الشهر
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 sm:mt-6">
            <div className={`h-3 sm:h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'} rounded-full overflow-hidden`}>
              <div
                className={`h-full bg-gradient-to-r from-purple-500 to-red-500 transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`text-[8px] sm:text-[9px] font-bold mt-2 text-center ${classes.textSecondary}`}>
              {dayNumber} / 30 يوم
            </p>
          </div>
        </div>

        {/* Daily Tracking */}
        <div className={`${classes.cardBg} p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-lg`}>
          <h3 className={`text-xl sm:text-2xl font-black mb-4 sm:mb-6 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
            📊 تتبع اليوم
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {/* Fasting */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 bg-opacity-50 transition-all"
              style={{
                borderColor: tracking.fasting ? (isDark ? '#10b981' : '#059669') : (isDark ? '#6b7280' : '#d1d5db'),
                backgroundColor: tracking.fasting ? (isDark ? '#064e3b' : '#d1fae5') : (isDark ? '#1f2937' : '#f3f4f6'),
              }}>
              <div className="flex-1">
                <p className={`font-black ${tracking.fasting ? (isDark ? 'text-emerald-300' : 'text-emerald-800') : classes.textSecondary}`}>
                  ⏳ الصيام
                </p>
              </div>
              <button
                onClick={toggleFasting}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-black text-[9px] sm:text-[10px] transition-all ${
                  tracking.fasting ? classes.buttonActive : classes.buttonInactive
                }`}
              >
                {tracking.fasting ? '✓ صائم' : 'بدء الصيام'}
              </button>
            </div>

            {/* Prayers Completed */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 bg-opacity-50">
              <div className="flex-1">
                <p className={`font-black ${classes.text}`}>
                  🕌 الصلوات المكملة
                </p>
                <p className={`text-[9px] sm:text-[10px] font-bold ${classes.textSecondary}`}>
                  {tracking.prayersCompleted} / 5 صلوات
                </p>
              </div>
              <button
                onClick={addPrayerCompletion}
                disabled={tracking.prayersCompleted >= 5}
                className={`px-3 sm:px-4 py-2 rounded-lg font-black text-[9px] sm:text-[10px] transition-all ${
                  tracking.prayersCompleted >= 5
                    ? 'bg-emerald-600 text-white cursor-default'
                    : `${classes.buttonInactive}`
                }`}
              >
                + إضافة
              </button>
            </div>

            {/* Quran Pages */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 bg-opacity-50">
              <div className="flex-1">
                <p className={`font-black ${classes.text}`}>
                  📖 صفحات القرآن
                </p>
                <p className={`text-[9px] sm:text-[10px] font-bold ${classes.textSecondary}`}>
                  {tracking.quranPages} صفحة
                </p>
              </div>
              <button
                onClick={addQuranPages}
                className={`px-3 sm:px-4 py-2 rounded-lg font-black text-[9px] sm:text-[10px] transition-all ${classes.buttonInactive}`}
              >
                + إضافة
              </button>
            </div>

            {/* Charity Actions */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 bg-opacity-50">
              <div className="flex-1">
                <p className={`font-black ${classes.text}`}>
                  ❤️ أعمال الخير
                </p>
                <p className={`text-[9px] sm:text-[10px] font-bold ${classes.textSecondary}`}>
                  {tracking.charitiesDone} عمل خير
                </p>
              </div>
              <button
                onClick={addCharity}
                className={`px-3 sm:px-4 py-2 rounded-lg font-black text-[9px] sm:text-[10px] transition-all ${classes.buttonInactive}`}
              >
                + إضافة
              </button>
            </div>

            {/* Qiyam */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 bg-opacity-50 transition-all"
              style={{
                borderColor: tracking.qiyamCompleted ? (isDark ? '#3b82f6' : '#1d4ed8') : (isDark ? '#6b7280' : '#d1d5db'),
                backgroundColor: tracking.qiyamCompleted ? (isDark ? '#1e3a8a' : '#dbeafe') : (isDark ? '#1f2937' : '#f3f4f6'),
              }}>
              <div className="flex-1">
                <p className={`font-black ${tracking.qiyamCompleted ? (isDark ? 'text-blue-300' : 'text-blue-800') : classes.textSecondary}`}>
                  ✨ قيام الليل
                </p>
              </div>
              <button
                onClick={toggleQiyam}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-black text-[9px] sm:text-[10px] transition-all ${
                  tracking.qiyamCompleted ? classes.buttonActive : classes.buttonInactive
                }`}
              >
                {tracking.qiyamCompleted ? '✓ قمت' : 'قيام'}
              </button>
            </div>

            {/* Taraweeh */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border-2 bg-opacity-50 transition-all"
              style={{
                borderColor: tracking.taraweehAttended ? (isDark ? '#f97316' : '#c2410c') : (isDark ? '#6b7280' : '#d1d5db'),
                backgroundColor: tracking.taraweehAttended ? (isDark ? '#431407' : '#ffedd5') : (isDark ? '#1f2937' : '#f3f4f6'),
              }}>
              <div className="flex-1">
                <p className={`font-black ${tracking.taraweehAttended ? (isDark ? 'text-orange-300' : 'text-orange-800') : classes.textSecondary}`}>
                  📿 التراويح
                </p>
              </div>
              <button
                onClick={toggleTaraweeh}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-black text-[9px] sm:text-[10px] transition-all ${
                  tracking.taraweehAttended ? classes.buttonActive : classes.buttonInactive
                }`}
              >
                {tracking.taraweehAttended ? '✓ حضرت' : 'حضور'}
              </button>
            </div>
          </div>
        </div>

        {/* Daily Missions */}
        {getTodaysMissions().length > 0 && (
          <div className={`${classes.cardBg} p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-lg`}>
            <h3 className={`text-xl sm:text-2xl font-black mb-4 sm:mb-6 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              🎯 مهام اليوم
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {getTodaysMissions().map(mission => (
                <div
                  key={mission.id}
                  className={`p-4 sm:p-6 rounded-xl border-l-4 sm:border-l-8 transition-all cursor-pointer hover:shadow-md ${
                    tracking.missionsCompleted.has(mission.id)
                      ? `${classes.missionCompleted} border-emerald-600`
                      : `${classes.missionPending} border-purple-600`
                  }`}
                  onClick={() => toggleMission(mission.id)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-[10px] sm:text-[11px] ${
                      tracking.missionsCompleted.has(mission.id)
                        ? `${isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white'}`
                        : `${isDark ? 'bg-purple-600/40 text-purple-300' : 'bg-purple-200 text-purple-700'}`
                    }`}>
                      {tracking.missionsCompleted.has(mission.id) ? '✓' : '○'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm sm:text-base font-black mb-1 ${
                        tracking.missionsCompleted.has(mission.id)
                          ? `${isDark ? 'text-emerald-300 line-through' : 'text-emerald-800 line-through'}`
                          : classes.text
                      }`}>
                        {mission.title}
                      </h4>
                      <p className={`text-[9px] sm:text-[10px] font-bold mb-2 ${classes.textSecondary}`}>
                        {mission.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-[8px] sm:text-[9px] font-black px-2 py-1 rounded ${
                          mission.difficulty === 'easy'
                            ? 'bg-emerald-600/20 text-emerald-300'
                            : mission.difficulty === 'medium'
                            ? 'bg-amber-600/20 text-amber-300'
                            : 'bg-red-600/20 text-red-300'
                        }`}>
                          {mission.difficulty === 'easy' ? '⭐ سهلة' : mission.difficulty === 'medium' ? '⭐⭐ متوسطة' : '⭐⭐⭐ صعبة'}
                        </span>
                      </div>
                      <p className={`text-[9px] sm:text-[10px] font-bold ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
                        🏆 {mission.reward}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Summary */}
        <div className={`${classes.cardBg} p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-lg`}>
          <h3 className={`text-xl sm:text-2xl font-black mb-4 sm:mb-6 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
            📈 ملخص الإنجازات
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className={`${classes.statCardBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-amber-400' : 'text-amber-600'} mb-1`}>
                {tracking.prayersCompleted * 20}%
              </p>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.textSecondary}`}>
                اكتمال الصلوات
              </p>
            </div>

            <div className={`${classes.statCardBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-1`}>
                {tracking.quranPages}
              </p>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.textSecondary}`}>
                صفحات قرآن
              </p>
            </div>

            <div className={`${classes.statCardBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'} mb-1`}>
                {tracking.charitiesDone}
              </p>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.textSecondary}`}>
                أعمال خير
              </p>
            </div>

            <div className={`${classes.statCardBg} p-4 sm:p-6 rounded-xl border text-center`}>
              <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-purple-400' : 'text-purple-600'} mb-1`}>
                {tracking.missionsCompleted.size}/{getTodaysMissions().length}
              </p>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase ${classes.textSecondary}`}>
                مهام اليوم
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RamadanDashboard;

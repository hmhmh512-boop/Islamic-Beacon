import React, { useEffect, useState, useRef } from 'react';
import { DHIKRS, TasbihSession, DhikrConfig } from '../interactive-tools-data';

interface TasbihState {
  sessions: TasbihSession[];
  dailyGoal: Record<string, number>;
  streaks: Record<string, number>;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const Tasbih: React.FC = () => {
  const [count, setCount] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [activeDhikr, setActiveDhikr] = useState<DhikrConfig>(DHIKRS[0]);
  const [target, setTarget] = useState<number>(DHIKRS[0].recommended);
  const [sessions, setSessions] = useState<TasbihSession[]>([]);
  const [dailyGoals, setDailyGoals] = useState<Record<string, number>>({});
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [showHistory, setShowHistory] = useState(false);
  const [showGoalSetting, setShowGoalSetting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('tasbih_state_v2');
      if (savedState) {
        const state: TasbihState = JSON.parse(savedState);
        setSessions(state.sessions || []);
        setDailyGoals(state.dailyGoal || {});
        setStreaks(state.streaks || {});
        setSoundEnabled(state.soundEnabled !== false);
        setVibrationEnabled(state.vibrationEnabled !== false);
      }
    } catch (e) {
      console.warn('Failed to load tasbih state', e);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const state: TasbihState = {
        sessions,
        dailyGoal: dailyGoals,
        soundEnabled,
        vibrationEnabled,
        streaks
      };
      localStorage.setItem('tasbih_state_v2', JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save tasbih state', e);
    }
  }, [sessions, dailyGoals, soundEnabled, vibrationEnabled, streaks]);

  // Check for streak continuation
  useEffect(() => {
    const today = new Date().toDateString();
    const lastSession = sessions.find(s => s.dhikr === activeDhikr.text && s.date === today);
    
    if (!lastSession && sessions.length > 0) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const yesterdaySession = sessions.find(s => s.dhikr === activeDhikr.text && s.date === yesterday);
      
      if (yesterdaySession) {
        setStreaks(prev => ({
          ...prev,
          [activeDhikr.text]: (prev[activeDhikr.text] || 1) + 1
        }));
      } else {
        setStreaks(prev => ({
          ...prev,
          [activeDhikr.text]: 0
        }));
      }
    }
  }, [activeDhikr, sessions]);

  const playSound = () => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Soft gentle click/tap sound - lower frequency, very short duration
      oscillator.frequency.value = 400; // Soft frequency
      oscillator.type = 'sine'; // Smooth wave
      
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime); // Lower volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08); // Shorter duration, faster fade
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  const vibrate = () => {
    if (!vibrationEnabled || !navigator.vibrate) return;
    navigator.vibrate([30, 10, 30]);
  };

  const increment = () => {
    setCount(prev => prev + 1);
    setSessionTotal(prev => prev + 1);
    playSound();
    vibrate();

    if ((count + 1) % 10 === 0) {
      navigator.vibrate?.([50, 20, 50]);
    }
  };

  const skipTen = () => {
    setCount(prev => prev + 10);
    setSessionTotal(prev => prev + 10);
    playSound();
    vibrate();
  };

  const reset = () => {
    if (confirm('هل تريد إعادة تعيين هذه الجلسة؟')) {
      setCount(0);
    }
  };

  const endSession = () => {
    if (sessionTotal === 0) return;

    const now = new Date();
    const session: TasbihSession = {
      id: `${Date.now()}`,
      dhikr: activeDhikr.text,
      count: sessionTotal,
      date: now.toDateString(),
      time: now.toLocaleTimeString('ar-SA'),
      duration: Math.floor((Date.now() - sessionStartTime) / 1000)
    };

    setSessions(prev => [session, ...prev]);

    const today = new Date().toDateString();
    const todayTotal = sessions
      .filter(s => s.date === today && s.dhikr === activeDhikr.text)
      .reduce((sum, s) => sum + s.count, 0) + sessionTotal;

    setDailyGoals(prev => ({
      ...prev,
      [activeDhikr.text]: todayTotal
    }));

    setCount(0);
    setSessionTotal(0);
    setSessionStartTime(Date.now());

    alert(`✅ تم حفظ الجلسة: ${sessionTotal} تسبيحة`);
  };

  const getTodayTotal = (dhikr: string) => {
    const today = new Date().toDateString();
    return sessions
      .filter(s => s.date === today && s.dhikr === dhikr)
      .reduce((sum, s) => sum + s.count, 0);
  };

  const getTotalCount = (dhikr: string) => {
    return sessions
      .filter(s => s.dhikr === dhikr)
      .reduce((sum, s) => sum + s.count, 0);
  };

  const progressPercentage = target > 0 ? Math.min((count / target) * 100, 100) : 0;
  const todayProgress = getTodayTotal(activeDhikr.text);
  const allTimeTotal = getTotalCount(activeDhikr.text);
  const currentStreak = streaks[activeDhikr.text] || 0;

  return (
    <div className="animate-fade-in space-y-8 pb-32 w-full">
      {/* Main Counter */}
      <div className="mx-2 rounded-[3rem] p-12 bg-gradient-to-br from-emerald-950 to-emerald-900 shadow-2xl border-b-8 border-emerald-600 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-6xl opacity-10">📿</div>

        {/* Dhikr Title */}
        <h2 className="text-4xl font-black quran-text text-center text-amber-400 glow-gold mb-4">
          {activeDhikr.arabic}
        </h2>
        <p className="text-center text-slate-200 text-sm mb-8 font-bold">
          {activeDhikr.note}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-emerald-800/40 rounded-2xl p-4 border border-emerald-600/30">
            <p className="text-emerald-300 text-[10px] font-black uppercase">الهدف</p>
            <p className="text-amber-400 text-3xl font-black">{target}</p>
          </div>
          <div className="bg-emerald-800/40 rounded-2xl p-4 border border-emerald-600/30">
            <p className="text-emerald-300 text-[10px] font-black uppercase">اليوم</p>
            <p className="text-amber-400 text-3xl font-black">{todayProgress}</p>
          </div>
          <div className="bg-emerald-800/40 rounded-2xl p-4 border border-emerald-600/30">
            <p className="text-emerald-300 text-[10px] font-black uppercase">الإجمالي</p>
            <p className="text-amber-400 text-3xl font-black">{allTimeTotal}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-300 uppercase">تقدم الجلسة</span>
            <span className="text-[10px] font-black text-amber-300">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full h-3 bg-emerald-800 rounded-full overflow-hidden border border-emerald-600/50">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Main Counter Circle */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-48 h-48 rounded-full border-8 border-amber-500 bg-emerald-800/50 flex items-center justify-center shadow-2xl mb-6 cursor-pointer active:scale-90 transition-all" onClick={increment}>
            <div className="absolute inset-2 rounded-full border-4 border-amber-400/30"></div>
            <div className="text-center">
              <div className="text-7xl font-black text-amber-400 glow-gold leading-none">
                {count}
              </div>
              <div className="text-amber-200 text-sm font-bold mt-2">تسبيحة</div>
            </div>
          </div>

          {/* Streak Display */}
          {currentStreak > 0 && (
            <div className="text-center mb-4">
              <span className="text-3xl">🔥</span>
              <p className="text-amber-300 font-black text-xl">{currentStreak} أيام</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={increment}
            className="py-8 rounded-[2rem] bg-emerald-700 hover:bg-emerald-600 text-white font-black text-3xl shadow-2xl active:scale-90 transition-all border-b-4 border-emerald-900"
          >
            ➕
          </button>
          <button
            onClick={skipTen}
            className="py-6 rounded-[2rem] bg-amber-700 hover:bg-amber-600 text-white font-black text-2xl shadow-2xl active:scale-90 transition-all border-b-4 border-amber-900"
          >
            +10
          </button>
          <button
            onClick={reset}
            className="py-6 rounded-[2rem] bg-red-700/60 hover:bg-red-700 text-white font-black text-sm shadow-xl active:scale-90 transition-all"
          >
            🔄 إعادة تعيين
          </button>
          <button
            onClick={endSession}
            className="py-6 rounded-[2rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl active:scale-90 transition-all"
          >
            💾 حفظ الجلسة
          </button>
        </div>

        {/* Reward Info */}
        <div className="bg-emerald-800/40 border border-emerald-600/50 rounded-2xl p-4">
          <p className="text-[10px] text-emerald-300 font-black uppercase mb-2">🏆 الفضل:</p>
          <p className="text-amber-200 font-bold text-sm">{activeDhikr.reward}</p>
          {activeDhikr.relatedVerse && (
            <p className="text-slate-300 text-[10px] mt-2">📖 {activeDhikr.relatedVerse}</p>
          )}
        </div>
      </div>

      {/* Dhikr Selection */}
      <div className="mx-2 space-y-3">
        <h3 className="text-xl font-black text-amber-400 px-4">📿 اختر الذكر</h3>
        <div className="grid grid-cols-2 gap-3 px-2">
          {DHIKRS.map((dhikr, idx) => {
            const todayCount = getTodayTotal(dhikr.text);
            const isActive = activeDhikr.text === dhikr.text;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveDhikr(dhikr);
                  setTarget(dhikr.recommended);
                  setCount(0);
                  setSessionStartTime(Date.now());
                }}
                className={`p-4 rounded-2xl transition-all border-b-4 active:scale-95 ${
                  isActive
                    ? 'bg-emerald-700 border-emerald-900 text-white scale-105 shadow-xl'
                    : 'bg-slate-800 border-slate-900 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="text-3xl mb-2">{dhikr.emoji}</div>
                <p className="text-[10px] font-black leading-tight">{dhikr.text}</p>
                {todayCount > 0 && (
                  <p className="text-[8px] text-emerald-200 mt-1">✓ {todayCount}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Section */}
      <div className="mx-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-4 rounded-2xl font-black text-sm bg-indigo-700 text-white flex items-center justify-center gap-2"
        >
          📚 معلومات الذكر
        </button>
        {showDetails && (
          <div className="mt-3 bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase mb-1">العدد المستحب:</p>
              <p className="text-amber-400 font-bold">{activeDhikr.recommended} مرات</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase mb-1">وقت الذكر:</p>
              <p className="text-amber-200 text-sm">{activeDhikr.timing}</p>
            </div>
            {activeDhikr.relatedHadith && (
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">🕯️ الحديث:</p>
                <p className="text-slate-300 text-[11px]">{activeDhikr.relatedHadith}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="mx-2 space-y-3">
        <h3 className="text-xl font-black text-amber-400 px-4">⚙️ الإعدادات</h3>
        <div className="space-y-2 px-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-full p-4 rounded-2xl font-black text-sm flex items-center justify-between ${
              soundEnabled
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span>🔊 الأصوات</span>
            <span>{soundEnabled ? '✓' : '✗'}</span>
          </button>
          <button
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`w-full p-4 rounded-2xl font-black text-sm flex items-center justify-between ${
              vibrationEnabled
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span>📳 الاهتزاز</span>
            <span>{vibrationEnabled ? '✓' : '✗'}</span>
          </button>
          <button
            onClick={() => setShowGoalSetting(!showGoalSetting)}
            className="w-full p-4 rounded-2xl font-black text-sm bg-amber-700 text-white flex items-center justify-center gap-2"
          >
            🎯 تعيين الهدف اليومي
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-4 rounded-2xl font-black text-sm bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            📊 سجل الجلسات
          </button>
        </div>
      </div>

      {/* Daily Goal Setting */}
      {showGoalSetting && (
        <div className="mx-2 bg-amber-900/30 border border-amber-600/50 rounded-2xl p-6 space-y-4">
          <h4 className="text-amber-400 font-black">تعيين الهدف اليومي</h4>
          <div className="space-y-3">
            {DHIKRS.map((dhikr, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-2xl">{dhikr.emoji}</span>
                <input
                  type="number"
                  value={dailyGoals[dhikr.text] || dhikr.recommended}
                  onChange={(e) =>
                    setDailyGoals(prev => ({
                      ...prev,
                      [dhikr.text]: parseInt(e.target.value) || 0
                    }))
                  }
                  className="flex-1 px-3 py-2 bg-slate-800 border border-amber-600/30 rounded-lg text-white font-bold"
                />
                <span className="text-sm text-slate-400 w-12 text-right">{dhikr.text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowGoalSetting(false)}
            className="w-full p-3 bg-emerald-700 text-white rounded-xl font-black"
          >
            ✓ تم
          </button>
        </div>
      )}

      {/* Session History */}
      {showHistory && (
        <div className="mx-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-amber-400">📊 سجل الجلسات</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="bg-slate-800/50 rounded-2xl p-8 text-center">
              <p className="text-slate-400 font-black">لا توجد جلسات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(0, 20).map((session, idx) => (
                <div
                  key={session.id}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-black text-amber-400 text-sm">{session.dhikr}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {session.date} - {session.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-400">{session.count}</p>
                    <p className="text-[8px] text-slate-400 mt-1">{session.duration}s</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="mx-2 bg-slate-800/50 rounded-2xl p-6 space-y-4">
        <h3 className="text-amber-400 font-black text-lg">📈 إحصائيات</h3>
        <div className="grid grid-cols-2 gap-4">
          {DHIKRS.slice(0, 4).map((dhikr, idx) => {
            const total = getTotalCount(dhikr.text);
            return (
              <div
                key={idx}
                className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50"
              >
                <p className="text-[10px] text-slate-400 font-black uppercase mb-2">
                  {dhikr.text}
                </p>
                <p className="text-3xl font-black text-emerald-400">{total}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tasbih;

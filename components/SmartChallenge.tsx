
import React, { useState, useEffect } from 'react';
import { generateSmartQuiz } from '../geminiService';
import { QuizQuestion } from '../types';
import { QUIZ_POOL } from '../constants';
import { DAILY_MISSIONS, DailyMission } from '../daily-missions';

const SmartChallenge: React.FC = () => {
  const [view, setView] = useState<'missions' | 'quiz'>('missions');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`missions_${today}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [dailyScore, setDailyScore] = useState(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`daily_score_${today}`);
    return saved ? Number(saved) : 0;
  });

  // Save completed missions daily
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`missions_${today}`, JSON.stringify(completedMissions));
  }, [completedMissions]);

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`daily_score_${today}`, dailyScore.toString());
  }, [dailyScore]);

  const toggleMissionCompletion = (missionId: string, reward: number) => {
    if (completedMissions.includes(missionId)) {
      setCompletedMissions(completedMissions.filter(id => id !== missionId));
      setDailyScore(Math.max(0, dailyScore - reward));
    } else {
      setCompletedMissions([...completedMissions, missionId]);
      setDailyScore(dailyScore + reward);
    }
  };

  const loadQuiz = async () => {
    setLoading(true);
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const localSelection = [...QUIZ_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuestions(localSelection);
      setLoading(false);
      setCurrentIndex(0);
      setScore(0);
      setSelected(null);
      setShowExp(false);
      return;
    }

    const data = await generateSmartQuiz();
    if (data && data.length) {
      setQuestions(data);
    } else {
      const fallbackSelection = [...QUIZ_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
      setQuestions(fallbackSelection);
    }
    setLoading(false);
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setShowExp(false);
  };

  useEffect(() => { 
    if (view === 'quiz') {
      loadQuiz();
    }
  }, [view]);

  if (loading && view === 'quiz') return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-amber-500 font-black text-xl animate-pulse">
        يجري تجهيز تحدي الأسئلة من بنك الذكاء الاصطناعي أو من القاعدة المحلية حسب حال اتصالك بالشبكة
      </p>
    </div>
  );

  if (view === 'missions') {
    const salatMissions = DAILY_MISSIONS.filter(m => m.category === 'salat');
    const sawmMissions = DAILY_MISSIONS.filter(m => m.category === 'sawm');
    const prophetBlessingsMissions = DAILY_MISSIONS.filter(m => m.category === 'prophetBlessings');
    const charityMissions = DAILY_MISSIONS.filter(m => m.category === 'charity');

    const MissionCard: React.FC<{ mission: DailyMission }> = ({ mission }) => {
      const isCompleted = completedMissions.includes(mission.id);
      
      return (
        <div className={`luxury-card p-4 border-r-4 rounded-2xl transition-all ${
          isCompleted 
            ? 'border-green-600 bg-green-900/30 opacity-75' 
            : 'border-amber-600 bg-slate-800/70 hover:bg-slate-800'
        }`}>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={() => toggleMissionCompletion(mission.id, mission.reward)}
              className="w-6 h-6 mt-1 cursor-pointer accent-green-600"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h4 className={`font-black text-lg ${isCompleted ? 'text-green-300 line-through' : 'text-amber-400'}`}>
                  {mission.icon} {mission.nameArabic}
                </h4>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${
                  isCompleted ? 'bg-green-700 text-green-100' : 'bg-amber-900 text-amber-200'
                }`}>
                  +{mission.reward} نقاط
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-bold leading-relaxed">{mission.description}</p>
              {mission.relatedVerse && (
                <p className="text-[9px] text-blue-300 font-bold bg-blue-900/30 px-2 py-1 rounded inline-block">
                  📖 {mission.relatedVerse}
                </p>
              )}
              {mission.relatedHadith && (
                <p className="text-[9px] text-emerald-300 font-bold bg-emerald-900/30 px-2 py-1 rounded inline-block">
                  🕌 {mission.relatedHadith}
                </p>
              )}
              {isCompleted && (
                <p className="text-[10px] text-green-300 font-black italic">{mission.completionText}</p>
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6 animate-fade-in pb-32 w-full">
        {/* Header */}
        <div className="theme-gradient-header p-8 rounded-[2.5rem] text-white shadow-2xl border-b-8 border-amber-600 mx-2">
          <h2 className="text-3xl font-black quran-text text-amber-400 glow-gold mb-2">المهام اليومية</h2>
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-4">أكمل مهامك يومياً واجمع النقاط</p>
          
          <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <span className="text-[9px] font-black text-amber-200 uppercase">إجمالي نقاطك اليوم</span>
            <span className="text-3xl font-black text-amber-300 glow-gold">{dailyScore}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-2 pb-2">
          <button
            onClick={() => setView('missions')}
            className="px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black bg-amber-900 text-amber-200 transition-all border-b-2 border-amber-700"
          >
            📋 المهام
          </button>
          <button
            onClick={() => setView('quiz')}
            className="px-4 py-2 rounded-2xl whitespace-nowrap text-xs font-black bg-slate-800 text-slate-400 transition-all hover:border-blue-600"
          >
            🧠 المسابقات
          </button>
        </div>

        {/* Missions by Category */}
        <div className="space-y-6 px-2">
          {/* Salat Missions */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">🕌 الصلوات المفروضة</h3>
            <div className="space-y-2">
              {salatMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </div>

          {/* Sawm Missions */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-sky-400 flex items-center gap-2">🌙 الصيام</h3>
            <div className="space-y-2">
              {sawmMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </div>

          {/* Prophet Blessings Missions */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-rose-400 flex items-center gap-2">📿 الصلاة على النبي</h3>
            <div className="space-y-2">
              {prophetBlessingsMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </div>

          {/* Charity Missions */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-green-400 flex items-center gap-2">💚 الأعمال الخيرية</h3>
            <div className="space-y-2">
              {charityMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </div>

          {/* Daily Summary */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-8 border-emerald-500 p-6 rounded-2xl shadow-lg">
            <p className="text-[10px] font-black text-emerald-400 uppercase mb-2">ملخص اليوم</p>
            <p className="text-emerald-200 font-bold mb-3">أكملت {completedMissions.length} مهمة من أصل {DAILY_MISSIONS.length}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all" 
                  style={{ width: `${(completedMissions.length / DAILY_MISSIONS.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-[9px] font-black text-slate-400">{Math.round((completedMissions.length / DAILY_MISSIONS.length) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length && view === 'quiz' && !loading) {
    return (
      <div className="text-center text-red-500 p-10 font-black">
        تعذر تجهيز أي أسئلة في الوقت الحالي، يمكنك العودة لاحقاً أو استخدام قسم المسابقات الكلاسيكية الذي يعمل بشكل كامل دون اتصال.
      </div>
    );
  }

  if (view === 'quiz' && questions.length > 0) {
    const q = questions[currentIndex];

    const handleSelect = (idx: number) => {
      if (showExp) return;
      setSelected(idx);
      setShowExp(true);
      if (idx === q.answerIndex) {
        setScore(score + 1);
        setDailyScore(dailyScore + 10);
      }
    };

    return (
      <div className="space-y-8 animate-fade-in pb-32 px-2 w-full">
        {/* Header */}
        <div className="theme-gradient-header p-6 rounded-[2.5rem] text-white shadow-2xl border-b-8 border-blue-600 mx-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-black quran-text text-blue-400 glow-gold">مسابقات العبادة</h2>
            <button
              onClick={() => setView('missions')}
              className="text-[9px] bg-blue-900/80 text-blue-200 font-black px-3 py-1 rounded-full hover:bg-blue-900 transition-all"
            >
              ← رجوع
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5 mx-2">
          <span className="text-xs font-black text-blue-500">س {currentIndex + 1} / {questions.length}</span>
          <div className="flex gap-2">
            <span className="text-[9px] font-black text-white bg-blue-700/40 px-3 py-1 rounded-xl border border-blue-500/30">النقاط: +{score}</span>
            <span className="text-[9px] font-black text-white bg-emerald-700/40 px-3 py-1 rounded-xl border border-emerald-500/30">اليوم: {dailyScore}</span>
          </div>
        </div>

        {/* Question */}
        <div className="bg-blue-900/40 p-8 rounded-[2.5rem] border border-blue-500/30 shadow-2xl mx-2">
          <h3 className="text-2xl font-black text-blue-400 text-right leading-relaxed quran-text">{q.question}</h3>
          <div className="mt-4 flex items-center justify-between text-[9px]">
            <span className={`font-black px-2 py-1 rounded ${q.difficulty === 'easy' ? 'bg-green-900 text-green-200' : q.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'}`}>
              {q.difficulty === 'easy' ? '⭐ سهل' : q.difficulty === 'medium' ? '⭐⭐ متوسط' : '⭐⭐⭐ صعب'}
            </span>
            <span className="text-slate-300 font-bold">النقاط: +{q.points || 10}</span>
          </div>
        </div>

        {/* Options */}
        <div className="grid gap-3 px-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showExp}
              className={`p-5 rounded-2xl text-right font-bold border-2 transition-all text-lg ${
                showExp 
                  ? i === q.answerIndex ? 'bg-green-900/40 border-green-500 text-green-200' : i === selected ? 'bg-red-900/60 border-red-500 text-red-200' : 'bg-slate-800 opacity-40 border-transparent'
                  : 'bg-slate-800 border-slate-700 hover:border-blue-500 text-slate-200 active:scale-95 shadow-lg'
              }`}
            >
              <span className="inline-block w-8 h-8 rounded-full bg-black/30 text-amber-400 font-black text-sm mr-3">{i + 1}</span>
              {opt}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExp && (
          <div className="bg-emerald-900/20 border-r-8 border-emerald-500 p-6 rounded-2xl animate-fade-in space-y-3 mx-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📜</span>
              <p className="text-[9px] font-black text-emerald-400 uppercase">التوضيح</p>
            </div>
            <p className="text-sm text-emerald-100 mb-3 font-bold leading-relaxed">{q.explanation}</p>
            
            {q.relatedVerse && (
              <p className="text-[9px] text-amber-300 font-bold bg-amber-900/30 px-3 py-2 rounded border border-amber-700/30">
                📖 <strong>الآية:</strong> {q.relatedVerse}
              </p>
            )}
            
            {q.relatedHadith && (
              <p className="text-[9px] text-rose-300 font-bold bg-rose-900/30 px-3 py-2 rounded border border-rose-700/30">
                🕌 <strong>الحديث:</strong> {q.relatedHadith}
              </p>
            )}

            <button 
              onClick={() => {
                if (currentIndex < questions.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setSelected(null);
                  setShowExp(false);
                } else {
                  setView('missions');
                }
              }}
              className="w-full bg-emerald-700 text-white py-4 rounded-xl font-black shadow-lg mt-4 hover:bg-emerald-600 transition-all active:scale-95"
            >
              {currentIndex < questions.length - 1 ? 'السؤال التالي' : 'العودة للمهام'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default SmartChallenge;

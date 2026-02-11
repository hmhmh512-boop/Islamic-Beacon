import React, { useState, useEffect } from 'react';
import { DAILY_MISSIONS, DailyMission, WORSHIP_QUIZZES } from '../daily-missions';
import { useTheme } from '../context/ThemeContext';

interface CompletedMission {
  id: string;
  completedAt: number;
}

const DailyMissionsAndWirds: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'missions' | 'wirds' | 'quizzes'>('missions');
  const [completedMissions, setCompletedMissions] = useState<CompletedMission[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // Load completed missions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('noor_completed_missions_v1');
    if (saved) {
      try {
        const missions = JSON.parse(saved);
        setCompletedMissions(missions);
        
        // Calculate total points
        const points = missions.reduce((sum: number, m: CompletedMission) => {
          const mission = DAILY_MISSIONS.find(d => d.id === m.id);
          return sum + (mission?.reward || 0);
        }, 0);
        setTotalPoints(points);
      } catch (e) {
        console.error('Error loading missions:', e);
      }
    }
  }, []);

  // Save completed missions
  const saveMission = (missionId: string) => {
    if (completedMissions.find(m => m.id === missionId)) {
      return; // Already completed
    }

    const newMission: CompletedMission = {
      id: missionId,
      completedAt: Date.now()
    };

    const updated = [...completedMissions, newMission];
    setCompletedMissions(updated);
    localStorage.setItem('noor_completed_missions_v1', JSON.stringify(updated));

    // Update total points
    const mission = DAILY_MISSIONS.find(d => d.id === missionId);
    setTotalPoints(prev => prev + (mission?.reward || 0));
  };

  const isMissionCompleted = (id: string) => {
    return completedMissions.some(m => m.id === id);
  };

  const getRandomWird = () => {
    const wirds = DAILY_MISSIONS.filter(m => m.category === 'salat' || m.category === 'charity');
    return wirds[Math.floor(Math.random() * wirds.length)];
  };

  const getMissionsByCategory = (category: DailyMission['category']) => {
    return DAILY_MISSIONS.filter(m => m.category === category);
  };

  const classes = {
    bg: isDark ? 'bg-slate-900/60' : 'bg-white',
    border: isDark ? 'border-slate-700/50' : 'border-slate-200',
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
    card: isDark ? 'bg-slate-800/40 border-slate-700/30' : 'bg-slate-50 border-slate-200',
    tabActive: isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
    tabInactive: isDark ? 'bg-slate-800/30 text-slate-400' : 'bg-slate-100 text-slate-600',
    button: isDark ? 'bg-emerald-900 hover:bg-emerald-800 text-emerald-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
  };

  return (
    <div className={`rounded-3xl border ${classes.border} overflow-hidden shadow-xl ${classes.bg}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white mb-1 quran-text">المهمات والورد</h2>
            <p className="text-emerald-100 text-sm">تطور روحاني يومي نحو الجنة</p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2 backdrop-blur-md border border-white/30">
            <p className="text-white text-xs font-bold">النقاط المجموعة</p>
            <p className="text-amber-300 text-2xl font-black">{totalPoints}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex gap-2 p-4 border-b ${classes.border} bg-opacity-50`}>
        <button
          onClick={() => setActiveTab('missions')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all text-sm ${
            activeTab === 'missions' ? classes.tabActive : classes.tabInactive
          }`}
        >
          📋 المهمات
        </button>
        <button
          onClick={() => setActiveTab('wirds')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all text-sm ${
            activeTab === 'wirds' ? classes.tabActive : classes.tabInactive
          }`}
        >
          📿 الأوراد
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all text-sm ${
            activeTab === 'quizzes' ? classes.tabActive : classes.tabInactive
          }`}
        >
          ❓ الاختبارات
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Daily Missions Tab */}
        {activeTab === 'missions' && (
          <div className="space-y-3">
            {/* Salat Missions */}
            <div className="space-y-2">
              <h3 className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                الصلوات المفروضة
              </h3>
              <div className="grid gap-2">
                {getMissionsByCategory('salat').map(mission => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    completed={isMissionCompleted(mission.id)}
                    onComplete={() => saveMission(mission.id)}
                    isDark={isDark}
                    classes={classes}
                  />
                ))}
              </div>
            </div>

            {/* Charity Missions */}
            <div className="space-y-2">
              <h3 className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                الإحسان والصدقة
              </h3>
              <div className="grid gap-2">
                {getMissionsByCategory('charity').map(mission => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    completed={isMissionCompleted(mission.id)}
                    onComplete={() => saveMission(mission.id)}
                    isDark={isDark}
                    classes={classes}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Wirds Tab */}
        {activeTab === 'wirds' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border-2 ${classes.border} ${classes.card}`}>
              <p className={`text-sm mb-3 ${classes.textSecondary}`}>
                اختر ورداً من الأوراد المأثورة:
              </p>
              <WirdOfTheDay isDark={isDark} classes={classes} />
            </div>

            <div className="grid gap-3">
              {DAILY_MISSIONS.filter(m => m.frequency !== 'daily').slice(0, 5).map(wird => (
                <div key={wird.id} className={`p-3 rounded-xl border ${classes.border} ${classes.card}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{wird.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${classes.text}`}>{wird.nameArabic}</p>
                      <p className={`text-xs mt-1 ${classes.textSecondary}`}>{wird.description}</p>
                      {wird.relatedVerse && (
                        <p className={`text-xs mt-2 italic ${isDark ? 'text-amber-300/70' : 'text-amber-700/70'}`}>
                          📖 {wird.relatedVerse}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="space-y-3">
            {WORSHIP_QUIZZES.slice(0, 5).map((quiz, idx) => (
              <div key={idx} className={`p-3 rounded-xl border ${classes.border} ${classes.card}`}>
                <p className={`font-bold text-sm mb-3 ${classes.text}`}>{quiz.question}</p>
                <div className="space-y-2">
                  {quiz.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      className={`w-full text-left p-2 rounded-lg transition-all text-sm font-medium ${
                        optIdx === quiz.answerIndex
                          ? `${classes.button} border-2 ${isDark ? 'border-emerald-400' : 'border-emerald-600'}`
                          : isDark ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <p className={`text-xs mt-3 p-2 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                  {quiz.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface MissionCardProps {
  mission: DailyMission;
  completed: boolean;
  onComplete: () => void;
  isDark: boolean;
  classes: any;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, completed, onComplete, isDark, classes }) => {
  return (
    <div
      onClick={onComplete}
      className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
        completed
          ? isDark
            ? 'bg-emerald-900/30 border-emerald-700/50'
            : 'bg-emerald-50 border-emerald-300'
          : `${classes.border} ${classes.card} hover:border-emerald-400/50`
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`text-2xl flex-shrink-0 ${completed ? 'opacity-100' : 'opacity-75'}`}>
          {mission.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className={`font-bold text-sm ${completed ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : classes.text}`}>
              {mission.nameArabic}
            </p>
            {completed && <span className="text-xs font-bold text-emerald-500">✓</span>}
          </div>
          <p className={`text-xs mt-1 ${classes.textSecondary}`}>{mission.description}</p>
          <div className="flex gap-2 mt-2">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
              ⭐ {mission.reward} نقطة
            </span>
            {mission.relatedVerse && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                📖 قرآن
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface WirdOfTheDayProps {
  isDark: boolean;
  classes: any;
}

const WirdOfTheDay: React.FC<WirdOfTheDayProps> = ({ isDark, classes }) => {
  const [wird, setWird] = useState<DailyMission | null>(null);

  useEffect(() => {
    const wirds = DAILY_MISSIONS.filter(m => ['salat', 'charity'].includes(m.category));
    const selected = wirds[Math.floor(Math.random() * wirds.length)];
    setWird(selected);
  }, []);

  if (!wird) return null;

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-r from-amber-900/20 to-amber-800/20 border-2 border-amber-600/30`}>
      <p className={`text-sm font-bold mb-2 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>الورد الموصى به اليوم:</p>
      <p className={`text-base font-black ${classes.text} mb-3`}>{wird.nameArabic}</p>
      <p className={`text-sm ${classes.textSecondary} mb-3`}>{wird.completionText}</p>
      {wird.relatedHadith && (
        <p className={`text-xs italic p-2 rounded-lg ${isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
          💬 {wird.relatedHadith}
        </p>
      )}
    </div>
  );
};

export default DailyMissionsAndWirds;

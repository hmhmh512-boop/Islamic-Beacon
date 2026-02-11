import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ExpandableText from './ExpandableText';

interface WirdTask {
  id: string;
  category: 'صلوات' | 'قرآن' | 'أذكار' | 'تسبيح';
  task: string;
  target: number;
  unit: string;
  completed: number;
  date: string;
  icon: string;
}

const DailyWird: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [wirds, setWirds] = useState<WirdTask[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Initialize daily wird
  useEffect(() => {
    const savedWirds = localStorage.getItem(`wirds_${selectedDate}`);
    if (savedWirds) {
      setWirds(JSON.parse(savedWirds));
    } else {
      const defaultWirds: WirdTask[] = [
        { id: '1', category: 'صلوات', task: 'صلاة الفجر', target: 1, unit: 'مرة', completed: 0, date: selectedDate, icon: '🌅' },
        { id: '2', category: 'صلوات', task: 'صلاة الظهر', target: 1, unit: 'مرة', completed: 0, date: selectedDate, icon: '🌞' },
        { id: '3', category: 'صلوات', task: 'صلاة العصر', target: 1, unit: 'مرة', completed: 0, date: selectedDate, icon: '🌤️' },
        { id: '4', category: 'صلوات', task: 'صلاة المغرب', target: 1, unit: 'مرة', completed: 0, date: selectedDate, icon: '🌇' },
        { id: '5', category: 'صلوات', task: 'صلاة العشاء', target: 1, unit: 'مرة', completed: 0, date: selectedDate, icon: '🌙' },
        
        { id: '6', category: 'قرآن', task: 'قراءة القرآن', target: 1, unit: 'جزء', completed: 0, date: selectedDate, icon: '📖' },
        { id: '7', category: 'قرآن', task: 'تسميع القرآن', target: 0, unit: 'صفحة', completed: 0, date: selectedDate, icon: '🎙️' },
        
        { id: '8', category: 'أذكار', task: 'أذكار الصباح', target: 1, unit: 'مرة', completed: 0, date: selectedDate, icon: '📿' },
        { id: '9', category: 'أذكار', task: 'أذكار المساء', target: 1, unit: 'مرة', completed: 0, date: selectedDate, icon: '🌙' },
        
        { id: '10', category: 'تسبيح', task: 'سبحان الله وبحمده', target: 100, unit: 'مرة', completed: 0, date: selectedDate, icon: '✨' },
        { id: '11', category: 'تسبيح', task: 'الحمد لله', target: 100, unit: 'مرة', completed: 0, date: selectedDate, icon: '🙏' },
        { id: '12', category: 'تسبيح', task: 'لا إله إلا الله', target: 100, unit: 'مرة', completed: 0, date: selectedDate, icon: '❤️' },
        { id: '13', category: 'تسبيح', task: 'الله أكبر', target: 100, unit: 'مرة', completed: 0, date: selectedDate, icon: '⭐' },
      ];
      setWirds(defaultWirds);
    }
  }, [selectedDate]);

  const updateProgress = (id: string, newCompleted: number) => {
    const updated = wirds.map(w => 
      w.id === id ? { ...w, completed: Math.min(newCompleted, w.target) } : w
    );
    setWirds(updated);
    localStorage.setItem(`wirds_${selectedDate}`, JSON.stringify(updated));
  };

  const getProgressColor = (completed: number, target: number) => {
    const percent = (completed / target) * 100;
    if (percent >= 100) return isDark ? 'from-green-900 to-green-800' : 'from-green-500 to-green-400';
    if (percent >= 75) return isDark ? 'from-blue-900 to-blue-800' : 'from-blue-500 to-blue-400';
    if (percent >= 50) return isDark ? 'from-amber-900 to-amber-800' : 'from-amber-500 to-amber-400';
    return isDark ? 'from-red-900 to-red-800' : 'from-red-500 to-red-400';
  };

  const categoryColors = {
    صلوات: isDark ? 'border-red-600 bg-red-950/30' : 'border-red-400 bg-red-50',
    قرآن: isDark ? 'border-blue-600 bg-blue-950/30' : 'border-blue-400 bg-blue-50',
    أذكار: isDark ? 'border-amber-600 bg-amber-950/30' : 'border-amber-400 bg-amber-50',
    تسبيح: isDark ? 'border-purple-600 bg-purple-950/30' : 'border-purple-400 bg-purple-50',
  };

  const overallProgress = wirds.length > 0 
    ? Math.round((wirds.reduce((sum, w) => sum + (w.completed / w.target), 0) / wirds.length) * 100)
    : 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-4 pb-32`}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-gradient-to-r from-emerald-950 to-slate-900' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}>
          <h1 className={`text-3xl font-black quran-text mb-2 ${isDark ? 'text-emerald-400' : 'text-white'}`}>
            🌟 الورد اليومي
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-white/80'} text-sm`}>
            تابع أوردك القرآنية والعبادية يومياً
          </p>
        </div>

        {/* Date Selector */}
        <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} rounded-2xl p-4 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full p-3 rounded-lg ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'} border text-right`}
          />
        </div>

        {/* Overall Progress */}
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-gradient-to-r from-blue-950 to-slate-900' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
          <div className="flex justify-between items-center mb-3">
            <span className={`font-black text-lg ${isDark ? 'text-blue-400' : 'text-white'}`}>إجمالي التقدم</span>
            <span className={`text-2xl font-black ${overallProgress >= 100 ? 'text-green-400' : 'text-white'}`}>{overallProgress}%</span>
          </div>
          <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-blue-700'}`}>
            <div 
              className={`h-full transition-all duration-500 bg-gradient-to-r from-green-500 to-emerald-400`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Tasks by Category */}
        <div className="space-y-4">
          {['صلوات', 'قرآن', 'أذكار', 'تسبيح'].map(category => {
            const categoryWirds = wirds.filter(w => w.category === category);
            if (categoryWirds.length === 0) return null;

            return (
              <div key={category} className={`rounded-2xl overflow-hidden border-2 ${categoryColors[category]}`}>
                {/* Category Header */}
                <div className={`p-4 font-black text-lg ${
                  category === 'صلوات' ? isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700' :
                  category === 'قرآن' ? isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700' :
                  category === 'أذكار' ? isDark ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700' :
                  isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                }`}>
                  {category}
                </div>

                {/* Tasks */}
                <div className={`p-4 space-y-3 ${isDark ? 'bg-slate-900/50' : 'bg-white/50'}`}>
                  {categoryWirds.map(wird => (
                    <div key={wird.id} className={`rounded-xl p-4 ${isDark ? 'bg-slate-800' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{wird.icon}</span>
                          <div>
                            <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{wird.task}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{wird.target} {wird.unit}</p>
                          </div>
                        </div>
                        <div className={`font-black text-lg ${wird.completed >= wird.target ? 'text-green-500' : isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          {wird.completed}/{wird.target}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className={`w-full h-2 rounded-full overflow-hidden mb-3 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                        <div 
                          className={`h-full transition-all duration-300 bg-gradient-to-r ${getProgressColor(wird.completed, wird.target)}`}
                          style={{ width: `${(wird.completed / wird.target) * 100}%` }}
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => updateProgress(wird.id, wird.completed - 1)}
                          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-900'}`}
                        >
                          ➖
                        </button>
                        <button
                          onClick={() => updateProgress(wird.id, wird.completed + 1)}
                          className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${isDark ? 'bg-emerald-700 hover:bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                        >
                          ✅
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Quote */}
        <div className={`rounded-2xl p-6 border-2 ${isDark ? 'border-amber-700 bg-amber-950/30' : 'border-amber-400 bg-amber-50'}`}>
          <p className={`text-center text-sm font-bold italic ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
            "من حافظ على الأوراد حافظ الله عليه" 🌙
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyWird;

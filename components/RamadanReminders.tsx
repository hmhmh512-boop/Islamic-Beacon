import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { isRamadanPeriod, isTenBlessedDays, getDayInRamadan, getDayInTenDays } from '../utils/seasonalModes';

interface RamadanReminder {
  id: string;
  type: 'dua' | 'charity' | 'forgiveness' | 'family' | 'quran';
  title: string;
  content: string;
  time: string; // HH:MM format
  completed: boolean;
}

const RamadanReminders: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [reminders, setReminders] = useState<RamadanReminder[]>(() => {
    try {
      const saved = localStorage.getItem('ramadan_reminders_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load reminders', e);
    }

    // Default reminders for Ramadan
    return [
      {
        id: 'reminder_suhoor',
        type: 'dua',
        title: 'تذكير السحور والنية',
        content: 'نية الصيام - بسم الله الرحمن الرحيم - نويت أن أصوم غداً من شهر رمضان ابتغاء مرضاة الله تعالى',
        time: '03:00',
        completed: false,
      },
      {
        id: 'reminder_quran_morning',
        type: 'quran',
        title: 'قراءة القرآن الصباح',
        content: 'التزم بقراءة 10 صفحات من القرآن الكريم في الصباح. تدبر معاني الآيات.',
        time: '06:30',
        completed: false,
      },
      {
        id: 'reminder_dhikr_morning',
        type: 'dua',
        title: 'أذكار الصباح',
        content: 'سبحان الله (33 مرة)، والحمد لله (33 مرة)، والله أكبر (34 مرة)، ولا حول ولا قوة إلا بالله العلي العظيم',
        time: '07:00',
        completed: false,
      },
      {
        id: 'reminder_charity_morning',
        type: 'charity',
        title: 'عمل الخير الصباح',
        content: 'قدم صدقة يومية ولو بقليل. الصدقة تطفئ غضب الرب وتقي مصارع السوء.',
        time: '08:00',
        completed: false,
      },
      {
        id: 'reminder_istighfar_noon',
        type: 'forgiveness',
        title: 'الاستغفار في الظهيرة',
        content: 'استغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه (كررها 100 مرة)',
        time: '12:00',
        completed: false,
      },
      {
        id: 'reminder_family_afternoon',
        type: 'family',
        title: 'الاتصال بالأهل',
        content: 'اتصل أو تفقد أحوال الأهل والأقارب. صلة الأرحام تزيد العمر.',
        time: '15:00',
        completed: false,
      },
      {
        id: 'reminder_quran_afternoon',
        type: 'quran',
        title: 'قراءة القرآن بعد العصر',
        content: 'اقرأ 10 صفحات أخرى من القرآن وركز على التدبر والفهم الجيد للآيات.',
        time: '16:30',
        completed: false,
      },
      {
        id: 'reminder_dua_before_iftar',
        type: 'dua',
        title: 'دعاء قبل الإفطار',
        content: 'اللهم لك صمنا وعلى رزقك أفطرنا، فتقبل منا إنك أنت السميع العليم',
        time: '18:30',
        completed: false,
      },
      {
        id: 'reminder_dhikr_evening',
        type: 'dua',
        title: 'أذكار المساء',
        content: 'استعيذ بالله من شرور الليل وتحصن بأذكار المساء الصحيحة',
        time: '19:30',
        completed: false,
      },
      {
        id: 'reminder_taraweeh',
        type: 'quran',
        title: 'صلاة التراويح',
        content: 'حضر صلاة التراويح وركز على تدبر القرآن وقلبك معلق بالله تعالى',
        time: '21:00',
        completed: false,
      },
      {
        id: 'reminder_charity_evening',
        type: 'charity',
        title: 'عمل الخير المساء',
        content: 'ساعد شخصاً محتاجاً أو أطعم فقيراً في المساء. الصدقة من أحب الأعمال.',
        time: '20:00',
        completed: false,
      },
      {
        id: 'reminder_qiyam',
        type: 'dua',
        title: 'قيام الليل',
        content: 'قم بركعات من قيام الليل وتضرع إلى الله بصدق وخشوع. ادع بما تشاء.',
        time: '23:30',
        completed: false,
      },
    ];
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ramadan_reminders_v1', JSON.stringify(reminders));
  }, [reminders]);

  // Reset completed status at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setReminders(prev => prev.map(r => ({ ...r, completed: false })));
      }
    };

    const interval = setInterval(checkMidnight, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getDynamicClasses = () => {
    if (isDark) {
      return {
        bg: 'bg-gradient-to-b from-slate-950 to-rose-950',
        headerGradient: 'from-rose-900 via-pink-900 to-slate-950',
        headerText: 'text-rose-400',
        headerBorder: 'border-rose-700/50',
        cardBg: 'bg-slate-900/60 border-rose-700/30',
        reminderBg: 'bg-slate-800/50 border-rose-700/40',
        text: 'text-slate-100',
        textSecondary: 'text-slate-300',
        duaBg: 'bg-blue-900/30 border-blue-700/30',
        duaText: 'text-blue-300',
        charityBg: 'bg-emerald-900/30 border-emerald-700/30',
        charityText: 'text-emerald-300',
        forgivenessText: 'text-purple-300',
        familyBg: 'bg-orange-900/30 border-orange-700/30',
        familyText: 'text-orange-300',
        quranBg: 'bg-amber-900/30 border-amber-700/30',
        quranText: 'text-amber-300',
      };
    }
    return {
      bg: 'bg-gradient-to-b from-rose-50 to-pink-50',
      headerGradient: 'from-rose-600 via-pink-600 to-rose-600',
      headerText: 'text-white',
      headerBorder: 'border-rose-400',
      cardBg: 'bg-white border-rose-300',
      reminderBg: 'bg-white border-rose-200',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      duaBg: 'bg-blue-100 border-blue-300',
      duaText: 'text-blue-800',
      charityBg: 'bg-emerald-100 border-emerald-300',
      charityText: 'text-emerald-800',
      forgivenessText: 'text-purple-800',
      familyBg: 'bg-orange-100 border-orange-300',
      familyText: 'text-orange-800',
      quranBg: 'bg-amber-100 border-amber-300',
      quranText: 'text-amber-800',
    };
  };

  const classes = getDynamicClasses();

  const toggleCompleted = (id: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const getTypeIcon = (type: RamadanReminder['type']) => {
    switch (type) {
      case 'dua': return '🤲';
      case 'charity': return '❤️';
      case 'forgiveness': return '✨';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'quran': return '📖';
      default: return '⭐';
    }
  };

  const completedCount = reminders.filter(r => r.completed).length;

  if (!isRamadanPeriod() && !isTenBlessedDays()) {
    return (
      <div className={`${classes.bg} animate-fade-in p-6 sm:p-8 text-center space-y-6 pb-32`}>
        <div className={`${classes.cardBg} p-8 sm:p-12 rounded-3xl border shadow-lg`}>
          <p className={`text-2xl sm:text-3xl font-black mb-4 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
            🔔 تذكيرات يومية 🔔
          </p>
          <p className={`text-lg sm:text-xl font-bold ${classes.textSecondary}`}>
            ستكون التذكيرات اليومية متاحة خلال شهر رمضان والعشر من ذي الحجة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${classes.bg} animate-fade-in space-y-6 sm:space-y-8 pb-32 w-full`}>
      {/* Header */}
      <div className={`bg-gradient-to-b ${classes.headerGradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mx-2 sm:mx-3 md:mx-4 text-white shadow-2xl relative overflow-hidden border-b-4 sm:border-b-8 ${classes.headerBorder}`}>
        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black quran-text ${classes.headerText} glow-gold mb-3`}>
          🔔 التذكيرات اليومية 🔔
        </h2>
        <p className="text-[10px] sm:text-[11px] font-bold opacity-80 uppercase tracking-widest">
          تذكيرات روحية يومية لتنظيم عبادتك وطاعتك
        </p>

        <div className="mt-4 p-3 sm:p-4 bg-white/10 rounded-lg border border-white/20">
          <p className="text-sm sm:text-base font-black">
            {completedCount} من {reminders.length} تذكير مكتمل ✓
          </p>
          <div className={`h-2 sm:h-3 ${isDark ? 'bg-white/20' : 'bg-white/30'} rounded-full overflow-hidden mt-2`}>
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-400 transition-all duration-500"
              style={{ width: `${(completedCount / reminders.length) * 100}%` }}
            />
          </div>
        </div>

        <span className="absolute top-4 right-4 text-6xl sm:text-8xl opacity-20">🕌</span>
      </div>

      {/* Reminders List */}
      <div className="px-2 sm:px-3 md:px-4 space-y-3 sm:space-y-4">
        {reminders.map(reminder => (
          <div
            key={reminder.id}
            className={`${classes.reminderBg} p-4 sm:p-6 rounded-xl sm:rounded-2xl border-l-4 sm:border-l-8 transition-all ${
              reminder.type === 'dua'
                ? classes.duaBg
                : reminder.type === 'charity'
                ? classes.charityBg
                : reminder.type === 'forgiveness'
                ? `${classes.reminderBg} border-purple-700/40`
                : reminder.type === 'family'
                ? classes.familyBg
                : classes.quranBg
            } ${reminder.completed ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3 sm:gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === reminder.id ? null : reminder.id)}>
              <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-lg transition-all ${
                reminder.completed
                  ? `${isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white'}`
                  : `${isDark ? 'bg-rose-600/40 text-rose-300' : 'bg-rose-200 text-rose-700'}`
              }`}>
                {reminder.completed ? '✓' : getTypeIcon(reminder.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`text-sm sm:text-base font-black ${
                    reminder.completed
                      ? `${isDark ? 'text-slate-500 line-through' : 'text-slate-400 line-through'}`
                      : classes.text
                  }`}>
                    {reminder.title}
                  </h4>
                  <span className={`text-[8px] sm:text-[9px] font-black px-2 py-1 rounded-full ${
                    reminder.type === 'dua'
                      ? `${isDark ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-200 text-blue-700'}`
                      : reminder.type === 'charity'
                      ? `${isDark ? 'bg-emerald-600/30 text-emerald-300' : 'bg-emerald-200 text-emerald-700'}`
                      : reminder.type === 'forgiveness'
                      ? `${isDark ? 'bg-purple-600/30 text-purple-300' : 'bg-purple-200 text-purple-700'}`
                      : reminder.type === 'family'
                      ? `${isDark ? 'bg-orange-600/30 text-orange-300' : 'bg-orange-200 text-orange-700'}`
                      : `${isDark ? 'bg-amber-600/30 text-amber-300' : 'bg-amber-200 text-amber-700'}`
                  }`}>
                    {reminder.time}
                  </span>
                </div>

                {expandedId === reminder.id && (
                  <div className={`mt-3 p-3 sm:p-4 rounded-lg border ${
                    isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100 border-slate-300'
                  }`}>
                    <p className={`text-[10px] sm:text-[11px] font-bold leading-relaxed ${classes.textSecondary}`}>
                      {reminder.content}
                    </p>
                  </div>
                )}

                <p className={`text-[8px] sm:text-[9px] font-bold mt-2 ${classes.textSecondary}`}>
                  {expandedId === reminder.id ? '▼ اضغط للإغلاق' : '▶ اضغط لعرض التفاصيل'}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompleted(reminder.id);
                }}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-[9px] sm:text-[10px] font-black rounded-lg transition-all flex-shrink-0 ${
                  reminder.completed
                    ? `${isDark ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`
                    : `${isDark ? 'bg-rose-700/40 hover:bg-rose-700/60' : 'bg-rose-200 hover:bg-rose-300'} ${isDark ? 'text-rose-300' : 'text-rose-700'}`
                }`}
              >
                {reminder.completed ? '✓' : 'تم'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="px-2 sm:px-3 md:px-4">
        <div className={`${classes.cardBg} p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-lg`}>
          <h3 className={`text-xl sm:text-2xl font-black mb-4 sm:mb-6 ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
            💡 نصائح مهمة
          </h3>

          <ul className="space-y-3 sm:space-y-4">
            <li className={`flex gap-3 ${classes.text}`}>
              <span className="text-lg sm:text-xl flex-shrink-0">✓</span>
              <p className="text-[10px] sm:text-[11px] font-bold leading-relaxed">
                اجعل التذكيرات منبهاً لتركيزك على العبادة وليس عبئاً عليك
              </p>
            </li>
            <li className={`flex gap-3 ${classes.text}`}>
              <span className="text-lg sm:text-xl flex-shrink-0">✓</span>
              <p className="text-[10px] sm:text-[11px] font-bold leading-relaxed">
                حاول الالتزام بالوقت المحدد لكل تذكير قدر الإمكان
              </p>
            </li>
            <li className={`flex gap-3 ${classes.text}`}>
              <span className="text-lg sm:text-xl flex-shrink-0">✓</span>
              <p className="text-[10px] sm:text-[11px] font-bold leading-relaxed">
                لا تنسَ أن الأهم هو النية والقلب، لا مجرد إتمام المهام
              </p>
            </li>
            <li className={`flex gap-3 ${classes.text}`}>
              <span className="text-lg sm:text-xl flex-shrink-0">✓</span>
              <p className="text-[10px] sm:text-[11px] font-bold leading-relaxed">
                شارك إنجازاتك مع أهلك وحثهم على الالتزام أيضاً
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RamadanReminders;

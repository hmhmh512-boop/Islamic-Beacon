
import React, { useState, useEffect } from 'react';
import { AppTab } from '../types';
import { PROPHET_STORIES } from '../prophet-stories';
import { useTheme } from '../context/ThemeContext';

interface DashboardProps {
  setActiveTab: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [khatmaCount, setKhatmaCount] = useState(() => Number(localStorage.getItem('noor_khatma_v8') || 0));
  const [featuredProphet, setFeaturedProphet] = useState(() => {
    const savedId = localStorage.getItem('featured_prophet_id');
    if (savedId) {
      const prophet = PROPHET_STORIES.find(p => p.id === Number(savedId));
      return prophet || PROPHET_STORIES[0];
    }
    return PROPHET_STORIES[0];
  });

  useEffect(() => {
    localStorage.setItem('noor_khatma_v8', khatmaCount.toString());
  }, [khatmaCount]);

  const changeFeaturedProphet = () => {
    const randomIndex = Math.floor(Math.random() * PROPHET_STORIES.length);
    const prophet = PROPHET_STORIES[randomIndex];
    setFeaturedProphet(prophet);
    localStorage.setItem('featured_prophet_id', prophet.id.toString());
  };

  const getDynamicClasses = () => {
    if (isDark) {
      return {
        bg: 'bg-slate-950',
        card: 'bg-slate-900/60 border-slate-800',
        text: 'text-slate-100',
        textSecondary: 'text-slate-300',
        headerGradient: 'from-red-900 via-red-950 to-slate-950',
        headerBorder: 'border-amber-600/50',
        headerText: 'text-amber-400',
        cardBg: 'bg-slate-900/50',
        cardBorder: 'border-amber-700/30',
        buttonBg: 'bg-blue-900/80 hover:bg-blue-800',
        buttonText: 'text-blue-200',
        prophetCardGradient: 'from-slate-800 to-slate-900',
        prophetBorder: 'border-blue-700/40',
      };
    }
    return {
      bg: 'bg-gradient-to-b from-green-50 to-white',
      card: 'bg-white border-slate-200',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
      headerGradient: 'from-rose-100 via-pink-50 to-green-50',
      headerBorder: 'border-amber-300',
      headerText: 'text-amber-700',
      cardBg: 'bg-white',
      cardBorder: 'border-amber-200',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      buttonText: 'text-white',
      prophetCardGradient: 'from-slate-50 to-white',
      prophetBorder: 'border-blue-300',
    };
  };

  const classes = getDynamicClasses();

  const primaryItems = [
    { id: AppTab.AZKAR, label: 'أذكار اليوم', icon: '📿', description: 'أذكار الصباح والمساء وأذكار حصن المسلم تعمل كاملة بدون إنترنت.' },
    { id: AppTab.STORIES, label: 'سير الأنبياء', icon: '📚', description: 'قصص الأنبياء مرتبة زمنياً ومعتمدة على القرآن الكريم والسنة الصحيحة.' },
    { id: AppTab.ASSISTANT, label: 'المساعد الذكي', icon: '🕋', description: 'مساعد فقهي يعمل بالذكاء الاصطناعي مع قاعدة معرفية محلية تعمل دون اتصال.' },
    { id: AppTab.ZAKAT, label: 'حاسبة الزكاة', icon: '💰', description: 'حساب نصاب الزكاة ونسبتها مع شرح فقهي مبسط وقابلية إدخال سعر الذهب يدوياً.' }
  ];

  const worshipItems = [
    { id: AppTab.QURAN, label: 'القرآن الكريم', icon: '📖', description: 'تلاوة السور مع دعم الاستماع لعدة قراء.' },
    { id: AppTab.PRAYER_TIMES, label: 'مواقيت الصلاة', icon: '🕌', description: 'جلب المواقيت عبر الإنترنت مع توضيح وضع عدم الاتصال عند انقطاع الشبكة.' },
    { id: AppTab.HISN_ALMUSLIM, label: 'حصن المسلم', icon: '🛡️', description: 'أبواب الأذكار الجامعة المحفوظة محلياً على الجهاز.' },
    { id: AppTab.TASBIH, label: 'المسبحة الرقمية', icon: '💎', description: 'عداد تسبيح دائم العمل دون حاجة للاتصال.' }
  ];

  const knowledgeItems = [
    { id: AppTab.FORTY_HADITH, label: 'الأربعين النووية', icon: '📜', description: 'مجموعة أحاديث الإمام النووي بنصها العربي الكامل وشروح مبسطة.' },
    { id: AppTab.HADITH, label: 'سنن مهجورة', icon: '✨', description: 'تذكير بالسنن النبوية التي قل العمل بها مع نصوصها.' },
    { id: AppTab.QUIZ, label: 'مسابقات دينية', icon: '🏆', description: 'اختبارات ثابتة تعمل بدون إنترنت مع تحديات ذكية عند الاتصال.' },
    { id: AppTab.HAJJ, label: 'دليل الحج والعمرة', icon: '🕋', description: 'خطوات الحج والعمرة بالتفصيل من الإحرام حتى طواف الوداع.' }
  ];

  return (
    <div className={`${classes.bg} animate-fade-in space-y-6 sm:space-y-8 pb-32 w-full max-w-full overflow-x-hidden`}>
      {/* Royal Header */}
      <div className={`bg-gradient-to-b ${classes.headerGradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-2xl text-center space-y-4 relative overflow-hidden mx-2 sm:mx-3 md:mx-4 border-2 ${classes.headerBorder}`}>
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black quran-text ${classes.headerText} glow-gold`}>نور الهدى الملكي</h2>
        <p className="text-[9px] sm:text-[10px] font-bold opacity-80 uppercase tracking-widest">زاد المسلم الشامل</p>
        
        <div className={`${isDark ? 'bg-black/40 border-white/10' : 'bg-white/20 border-white/30'} p-4 sm:p-5 rounded-2xl sm:rounded-3xl border backdrop-blur-md`}>
          <p className="text-[9px] sm:text-[10px] font-black text-amber-200 mb-3 uppercase">إجمالي الختمات</p>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button 
              onClick={() => setKhatmaCount(Math.max(0, khatmaCount - 1))}
              className={`w-9 sm:w-11 h-9 sm:h-11 ${isDark ? 'bg-red-800 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} rounded-xl sm:rounded-lg font-black shadow-lg flex items-center justify-center text-white transition-colors`}
            >
              −
            </button>
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white glow-gold">{khatmaCount}</span>
            <button 
              onClick={() => setKhatmaCount(khatmaCount + 1)}
              className={`w-9 sm:w-11 h-9 sm:h-11 ${isDark ? 'bg-emerald-800 hover:bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'} rounded-xl sm:rounded-lg font-black shadow-lg flex items-center justify-center text-white transition-colors`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Featured Prophet Section */}
      <div className="px-2 sm:px-3 md:px-4">
        <div className={`${isDark ? `bg-gradient-to-br ${classes.prophetCardGradient}` : 'bg-gradient-to-br from-white to-slate-50'} p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-5 shadow-2xl border-l-4 sm:border-l-8 ${classes.prophetBorder}`}>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className={`text-lg sm:text-xl md:text-2xl font-black quran-text ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>النبي المختار</h3>
            <button
              onClick={changeFeaturedProphet}
              className={`text-[8px] sm:text-[9px] ${classes.buttonBg} ${classes.buttonText} font-black px-3 sm:px-4 py-1 sm:py-2 rounded-full transition-all active:scale-90`}
            >
              🔄 عشوائي
            </button>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className={`text-base sm:text-lg md:text-xl font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{featuredProphet.nameArabic}</h4>
              <span className={`text-[8px] sm:text-[9px] font-black px-2 sm:px-3 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-300 text-slate-700'}`}>#{featuredProphet.id}</span>
            </div>
            <p className={`text-[10px] sm:text-[11px] font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{featuredProphet.title}</p>
          </div>

          <div className={`${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-100 border-slate-300'} border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3`}>
            <p className={`text-[9px] sm:text-[10px] font-black uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>الإنجازات</p>
            <p className={`text-[10px] sm:text-[11px] leading-relaxed font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{featuredProphet.mainAchievements}</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <p className={`text-[9px] sm:text-[10px] font-black uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>عدد أحداث الخط الزمني</p>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`flex-1 rounded-full h-2 sm:h-3 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                <div className={`${isDark ? 'bg-blue-500' : 'bg-blue-600'} h-full transition-all`} style={{ width: `${(featuredProphet.timeline.length / 15) * 100}%` }}></div>
              </div>
              <span className={`text-[9px] sm:text-[10px] font-black ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{featuredProphet.timeline.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className={`${isDark ? 'bg-slate-900/70 border-amber-700/30' : 'bg-amber-50 border-amber-300'} border rounded-lg p-2 sm:p-3`}>
              <p className={`text-[8px] sm:text-[9px] font-black uppercase mb-1 sm:mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>الآيات القرآنية</p>
              <p className={`text-lg sm:text-xl md:text-2xl font-black ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{featuredProphet.keyVersesInQuran.length}</p>
            </div>
            <div className={`${isDark ? 'bg-slate-900/70 border-rose-700/30' : 'bg-rose-50 border-rose-300'} border rounded-lg p-2 sm:p-3`}>
              <p className={`text-[8px] sm:text-[9px] font-black uppercase mb-1 sm:mb-2 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>الأحاديث الشريفة</p>
              <p className={`text-lg sm:text-xl md:text-2xl font-black ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>{featuredProphet.hadithReferences.length}</p>
            </div>
          </div>

          <p className={`text-[10px] sm:text-[11px] leading-relaxed font-bold line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{featuredProphet.fullStory}</p>

          <button
            onClick={() => setActiveTab(AppTab.QURAN)}
            className={`w-full ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black py-2 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] transition-all shadow-lg uppercase tracking-widest active:scale-95`}
          >
            📚 اقرأ القصة الكاملة
          </button>
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8 px-2 sm:px-3 md:px-4">
        {/* Primary Items Section */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>أقسام رئيسية</h3>
            <span className={`text-[8px] sm:text-[9px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>أذكار، قصص، مساعد، زكاة</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {primaryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${isDark ? 'bg-gradient-to-br from-red-900/80 to-red-950 border-red-700/50 hover:from-red-900 hover:to-red-900' : 'bg-gradient-to-br from-rose-200 to-rose-100 border-rose-400 hover:from-rose-300 hover:to-rose-200'} p-3 sm:p-4 md:p-5 h-28 sm:h-32 md:h-40 rounded-xl sm:rounded-2xl md:rounded-3xl text-white flex flex-col items-start justify-between gap-1 sm:gap-2 transition-all active:scale-95 border-b-4 sm:border-b-8 border-black/20 text-right shadow-lg`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{item.icon}</span>
                  <span className={`text-[7px] sm:text-[8px] md:text-[9px] font-black ${isDark ? 'bg-black/30' : 'bg-white/30'} px-2 py-0.5 sm:py-1 rounded-full`}>Offline</span>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className={`text-[10px] sm:text-[11px] md:text-[13px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                  <p className={`text-[8px] sm:text-[9px] md:text-[10px] leading-snug font-bold line-clamp-2 ${isDark ? 'text-white/80' : 'text-slate-800/80'}`}>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Worship Items Section */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>عبادات يومية</h3>
            <span className={`text-[8px] sm:text-[9px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>قرآن، صلاة، أذكار، تسبيح</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {worshipItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${isDark ? 'bg-gradient-to-br from-emerald-900/80 to-emerald-950 border-emerald-700/50 hover:from-emerald-900 hover:to-emerald-900' : 'bg-gradient-to-br from-teal-200 to-teal-100 border-teal-400 hover:from-teal-300 hover:to-teal-200'} p-3 sm:p-4 md:p-5 h-28 sm:h-32 md:h-40 rounded-xl sm:rounded-2xl md:rounded-3xl text-white flex flex-col items-start justify-between gap-1 sm:gap-2 transition-all active:scale-95 border-b-4 sm:border-b-8 border-black/20 text-right shadow-lg`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{item.icon}</span>
                  <span className={`text-[7px] sm:text-[8px] md:text-[9px] font-black ${isDark ? 'text-white/70' : 'text-slate-900/70'}`}>يومي</span>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className={`text-[10px] sm:text-[11px] md:text-[13px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                  <p className={`text-[8px] sm:text-[9px] md:text-[10px] leading-snug font-bold line-clamp-2 ${isDark ? 'text-white/80' : 'text-slate-800/80'}`}>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Knowledge Items Section */}
        <section className="space-y-3 sm:space-y-4 pb-4">
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>علم وحديث</h3>
            <span className={`text-[8px] sm:text-[9px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>أحاديث، سنن، مسابقات، حج</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {knowledgeItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${isDark ? 'bg-gradient-to-br from-sky-900/80 to-sky-950 border-sky-700/50 hover:from-sky-900 hover:to-sky-900' : 'bg-gradient-to-br from-blue-200 to-blue-100 border-blue-400 hover:from-blue-300 hover:to-blue-200'} p-3 sm:p-4 md:p-5 h-28 sm:h-32 md:h-40 rounded-xl sm:rounded-2xl md:rounded-3xl text-white flex flex-col items-start justify-between gap-1 sm:gap-2 transition-all active:scale-95 border-b-4 sm:border-b-8 border-black/20 text-right shadow-lg`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{item.icon}</span>
                  <span className={`text-[7px] sm:text-[8px] md:text-[9px] font-black ${isDark ? 'text-white/70' : 'text-slate-900/70'}`}>سنة</span>
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <p className={`text-[10px] sm:text-[11px] md:text-[13px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                  <p className={`text-[8px] sm:text-[9px] md:text-[10px] leading-snug font-bold line-clamp-2 ${isDark ? 'text-white/80' : 'text-slate-800/80'}`}>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState, useRef, useEffect } from 'react';
import { FULL_SURAHS, RECITERS } from '../constants';
import { Surah, Reciter } from '../types';
import { PROPHET_STORIES, getProphetsByAgeGroup } from '../prophet-stories';
import { useTheme } from '../context/ThemeContext';
import enhancedAudioPlayerService from '../services/enhancedAudioPlayerService';

const Quran: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const getDynamicClasses = () => ({
    // Main containers
    mainContainer: isDark ? 'bg-slate-950' : 'bg-slate-50',
    card: isDark ? 'bg-slate-800/60 hover:bg-slate-800' : 'bg-white hover:bg-slate-50',
    cardBg: isDark ? 'bg-slate-900/70' : 'bg-white',
    headerGradient: isDark ? 'from-blue-900 to-blue-950' : 'from-blue-100 to-white',
    stickyBg: isDark ? 'bg-slate-900/95' : 'bg-white/95',
    
    // Text colors
    headingText: isDark ? 'text-white' : 'text-slate-900',
    primaryText: isDark ? 'text-slate-100' : 'text-slate-900',
    secondaryText: isDark ? 'text-slate-400' : 'text-slate-600',
    accentText: isDark ? 'text-amber-400' : 'text-amber-600',
    
    // Border colors
    borderPrimary: isDark ? 'border-amber-700/50' : 'border-amber-300',
    borderSecondary: isDark ? 'border-slate-700' : 'border-slate-300',
    borderAccent: isDark ? 'border-blue-500/30' : 'border-blue-300/50',
    borderGreen: isDark ? 'border-emerald-600' : 'border-emerald-500',
    
    // Interactive elements
    buttonPrimary: isDark ? 'bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-700 disabled:text-gray-400' : 'bg-amber-500 hover:bg-amber-600 text-white disabled:bg-gray-300 disabled:text-gray-500',
    buttonSecondary: isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
    buttonSuccess: isDark ? 'bg-emerald-800 text-white hover:bg-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700',
    
    // Error/alert
    errorBg: isDark ? 'bg-red-900/50 border-red-500' : 'bg-red-50 border-red-300',
    errorText: isDark ? 'text-red-100' : 'text-red-700',
    
    // Special backgrounds - FIXED for consistent dark mode
    quranReaderBg: isDark ? 'bg-slate-900' : 'bg-[#fffbf2]',
    quranReaderText: isDark ? 'text-slate-100' : 'text-[#1f2937]',
    quranBorder: isDark ? 'border-amber-700/30' : 'border-[#d97706]',
  });

  const classes = getDynamicClasses();
  const [view, setView] = useState<'list' | 'reader' | 'prophets'>('list');
  const [prophetView, setProphetView] = useState<'all' | 'children' | 'teens' | 'adults'>('all');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [surahText, setSurahText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [playbackPosition, setPlaybackPosition] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSurah = async (id: number) => {
    setLoading(true);
    setSurahText('');
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setSurahText('يحتاج عرض نص الآيات القرآنية هنا إلى اتصال بالإنترنت لتحميل المصحف من مصدر موثوق، ويمكنك في وضع عدم الاتصال متابعة التلاوة الصوتية أو قراءة المصحف من نسخة ورقية أو تطبيق آخر محفوظ على جهازك.');
        setTotalPages(1);
        return;
      }

      const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}`);
      const data = await res.json();
      const text = data.data.ayahs.map((a: any) => {
        let ayahText = a.text;
        if (id !== 1 && a.numberInSurah === 1 && ayahText.startsWith("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")) {
           ayahText = ayahText.replace("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", "").trim();
        }
        return `<span class="inline-block hover:text-amber-400 transition-colors cursor-pointer">${ayahText}</span> <span class="text-amber-500 font-black text-xl mx-1">﴿${a.numberInSurah}﴾</span>`;
      }).join(' ');
      setSurahText(text);
      // FIX: Calculate total pages (estimate ~20 verses per page based on screen)
      const totalVerses = data.data.ayahs.length;
      setTotalPages(Math.ceil(totalVerses / 20));
    } catch (e) {
      setSurahText("عذراً، تعذر تحميل الآيات حالياً من الخادم البعيد. يرجى التأكد من اتصالك بالإنترنت أو استخدام نسخة المصحف المحفوظة لديك.");
      setTotalPages(1);
    }
    setLoading(false);
  };

  // FIX: Next page navigation - keep audio playing
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // FIX: Previous page navigation - keep audio playing
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlay = async (surah: Surah) => {
    try {
      setAudioError(null);
      const formattedId = surah.id.toString().padStart(3, '0');
      const reciterFolder = selectedReciter.folder || selectedReciter.id;
      const audioAssetPath = `audio/quran/${reciterFolder}/${formattedId}.mp3`;
      const playerId = `quran-${selectedReciter.id}-${surah.id}`;

      if (isPlaying && selectedSurah?.id === surah.id) {
        // Stop current playback
        await nativeMediaPlayerService.stop(playerId);
        setIsPlaying(false);
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
          playbackIntervalRef.current = null;
        }
      } else {
        // Stop any previous playback
        if (selectedSurah) {
          const prevPlayerId = `quran-${selectedReciter.id}-${selectedSurah.id}`;
          await nativeMediaPlayerService.stop(prevPlayerId);
        }

        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
        }

        setSelectedSurah(surah);
        
        // Start new playback with native media player
        await nativeMediaPlayerService.play(
          playerId,
          audioAssetPath,
          (position, duration) => {
            setPlaybackPosition(position);
            setTotalDuration(duration);
          },
          () => {
            // On complete - play next surah automatically
            setIsPlaying(false);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
              playbackIntervalRef.current = null;
            }
            if (surah.id < 114) {
              const nextSurah = FULL_SURAHS[surah.id];
              if (nextSurah) {
                setTimeout(() => handlePlay(nextSurah), 500);
              }
            }
          }
        );

        setIsPlaying(true);

        // Update progress every 500ms
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioError('خطأ في تشغيل الصوت. تأكد من وجود ملفات الصوت المحلية.');
      setIsPlaying(false);
    }
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      if (selectedSurah && isPlaying) {
        const playerId = `quran-${selectedReciter.id}-${selectedSurah.id}`;
        nativeMediaPlayerService.stop(playerId).catch(console.error);
      }
    };
  }, []);

  return (
    <div className={`animate-fade-in space-y-4 sm:space-y-5 md:space-y-6 pb-24 w-full ${classes.mainContainer}`}>
      {view === 'list' && (
        <>
          <div className={`bg-gradient-to-r ${classes.headerGradient} p-6 sm:p-8 md:p-10 rounded-[2.5rem] ${isDark ? 'text-white' : 'text-slate-900'} shadow-2xl relative overflow-hidden mx-2 sm:mx-3 md:mx-4 ${classes.borderPrimary} border-b-4 sm:border-b-6 md:border-b-8 space-y-3 sm:space-y-4`}>
            <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black quran-text ${classes.accentText} glow-gold`}>المصحف الملكي</h3>
            <p className={`text-[10px] sm:text-xs md:text-sm ${isDark ? 'text-white/80' : 'text-slate-700'} font-bold uppercase tracking-widest`}>تلاوة وقراءة 114 سورة مباركة + قصص الأنبياء</p>
            <span className="absolute left-4 bottom-4 text-5xl sm:text-6xl md:text-7xl opacity-20">📖</span>
            
            <button
              onClick={() => setView('prophets')}
              className={`w-full ${classes.buttonPrimary} active:scale-95 font-black py-2 sm:py-3 md:py-4 rounded-2xl text-xs sm:text-sm transition-all shadow-xl border-b-4`}
            >
              📚 قصص الأنبياء والمرسلين
            </button>
          </div>

          <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-3 sm:py-4 px-2 sm:px-3 md:px-4">
            {RECITERS.map(r => (
              <button 
                key={r.id} 
                onClick={() => { setSelectedReciter(r); setIsPlaying(false); if(audioRef.current) audioRef.current.pause(); }}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl whitespace-nowrap text-[10px] sm:text-[11px] font-black transition-all ${isDark ? 'border-slate-700' : 'border-slate-400'} border-b-4 active:scale-95 ${selectedReciter.id === r.id ? `${classes.buttonPrimary} shadow-xl scale-105` : `${classes.buttonSecondary}`}`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {audioError && (
            <div className={`${classes.errorBg} p-3 sm:p-4 rounded-2xl mx-2 sm:mx-3 md:mx-4 text-center ${classes.errorText} text-[9px] sm:text-[10px] font-black animate-pulse border`}>
              ⚠️ {audioError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:gap-4 px-2 sm:px-3 md:px-4">
            {FULL_SURAHS.map(s => (
              <div key={s.id} className={`${classes.card} p-4 sm:p-5 flex items-center justify-between border-r-4 sm:border-r-8 ${isDark ? 'border-emerald-700' : 'border-emerald-600'} shadow-xl transition-colors`}>
                <div className="flex items-center gap-2 sm:gap-4 flex-1">
                  <div className={`w-8 sm:w-10 h-8 sm:h-10 ${isDark ? 'bg-slate-900 text-amber-500' : 'bg-slate-100 text-amber-600'} rounded-xl flex items-center justify-center font-black text-xs sm:text-sm border ${isDark ? 'border-amber-500/20' : 'border-amber-300'}`}>{s.id}</div>
                  <div className="min-w-0">
                    <h4 className={`text-base sm:text-lg font-black quran-text ${classes.accentText}`}>سورة {s.name}</h4>
                    <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ${classes.secondaryText}`}>{s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {s.numberOfAyahs} آية</p>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button onClick={() => { setSelectedSurah(s); setView('reader'); fetchSurah(s.id); }} className={`${classes.buttonSuccess} px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-[8px] sm:text-[9px] font-black shadow-lg active:scale-90 hover:brightness-110`}>قراءة</button>
                  <button onClick={() => handlePlay(s)} className={`w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center text-xs sm:text-sm shadow-xl transition-all active:scale-90 ${isPlaying && selectedSurah?.id === s.id ? 'bg-red-700' : classes.buttonPrimary}`}>
                    {isPlaying && selectedSurah?.id === s.id ? '⏹' : '▶'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'reader' && selectedSurah && (
        <div className="space-y-3 sm:space-y-4 mx-1 sm:mx-2 md:mx-3 animate-slide-up">
           <div className={`sticky top-2 z-40 ${classes.stickyBg} backdrop-blur-xl p-3 sm:p-4 rounded-[2rem] shadow-2xl flex items-center justify-between border ${classes.borderAccent}`}>
              <button onClick={() => { setView('list'); setIsPlaying(false); audioRef.current?.pause(); }} className="w-8 sm:w-10 h-8 sm:h-10 bg-red-900/80 text-white rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shadow-lg active:scale-90">✕</button>
              <div className="text-center flex-1 px-2">
                <h2 className={`text-base sm:text-xl font-black quran-text ${classes.accentText}`}>سورة {selectedSurah.name}</h2>
                <p className={`text-[8px] sm:text-[9px] font-bold ${classes.secondaryText}`}>{selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} - {selectedSurah.numberOfAyahs} آية</p>
              </div>
              <button onClick={() => handlePlay(selectedSurah)} className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-xl transition-all active:scale-90 ${isPlaying ? 'bg-red-600 animate-pulse' : 'bg-emerald-700'}`}>
                {isPlaying ? '⏸' : '▶'}
              </button>
           </div>
           
           <div className={`${classes.quranReaderBg} p-5 sm:p-6 md:p-8 pt-8 sm:pt-10 rounded-[1.5rem] min-h-[70vh] shadow-inner ${classes.quranReaderText} relative`}>
              {/* زخرفة إطار */}
              <div className={`absolute inset-2 border-2 ${classes.quranBorder} rounded-[1rem] pointer-events-none opacity-20`}></div>
              
              {selectedSurah.id !== 1 && selectedSurah.id !== 9 && (
                <div className="text-center mb-6 sm:mb-8 relative">
                   <span className={`text-xl sm:text-2xl quran-text ${classes.accentText} font-black block`}>بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
                   <div className={`h-px w-1/3 ${isDark ? 'bg-amber-700/30' : 'bg-amber-600/30'} mx-auto mt-3 sm:mt-4`}></div>
                </div>
              )}
              
              <div 
                className={`text-xl sm:text-2xl leading-[2.5rem] sm:leading-[3rem] md:leading-[3.2rem] text-justify quran-text font-semibold`}
                style={{ direction: 'rtl' }}
                dangerouslySetInnerHTML={{ __html: loading ? `<div class="text-center py-16 sm:py-20 ${classes.accentText} animate-pulse font-bold">جاري تحميل الآيات الكريمة...</div>` : surahText }}
              >
              </div>
              
              {!loading && (
                <div className="mt-8 sm:mt-10 text-center">
                  <span className={`text-[9px] sm:text-[10px] ${classes.accentText} font-bold`}>صدق الله العظيم</span>
                </div>
              )}
           </div>

           {/* FIX: Add pagination buttons for page navigation */}
           <div className={`flex items-center justify-between gap-2 sm:gap-3 mx-1 sm:mx-2 md:mx-3 ${classes.stickyBg} backdrop-blur-xl p-3 sm:p-4 rounded-[2rem] shadow-2xl border ${classes.borderAccent} sticky bottom-24 z-40`}>
             <button 
               onClick={goToPreviousPage} 
               disabled={currentPage <= 1}
               className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-90 ${classes.buttonPrimary}`}
             >
               ← الصفحة السابقة
             </button>
             <span className={`${classes.primaryText} font-black text-sm sm:text-base`}>
               الصفحة {currentPage} من {totalPages}
             </span>
             <button 
               onClick={goToNextPage} 
               disabled={currentPage >= totalPages}
               className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-90 ${classes.buttonPrimary}`}
             >
               الصفحة التالية →
             </button>
           </div>
        </div>
      )}

      {view === 'prophets' && (
        <div className="space-y-3 sm:space-y-4 animate-slide-up">
          <div className={`sticky top-2 z-40 ${classes.stickyBg} backdrop-blur-xl p-3 sm:p-4 rounded-[2rem] shadow-2xl flex items-center justify-between border ${classes.borderAccent} mx-1 sm:mx-2 md:mx-3`}>
            <button onClick={() => setView('list')} className="w-8 sm:w-10 h-8 sm:h-10 bg-red-900/80 text-white rounded-xl flex items-center justify-center font-black text-lg sm:text-xl shadow-lg active:scale-90">✕</button>
            <h2 className={`text-base sm:text-lg font-black quran-text ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>قصص الأنبياء</h2>
            <div className="w-8 sm:w-10 h-8 sm:h-10"></div>
          </div>

          <div className="px-2 sm:px-3 md:px-4 space-y-2 sm:space-y-3">
            <div className={`${isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-slate-100 border-slate-300'} border rounded-2xl p-2 sm:p-3`}>
              <p className={`text-[9px] sm:text-[10px] ${classes.secondaryText} font-bold leading-relaxed text-right`}>
                قصص الأنبياء والمرسلين مرتبة زمنياً، تجمع بين الأصالة القرآنية والأحاديث الصحيحة. كل قصة تحتوي على خط زمني للأحداث الرئيسية، والآيات القرآنية المتعلقة، والأحاديث الشريفة، والدروس المستفادة. اختر المرحلة العمرية المناسبة لقراءة القصص بأسلوب يتناسب معها.
              </p>
            </div>

            <div className="flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => setProphetView('all')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap text-[10px] sm:text-xs font-black transition-all ${
                  prophetView === 'all'
                    ? `${isDark ? 'bg-blue-900 text-white' : 'bg-blue-600 text-white'}`
                    : `${classes.buttonSecondary}`
                }`}
              >
                جميع الأنبياء
              </button>
              <button
                onClick={() => setProphetView('children')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap text-[10px] sm:text-xs font-black transition-all ${
                  prophetView === 'children'
                    ? `${isDark ? 'bg-green-900 text-green-200' : 'bg-green-600 text-white'}`
                    : `${classes.buttonSecondary}`
                }`}
              >
                👶 أطفال
              </button>
              <button
                onClick={() => setProphetView('teens')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap text-[10px] sm:text-xs font-black transition-all ${
                  prophetView === 'teens'
                    ? `${isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-600 text-white'}`
                    : `${classes.buttonSecondary}`
                }`}
              >
                👨‍🎓 مراهقون
              </button>
              <button
                onClick={() => setProphetView('adults')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl whitespace-nowrap text-[10px] sm:text-xs font-black transition-all ${
                  prophetView === 'adults'
                    ? `${isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-600 text-white'}`
                    : `${classes.buttonSecondary}`
                }`}
              >
                👴 بالغون
              </button>
            </div>
          </div>

          <div className="space-y-4 px-2 pb-20">
            {(prophetView === 'all' ? PROPHET_STORIES : getProphetsByAgeGroup(prophetView as 'children' | 'teens' | 'adults')).map((prophet) => (
              <div key={prophet.id} className="luxury-card p-6 border-b-4 border-blue-800 bg-slate-800/90 rounded-2xl space-y-4">
                {/* Prophet Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-2xl font-black text-blue-400 quran-text">{prophet.nameArabic}</h2>
                    <span className="text-[10px] font-black text-white bg-blue-900 px-3 py-1 rounded-full">{prophet.name}</span>
                  </div>
                  <p className="text-lg font-black text-amber-400">{prophet.title}</p>
                  <div className="flex gap-2 flex-wrap">
                    {prophet.ageGroups.map(age => (
                      <span key={age} className={`text-[9px] font-black px-2 py-1 rounded-full ${
                        age === 'children' ? 'bg-green-900 text-green-200' :
                        age === 'teens' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-purple-900 text-purple-200'
                      }`}>
                        {age === 'children' ? '👶 أطفال' : age === 'teens' ? '👨‍🎓 مراهقون' : '👴 بالغون'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Main Achievements */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-3 space-y-1">
                  <p className="text-[9px] font-black text-amber-400 uppercase">الإنجازات الرئيسية</p>
                  <p className="text-[11px] text-slate-200 font-bold leading-relaxed">{prophet.mainAchievements}</p>
                </div>

                {/* Full Story */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-blue-400 uppercase">القصة الكاملة</p>
                  <pre className="text-[12px] text-slate-100 font-bold leading-relaxed high-contrast-text whitespace-pre-wrap text-right bg-slate-900/40 p-4 rounded-lg border border-slate-700">
                    {prophet.fullStory}
                  </pre>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-emerald-400 uppercase">الخط الزمني للأحداث</p>
                  <div className="space-y-2">
                    {prophet.timeline.map((event, idx) => (
                      <div key={idx} className="bg-slate-900/60 border-r-4 border-emerald-600 p-3 rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{event.icon}</span>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-black text-emerald-300">{event.title}</h4>
                              <span className="text-[9px] text-slate-400 font-bold">{event.year < 0 ? `${Math.abs(event.year)} قبل الهجرة` : `السنة ${event.year}`}</span>
                            </div>
                            <p className="text-[10px] text-slate-300 font-bold">{event.description}</p>
                            {event.quranReference && (
                              <p className="text-[9px] text-blue-300 font-black bg-blue-900/30 px-2 py-1 rounded inline-block">
                                📖 {event.quranReference}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quranic Verses */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-amber-400 uppercase">الآيات القرآنية الرئيسية</p>
                  <div className="space-y-1">
                    {prophet.keyVersesInQuran.map((verse, idx) => (
                      <div key={idx} className="text-[10px] text-amber-200 bg-amber-900/30 p-2 rounded border border-amber-700/50 font-bold">
                        {verse}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hadith References */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-rose-400 uppercase">أحاديث شريفة</p>
                  <div className="space-y-1">
                    {prophet.hadithReferences.map((hadith, idx) => (
                      <div key={idx} className="text-[10px] text-rose-200 bg-rose-900/30 p-2 rounded border border-rose-700/50 font-bold">
                        {hadith}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lessons */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-green-400 uppercase">الدروس المستفادة</p>
                  <div className="space-y-1">
                    {prophet.lessons.map((lesson, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="text-green-400 font-black">✓</span>
                        <p className="text-[10px] text-green-200 font-bold">{lesson}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Prophets */}
                {prophet.relatedProphets.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-cyan-400 uppercase">أنبياء ذوو صلة</p>
                    <div className="flex gap-2 flex-wrap">
                      {prophet.relatedProphets.map((related, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const relatedProphet = PROPHET_STORIES.find(p => p.nameArabic === related);
                            if (relatedProphet) {
                              window.scrollTo({ top: 0 });
                            }
                          }}
                          className="text-[9px] bg-cyan-900/60 text-cyan-200 font-black px-3 py-1 rounded-full border border-cyan-700/50 hover:bg-cyan-900 transition-colors"
                        >
                          {related}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quran;

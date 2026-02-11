import React, { useEffect, useState, useRef } from 'react';
import { AZKAR as BUILTIN_AZKAR } from '../constants';
import { AZKAR_DATABASE, AzkarEntry, searchAzkar, getRandomAzkar } from '../assistant-knowledge-base';
import AzkarService from '../utils/azkarService';
import { useTheme } from '../context/ThemeContext';
import nativeMediaPlayerService from '../services/nativeMediaPlayerService';

/**
 * Enhanced Azkar Component with:
 * - Offline audio playback using Native MediaPlayer
 * - Multiple categories
 * - Progress tracking
 * - Next / Previous buttons
 * - Dark mode support
 */

interface AzkarProps {
  forcedCategory?: string;
}

const AzkarEnhanced: React.FC<AzkarProps> = ({ forcedCategory }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>(forcedCategory || 'صباح');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [azkarList, setAzkarList] = useState<any[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const azkarCategories = [
    { key: 'صباح', label: '🌅 الصباح', emoji: '☀️' },
    { key: 'مساء', label: '🌙 المساء', emoji: '🌙' },
    { key: 'النوم', label: '😴 النوم', emoji: '😴' },
    { key: 'السفر', label: '✈️ السفر', emoji: '✈️' },
    { key: 'الشكر', label: '🙏 الشكر', emoji: '🙏' },
    { key: 'الخوف', label: '💪 القلق', emoji: '💪' },
    { key: 'عام', label: '📿 عام', emoji: '📿' },
  ];

  // Load Azkar
  useEffect(() => {
    if (!activeCategory) return;

    const filtered = AzkarService.getAzkarByCategory(activeCategory);
    
    if (search.trim()) {
      const searched = AzkarService.searchAzkar(search);
      setAzkarList(searched.filter(a => a.category === activeCategory));
    } else {
      setAzkarList(filtered);
    }
    setCurrentIndex(0);
  }, [activeCategory, search]);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('azkar_progress_enhanced');
      if (raw) setProgress(JSON.parse(raw));
      const rawNotes = localStorage.getItem('azkar_notes_enhanced');
      if (rawNotes) setNotes(JSON.parse(rawNotes));
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
  }, []);

  const handlePlay = async (azkar: any) => {
    if (playingId === azkar.id) {
      await nativeMediaPlayerService.stop(azkar.id);
      setPlayingId(null);
    } else {
      setAudioError(null);
      if (playingId) {
        await nativeMediaPlayerService.stop(playingId);
      }

      // Determine asset path
      const categoryMap: Record<string, string> = {
        'صباح': 'morning',
        'مساء': 'evening',
        'النوم': 'sleep',
        'السفر': 'travel',
        'الشكر': 'gratitude',
        'الخوف': 'fear',
        'عام': 'general'
      };
      
      const folder = categoryMap[azkar.category] || 'general';
      const assetPath = `audio/azkar/${folder}/${azkar.id}.mp3`;

      const success = await nativeMediaPlayerService.play(
        azkar.id,
        assetPath,
        undefined,
        () => setPlayingId(null)
      );

      if (success) {
        setPlayingId(azkar.id);
      } else {
        setAudioError('الملف الصوتي غير متوفر أوفلاين');
        setPlayingId(null);
      }
    }
  };

  const incrementProgress = (id: string, count: number) => {
    const currentCount = progress[id] || 0;
    if (currentCount >= count) return;

    const newProgress = {
      ...progress,
      [id]: currentCount + 1,
    };
    setProgress(newProgress);
    localStorage.setItem('azkar_progress_enhanced', JSON.stringify(newProgress));

    // Auto-next if finished
    if (currentCount + 1 === count && currentIndex < azkarList.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 1000);
    }
  };

  const resetProgress = (id: string) => {
    const newProgress = {
      ...progress,
      [id]: 0,
    };
    setProgress(newProgress);
    localStorage.setItem('azkar_progress_enhanced', JSON.stringify(newProgress));
  };

  const currentAzkar = azkarList[currentIndex];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} pb-24`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-black quran-text mb-2 ${isDark ? 'text-amber-400' : 'text-emerald-700'}`}>
            الأذكار الإسلامية
          </h1>
          <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            أذكار المسلم اليومية مع التلاوة الصوتية
          </p>
        </div>

        {/* Search Bar */}
        <div className={`mb-6 ${isDark ? 'bg-slate-900/60' : 'bg-white'} rounded-3xl p-4 border ${isDark ? 'border-slate-800' : 'border-slate-200'} shadow-lg`}>
          <input
            type="text"
            placeholder="🔍 ابحث في الأذكار..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-amber-500 text-right font-bold`}
          />
        </div>

        {/* Categories Scrollable */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-6 scrollbar-hide no-scrollbar">
          {azkarCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setSearch('');
              }}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black transition-all active:scale-95 ${activeCategory === cat.key
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : isDark
                ? 'bg-slate-900 text-slate-400 border border-slate-800'
                : 'bg-white text-slate-600 border border-slate-200'
                }`}
            >
              <span className="ml-2">{cat.emoji}</span>
              {cat.label.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Azkar Card View - Independent Section Style */}
        {currentAzkar ? (
          <div className="space-y-6 animate-fade-in">
            <div className={`relative ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-emerald-100'} rounded-[2.5rem] p-8 sm:p-10 border-b-8 shadow-2xl overflow-hidden`}>
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 ${isDark ? 'bg-amber-400' : 'bg-emerald-500'} rounded-bl-full`} />
              
              {/* Progress Circle/Indicator */}
              <div className="flex justify-between items-center mb-6">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-amber-500' : 'text-emerald-600'}`}>
                  {currentIndex + 1} من {azkarList.length}
                </span>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-emerald-50 text-emerald-700'}`}>
                  {activeCategory}
                </div>
              </div>

              {/* Text */}
              <div className={`text-2xl sm:text-3xl font-bold leading-loose text-center mb-8 quran-text min-h-[150px] flex items-center justify-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {currentAzkar.text}
              </div>

              {/* Counter Button */}
              <button
                onClick={() => incrementProgress(currentAzkar.id, currentAzkar.count)}
                className={`w-full aspect-square max-w-[120px] mx-auto rounded-full flex flex-col items-center justify-center border-8 transition-all active:scale-90 mb-8 shadow-xl ${
                  (progress[currentAzkar.id] || 0) >= currentAzkar.count
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isDark
                    ? 'border-amber-500/30 bg-slate-800 text-amber-400'
                    : 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
                }`}
              >
                <span className="text-4xl font-black">{progress[currentAzkar.id] || 0}</span>
                <div className="w-12 h-px bg-current/30 my-1" />
                <span className="text-xs font-black uppercase">{currentAzkar.count}</span>
              </button>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePlay(currentAzkar)}
                  className={`py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    playingId === currentAzkar.id
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                      : isDark
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {playingId === currentAzkar.id ? '⏹️ إيقاف' : '🔊 استمع'}
                </button>
                <button
                  onClick={() => resetProgress(currentAzkar.id)}
                  className={`py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isDark
                    ? 'bg-slate-800 text-slate-400 border border-slate-700'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  🔄 إعادة
                </button>
              </div>

              {audioError && (
                <p className="text-center text-red-500 text-[10px] font-bold mt-4 animate-bounce">
                  ⚠️ {audioError}
                </p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  currentIndex === 0
                    ? 'opacity-30 grayscale cursor-not-allowed'
                    : isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'
                }`}
              >
                ← السابق
              </button>
              <button
                onClick={() => setCurrentIndex(prev => Math.min(azkarList.length - 1, prev + 1))}
                disabled={currentIndex === azkarList.length - 1}
                className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  currentIndex === azkarList.length - 1
                    ? 'opacity-30 grayscale cursor-not-allowed'
                    : isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'
                }`}
              >
                التالي →
              </button>
            </div>

            {/* Extra Info */}
            <div className={`p-6 rounded-[2rem] ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-amber-50 border-amber-100'} border space-y-4`}>
              {currentAzkar.meaning && (
                <div>
                  <p className={`text-[10px] font-black uppercase mb-1 ${isDark ? 'text-amber-500' : 'text-amber-700'}`}>💡 المعنى والفضل</p>
                  <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{currentAzkar.meaning}</p>
                </div>
              )}
              {currentAzkar.reward && (
                <div className={`p-3 rounded-xl ${isDark ? 'bg-amber-500/10' : 'bg-white'}`}>
                  <p className={`text-[9px] font-black text-amber-600 uppercase mb-1`}>🏆 الثواب</p>
                  <p className={`text-xs font-black ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>{currentAzkar.reward}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`text-center py-20 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <span className="text-6xl block mb-4">📿</span>
            <p className="font-bold">لا توجد أذكار في هذه الفئة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AzkarEnhanced;
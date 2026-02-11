import React, { useState, useRef, useEffect } from 'react';
import { FULL_SURAHS, RECITERS } from '../constants';
import { Surah, Reciter, QuranPage } from '../types';
import QuranPageService from '../utils/quranPageService';
import { useTheme } from '../context/ThemeContext';
import nativeMediaPlayerService from '../services/nativeMediaPlayerService';

const QuranEnhanced: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [view, setView] = useState<'surahs' | 'pages'>('surahs');
  const [selectedSurah, setSelectedSurah] = useState<Surah>(FULL_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [pages, setPages] = useState<QuranPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);

  // Load Quran Data (from API or Cache)
  const loadSurahContent = async (surah: Surah) => {
    setLoading(true);
    setView('pages');
    setSelectedSurah(surah);
    
    try {
      // Try cache first
      let cachedPages = QuranPageService.getCachedPages(surah.id);
      
      if (cachedPages) {
        setPages(cachedPages);
        setCurrentPageIndex(0);
      } else {
        // Fetch from API
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surah.id}`);
        const data = await response.json();
        
        if (data.code === 200) {
          const newPages = QuranPageService.convertToPages(surah.id, data.data.ayahs);
          setPages(newPages);
          QuranPageService.cachePages(surah.id, newPages);
          setCurrentPageIndex(0);
        } else {
          setAudioError('فشل تحميل محتوى السورة');
        }
      }
    } catch (error) {
      console.error('Quran Load Error:', error);
      setAudioError('تأكد من الاتصال بالإنترنت لتحميل السورة لأول مرة');
    }
    setLoading(false);
  };

  const handlePlayPage = async () => {
    if (isPlaying) {
      await nativeMediaPlayerService.stop('quran_playback');
      setIsPlaying(false);
      return;
    }

    setAudioError(null);
    const formattedSurahId = selectedSurah.id.toString().padStart(3, '0');
    const pageNum = pages[currentPageIndex].pageNumber.toString().padStart(3, '0');
    
    // Asset path: audio/quran/{reciter_id}/{surah_id}_{page_id}.mp3
    const assetPath = `audio/quran/${selectedReciter.identifier}/${formattedSurahId}_${pageNum}.mp3`;

    const success = await nativeMediaPlayerService.play(
      'quran_playback',
      assetPath,
      undefined,
      () => setIsPlaying(false)
    );

    if (success) {
      setIsPlaying(true);
    } else {
      setAudioError('التلاوة غير متوفرة أوفلاين لهذا القارئ');
      setIsPlaying(false);
    }
  };

  const currentPage = pages[currentPageIndex];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} pb-32`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Reciter Selector - Floating Style */}
        <div className="sticky top-0 z-30 mb-6">
          <div className={`${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-emerald-100'} backdrop-blur-xl rounded-2xl p-3 border shadow-xl flex items-center justify-between`}>
            <button
              onClick={() => setShowReciterDropdown(!showReciterDropdown)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-black/5 transition-all"
            >
              <span className="text-xl">🎤</span>
              <div className="text-right">
                <p className={`text-[10px] font-black uppercase ${isDark ? 'text-amber-500' : 'text-emerald-600'}`}>القارئ المختار</p>
                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedReciter.name}</p>
              </div>
            </button>

            {view === 'pages' && (
              <button
                onClick={() => setView('surahs')}
                className={`px-4 py-2 rounded-xl text-xs font-black ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-emerald-50 text-emerald-700'}`}
              >
                قائمة السور
              </button>
            )}
          </div>

          {showReciterDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl shadow-2xl z-40 max-h-80 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2`}>
              {RECITERS.map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => {
                    setSelectedReciter(reciter);
                    setShowReciterDropdown(false);
                  }}
                  className={`w-full text-right p-4 rounded-xl mb-1 transition-all ${
                    selectedReciter.id === reciter.id
                      ? 'bg-amber-500 text-slate-950'
                      : isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-emerald-50 text-slate-700'
                  }`}
                >
                  <p className="font-bold">{reciter.name}</p>
                  <p className="text-[10px] opacity-70">{reciter.style} - {reciter.country}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {view === 'surahs' ? (
          <div className="space-y-4 animate-fade-in">
            <h2 className={`text-2xl font-black quran-text text-center mb-8 ${isDark ? 'text-amber-400' : 'text-emerald-800'}`}>الفهرس الجامع</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FULL_SURAHS.map((surah) => (
                <button
                  key={surah.id}
                  onClick={() => loadSurahContent(surah)}
                  className={`p-5 rounded-2xl border-b-4 flex items-center justify-between transition-all active:scale-95 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-emerald-100 text-slate-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${isDark ? 'bg-slate-800 text-amber-500' : 'bg-emerald-50 text-emerald-700'}`}>
                      {surah.id}
                    </span>
                    <div className="text-right">
                      <p className="font-black text-lg quran-text">{surah.name}</p>
                      <p className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">{surah.englishName}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black opacity-50">{surah.numberOfAyahs} آية</p>
                    <p className={`text-[9px] font-bold ${surah.revelationType === 'Meccan' ? 'text-blue-500' : 'text-emerald-500'}`}>
                      {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
                <p className={`font-black ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>جاري تحميل الصفحة...</p>
              </div>
            ) : (
              <>
                {/* Page Content */}
                <div className={`relative ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-emerald-100'} rounded-[3rem] p-8 sm:p-12 border-b-8 shadow-2xl`}>
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <p className={`text-[10px] font-black ${isDark ? 'text-amber-500' : 'text-emerald-600'}`}>سورة {selectedSurah.name}</p>
                    <p className={`text-[10px] font-black ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>صفحة {currentPage?.pageNumber || '?'}</p>
                  </div>

                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-[2.5] sm:leading-[3] text-center quran-text ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    {currentPage?.ayahs.map((ayah) => (
                      <React.Fragment key={ayah.numberInQuran}>
                        <span>{ayah.text}</span>
                        <span className={`mx-2 text-amber-500 font-black text-xl opacity-80`}>
                          ﴿{ayah.numberInSurah}﴾
                        </span>
                      </React.Fragment>
                    ))}
                  </div>

                  {audioError && (
                    <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center text-xs font-bold">
                      {audioError}
                    </div>
                  )}

                  {/* Play Button */}
                  <button
                    onClick={handlePlayPage}
                    className={`mt-10 w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl ${
                      isPlaying 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : isDark ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    <span className="text-3xl">{isPlaying ? '⏹️' : '▶️'}</span>
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentPageIndex === 0}
                    className={`flex-1 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      currentPageIndex === 0
                        ? 'opacity-30 grayscale cursor-not-allowed'
                        : isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'
                    }`}
                  >
                    ← الصفحة السابقة
                  </button>
                  <button
                    onClick={() => setCurrentPageIndex(prev => Math.min(pages.length - 1, prev + 1))}
                    disabled={currentPageIndex === pages.length - 1}
                    className={`flex-1 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      currentPageIndex === pages.length - 1
                        ? 'opacity-30 grayscale cursor-not-allowed'
                        : isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'
                    }`}
                  >
                    الصفحة التالية →
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuranEnhanced;
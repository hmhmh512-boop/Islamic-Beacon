import React, { useState, useRef, useEffect } from 'react';
import { FULL_SURAHS, RECITERS } from '../constants';
import { Surah, Reciter } from '../types';
import SearchService from '../utils/searchService';
import QuranPageService from '../utils/quranPageService';
import { useTheme } from '../context/ThemeContext';

/**
 * Enhanced Quran Component with:
 * - Page-based display (like Ottoman Mushaf)
 * - Search functionality for Surahs and Ayahs
 * - 25+ reciters with different styles
 * - Improved dark mode support
 */

const QuranEnhanced: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [view, setView] = useState<'surahs' | 'search' | 'pages'>('surahs');
  const [selectedSurah, setSelectedSurah] = useState<Surah>(FULL_SURAHS[0]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [surahAyahs, setSurahAyahs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string>('');
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load Surah Ayahs
  const loadSurahAyahs = async (surahId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`);
      const data = await response.json();
      if (data.code === 200) {
        setSurahAyahs(data.data.ayahs);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to load Surah:', error);
      setAudioError('فشل تحميل السورة');
    }
    setLoading(false);
  };

  // Handle Search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = await SearchService.searchQuran(query, surahAyahs);
    setSearchResults(results);
    setView('search');
  };

  // Play Surah Audio - Fixed to use correct mp3quran.net API
  const playAudio = async (surahId: number) => {
    setAudioError('');
    
    if (audioRef.current) {
      if (isPlaying && selectedSurah.id === surahId) {
        audioRef.current.pause();
        setIsPlaying(false);
        return;
      }

      try {
        const formattedId = surahId.toString().padStart(3, '0');
        // استخدم روابط متعددة كـ fallback
        const urls = [
          `${selectedReciter.server}/${formattedId}.mp3`,
          `https://www.mp3quran.net/api/v3/surah_ar_${selectedReciter.identifier}/${formattedId}.mp3`,
          `https://server13.mp3quran.net/api/v3/surah_ar_${selectedReciter.identifier}/${formattedId}.mp3`,
        ];

        let lastError = '';
        let audioLoaded = false;

        for (const url of urls) {
          try {
            audioRef.current.src = url;
            audioRef.current.crossOrigin = 'anonymous';
            
            // اختبر إن كان الرابط يعمل
            await new Promise<void>((resolve, reject) => {
              const timeoutId = setTimeout(() => {
                reject(new Error('Connection timeout'));
              }, 5000);

              audioRef.current!.addEventListener('loadeddata', () => {
                clearTimeout(timeoutId);
                resolve();
              }, { once: true });

              audioRef.current!.addEventListener('error', () => {
                clearTimeout(timeoutId);
                reject(new Error('Failed to load'));
              }, { once: true });

              audioRef.current!.load();
            });

            audioLoaded = true;
            break;
          } catch (error) {
            lastError = String(error);
            continue;
          }
        }

        if (!audioLoaded) {
          throw new Error(`جميع الروابط معطلة: ${lastError}`);
        }

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error('Playback error:', error);
            setAudioError('خطأ في التشغيل. جرب قارئاً آخر.');
            setIsPlaying(false);
          });
        }
      } catch (error) {
        console.error(error);
        setAudioError('عذراً، غير متاح الآن. يرجى التأكد من الاتصال بالإنترنت.');
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-4`}>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            القرآن الكريم
          </h1>
          <p className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            اقرأ واستمع لكلام الله مع أفضل القراء
          </p>
        </div>

        {/* Reciter Selector */}
        <div className={`mb-6 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          <div className="relative">
            <button
              onClick={() => setShowReciterDropdown(!showReciterDropdown)}
              className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'} text-right flex justify-between items-center`}
            >
              <span>🎤 {selectedReciter.name}</span>
              <span className={`text-xs ${selectedReciter.style ? 'inline-block' : 'hidden'}`}>
                ({selectedReciter.style}) {selectedReciter.country && `- ${selectedReciter.country}`}
              </span>
            </button>

            {showReciterDropdown && (
              <div className={`absolute top-full left-0 right-0 mt-2 ${isDark ? 'bg-slate-700' : 'bg-white'} border ${isDark ? 'border-slate-600' : 'border-slate-300'} rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto`}>
                {RECITERS.map((reciter) => (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      setSelectedReciter(reciter);
                      setShowReciterDropdown(false);
                    }}
                    className={`w-full text-right p-3 border-b ${isDark ? 'border-slate-600 hover:bg-slate-600' : 'border-slate-200 hover:bg-slate-100'} transition`}
                  >
                    <div className="font-semibold">{reciter.name}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {reciter.style && <span>{reciter.style}</span>}
                      {reciter.country && <span> - {reciter.country}</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className={`mb-6 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          <input
            type="text"
            placeholder="🔍 ابحث عن سورة أو نص قرآني..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-right`}
          />
        </div>

        {/* View Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setView('surahs')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${view === 'surahs'
              ? 'bg-blue-600 text-white'
              : isDark
              ? 'bg-slate-800 hover:bg-slate-700'
              : 'bg-slate-200 hover:bg-slate-300'
              }`}
          >
            📖 السور
          </button>
          <button
            onClick={() => setView('pages')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${view === 'pages'
              ? 'bg-blue-600 text-white'
              : isDark
              ? 'bg-slate-800 hover:bg-slate-700'
              : 'bg-slate-200 hover:bg-slate-300'
              }`}
          >
            📄 صفحات
          </button>
        </div>

        {/* Content Area */}
        {view === 'surahs' && (
          <>
            {/* Surahs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FULL_SURAHS.map((surah) => (
                <div
                  key={surah.id}
                  onClick={() => {
                    setSelectedSurah(surah);
                    loadSurahAyahs(surah.id);
                    setView('pages');
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition ${selectedSurah.id === surah.id
                    ? `bg-blue-600 ${isDark ? 'border-blue-500' : 'border-blue-700'} text-white`
                    : `${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-50 border-slate-300'}`
                    }`}
                >
                  <div className="font-bold text-lg mb-1">{surah.id}. {surah.name}</div>
                  <div className={`text-sm ${selectedSurah.id === surah.id
                    ? 'text-blue-100'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-slate-600'
                    }`}>
                    {surah.englishName} - {surah.numberOfAyahs} آيات
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'pages' && surahAyahs.length > 0 && (
          <>
            {/* Surah Header */}
            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${isDark ? 'border-slate-700' : 'border-slate-300'} mb-6`}>
              <h2 className={`text-3xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                سورة {selectedSurah.name}
              </h2>

              <div className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                <p>{selectedSurah.englishName}</p>
                <p>{selectedSurah.numberOfAyahs} آية</p>
              </div>

              <button
                onClick={() => playAudio(selectedSurah.id)}
                className={`w-full py-3 rounded-lg font-bold transition ${isPlaying && selectedSurah.id === selectedSurah.id
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
              >
                {isPlaying && selectedSurah.id === selectedSurah.id ? '⏸️ إيقاف' : '▶️ استمع'}
              </button>
            </div>

            {/* Ayahs Display with Pagination */}
            <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${isDark ? 'border-slate-700' : 'border-slate-300'} mb-6`}>
              {/* Display ayahs (10 at a time for long surahs) */}
              <div className={`text-lg leading-loose text-center font-quran ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {surahAyahs.slice(0, Math.min(currentPage * 10, surahAyahs.length)).map((ayah, index) => (
                  <div key={index} className="mb-4">
                    <span>{ayah.text}</span>
                    <span className={`mx-2 font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      ﴿{ayah.numberInSurah}﴾
                    </span>
                  </div>
                ))}
              </div>

              {/* Pagination for long Surahs */}
              {surahAyahs.length > 10 && (
                <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-slate-700">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-bold transition ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    ← السابق
                  </button>
                  <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    الصفحة {currentPage} من {Math.ceil(surahAyahs.length / 10)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(surahAyahs.length / 10)))}
                    disabled={currentPage >= Math.ceil(surahAyahs.length / 10)}
                    className={`px-4 py-2 rounded-lg font-bold transition ${
                      currentPage >= Math.ceil(surahAyahs.length / 10)
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    التالي →
                  </button>
                </div>
              )}
            </div>

            {audioError && (
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 p-4 rounded-lg">
                {audioError}
              </div>
            )}
          </>
        )}

        {view === 'search' && (
          <>
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  نتائج البحث ({searchResults.length})
                </h2>

                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (result.type === 'surah') {
                        setSelectedSurah(FULL_SURAHS.find((s) => s.id === result.surahId)!);
                        loadSurahAyahs(result.surahId);
                        setView('pages');
                      }
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-50 border-slate-300'}`}
                  >
                    <div className="font-bold mb-2">{result.surahName}</div>
                    {result.type === 'ayah' && (
                      <div className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                        الآية {result.ayahNumber}: {result.ayahText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchQuery ? 'لا توجد نتائج للبحث' : 'ابدأ البحث للعثور على سورة أو نص'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuranEnhanced;
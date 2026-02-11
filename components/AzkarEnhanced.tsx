import React, { useEffect, useState, useRef } from 'react';
import { AZKAR as BUILTIN_AZKAR } from '../constants';
import { AZKAR_DATABASE, AzkarEntry, searchAzkar, getRandomAzkar } from '../assistant-knowledge-base';
import AzkarService from '../utils/azkarService';
import { useTheme } from '../context/ThemeContext';
import ExpandableText from './ExpandableText';

/**
 * Enhanced Azkar Component with:
 * - Audio playback for each azkar
 * - Multiple categories
 * - Progress tracking
 * - Search and filtering
 * - Dark mode support
 */

interface AzkarProps {
  forcedCategory?: string;
}

const AzkarEnhanced: React.FC<AzkarProps> = ({ forcedCategory }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>(forcedCategory || 'صباح');
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [azkarList, setAzkarList] = useState<any[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [randomAzkar, setRandomAzkar] = useState<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

    // Load random Azkar
    const random = AzkarService.getRandomAzkar();
    setRandomAzkar(random);
  }, []);

  const handlePlay = async (azkar: any) => {
    // Generate TTS audio for the azkar using Web Speech API
    if (playingId === azkar.id) {
      // Stop current playback
      window.speechSynthesis.cancel();
      setPlayingId(null);
    } else {
      // Play using Text-to-Speech with Arabic support
      try {
        const synth = window.speechSynthesis;
        if (synth) {
          synth.cancel(); // إلغاء أي نص سابق
          
          const utterance = new SpeechSynthesisUtterance(azkar.text);
          utterance.lang = 'ar-SA'; // اللغة العربية
          utterance.rate = 0.85; // سرعة التحدث
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
          
          utterance.onstart = () => {
            setPlayingId(azkar.id);
          };
          
          utterance.onend = () => {
            setPlayingId(null);
          };
          
          utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setPlayingId(null);
            // جرب طريقة بديلة
            try {
              const backupUtterance = new SpeechSynthesisUtterance('تم قراءة الذكر');
              synth.speak(backupUtterance);
            } catch (e) {
              console.error('Backup TTS error:', e);
            }
          };
          
          synth.speak(utterance);
        } else {
          console.warn('Web Speech API not supported');
          setPlayingId(null);
        }
      } catch (error) {
        console.error('خطأ في تشغيل الصوت:', error);
        setPlayingId(null);
      }
    }
  };

  const incrementProgress = (id: string, count: number) => {
    const newProgress = {
      ...progress,
      [id]: (progress[id] || 0) + 1,
    };
    setProgress(newProgress);
    localStorage.setItem('azkar_progress_enhanced', JSON.stringify(newProgress));
  };

  const addNote = (id: string, noteText: string) => {
    const newNotes = {
      ...notes,
      [id]: noteText,
    };
    setNotes(newNotes);
    localStorage.setItem('azkar_notes_enhanced', JSON.stringify(newNotes));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-4`}>
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            الأذكار الإسلامية
          </h1>
          <p className={`text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            أذكار يومية مختارة مع تلاوة صوتية
          </p>
        </div>

        {/* Random Azkar */}
        {randomAzkar && (
          <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-blue-800' : 'bg-gradient-to-r from-blue-100 to-blue-50'} rounded-lg p-6 border ${isDark ? 'border-blue-700' : 'border-blue-300'} mb-8`}>
            <div className={`${isDark ? 'text-blue-100' : 'text-blue-900'} text-sm font-semibold mb-2`}>
              💡 ذكر عشوائي
            </div>
            <div className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {randomAzkar.text}
            </div>
            <div className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              <div className="mb-2"><strong>التعريب:</strong> {randomAzkar.transliteration}</div>
              <div className="mb-2"><strong>المعنى:</strong> {randomAzkar.meaning}</div>
              <div><strong>الفضل:</strong> {randomAzkar.reward}</div>
            </div>
            <button
              onClick={() => {
                const newRandom = AzkarService.getRandomAzkar();
                setRandomAzkar(newRandom);
              }}
              className={`mt-4 py-2 px-4 rounded-lg font-semibold transition ${isDark ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              🔄 ذكر آخر
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className={`mb-6 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          <input
            type="text"
            placeholder="🔍 ابحث في الأذكار..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-100 border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-right`}
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {azkarCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveCategory(cat.key);
                setSearch('');
              }}
              className={`p-3 rounded-lg font-semibold transition ${activeCategory === cat.key
                ? 'bg-blue-600 text-white'
                : isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
            >
              <div className="text-xl mb-1">{cat.emoji}</div>
              <div className="text-xs">{cat.label.split(' ')[1]}</div>
            </button>
          ))}
        </div>

        {/* Azkar List */}
        <div className="space-y-4">
          {azkarList.length > 0 ? (
            azkarList.map((azkar) => (
              <div
                key={azkar.id}
                className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-6 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}
              >
                {/* Azkar Text */}
                <div className={`text-lg font-semibold mb-3 leading-loose text-center ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {azkar.text}
                </div>

                {/* Count */}
                <div className={`text-sm text-center mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  العدد: {azkar.count}
                </div>

                {/* Audio Button */}
                {azkar.audioUrl && (
                  <button
                    onClick={() => handlePlay(azkar)}
                    className={`w-full py-2 rounded-lg font-semibold transition mb-3 ${playingId === azkar.id
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                  >
                    {playingId === azkar.id ? '⏸️ إيقاف' : '▶️ استمع'}
                  </button>
                )}

                {/* Details */}
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4 space-y-1`}>
                  {azkar.transliteration && (
                    <div><strong>التعريب:</strong> {azkar.transliteration}</div>
                  )}
                  {azkar.meaning && (
                    <div><strong>المعنى:</strong> {azkar.meaning}</div>
                  )}
                  {azkar.reward && (
                    <div><strong>الفضل:</strong> {azkar.reward}</div>
                  )}
                  {azkar.timing && (
                    <div><strong>الوقت:</strong> {azkar.timing}</div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    تم: {progress[azkar.id] || 0} من {azkar.count}
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div
                      className="h-full rounded-full bg-green-600 transition-all"
                      style={{
                        width: `${Math.min(100, ((progress[azkar.id] || 0) / azkar.count) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => incrementProgress(azkar.id, azkar.count)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    ✓ تم
                  </button>
                  <button
                    onClick={() => {
                      const note = prompt('أضف ملاحظة:', notes[azkar.id] || '');
                      if (note !== null) {
                        addNote(azkar.id, note);
                      }
                    }}
                    className={`flex-1 py-2 rounded-lg font-semibold transition ${isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                  >
                    📝 ملاحظة
                  </button>
                </div>

                {/* Notes Display */}
                {notes[azkar.id] && (
                  <div className={`mt-3 p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {notes[azkar.id]}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              لا توجد أذكار في هذه الفئة
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AzkarEnhanced;
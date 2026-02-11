import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import nativeAdhanService from '../services/nativeAdhanService';

interface Location {
  latitude: number;
  longitude: number;
  city: string;
}

const AdhanMode: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [adhanEnabled, setAdhanEnabled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('مكة');
  const [selectedMuadhin, setSelectedMuadhin] = useState('default');
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showInfo, setShowInfo] = useState(true);

  // جلب الموقع
  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('adhan_settings');
    if (saved) {
      const { enabled, location, muadhin } = JSON.parse(saved);
      setAdhanEnabled(enabled);
      setSelectedLocation(location);
      setSelectedMuadhin(muadhin);
    }
  }, []);

  const getApproximateCity = (lat: number, lng: number): string => {
    if (lat > 20 && lat < 22 && lng > 38 && lng < 41) return 'مكة';
    if (lat > 23 && lat < 25 && lng > 38 && lng < 40) return 'المدينة';
    if (lat > 29 && lat < 31 && lng > 47 && lng < 49) return 'الكويت';
    if (lat > 30 && lat < 34 && lng > 35 && lng < 37) return 'الأردن';
    return 'موقع غير محدد';
  };

  // Local Adhan audio paths (instead of streaming)
  const adhanAssets = {
    default: 'adhan/adhan_default.mp3',
    makkah: 'adhan/adhan_makkah.mp3',
    madinah: 'adhan/adhan_madinah.mp3'
  };

  const locations = ['مكة', 'المدينة', 'القاهرة', 'دبي', 'لندن'];
  const muadhins = ['default', 'makkah', 'madinah'];

  // Play test Adhan from local assets
  const playTestAdhan = async () => {
    try {
      setIsTestPlaying(true);
      const assetPath = adhanAssets[selectedMuadhin as keyof typeof adhanAssets];
      
      // Try loading from local assets first
      const localPath = `file:///android_asset/audio/${assetPath}`;
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = localPath;
      audioRef.current.volume = 0.8;
      
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.catch((err) => {
          console.error('Could not play local Adhan:', err);
          // Fallback to text-to-speech
          speakAdhanText();
        });
      }

      audioRef.current.onended = () => setIsTestPlaying(false);
    } catch (error) {
      console.error('Error playing test adhan:', error);
      speakAdhanText();
      setIsTestPlaying(false);
    }
  };

  // Enable Adhan scheduling via native Android service
  const handleAdhanEnable = async (enabled: boolean) => {
    setAdhanEnabled(enabled);
    
    if (enabled) {
      // Save settings to localStorage
      const settings = {
        enabled: true,
        location: selectedLocation,
        muadhin: selectedMuadhin,
        timestamp: Date.now()
      };
      localStorage.setItem('adhan_settings', JSON.stringify(settings));

      // Schedule with native Android service
      try {
        // Schedule all 5 prayers
        const prayerNames = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
        for (const prayer of prayerNames) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          await nativeAdhanService.scheduleAdhanAlarm(
            prayer,
            tomorrow.getTime(),
            `audio/adhan/adhan_${selectedMuadhin}.mp3`,
            true
          );
        }
        console.log('Adhan alarm scheduled successfully');
      } catch (error) {
        console.error('Failed to schedule Adhan:', error);
        setAdhanEnabled(false);
      }
    } else {
      // Cancel native Android alarm
      try {
        const prayerNames = ['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
        for (const prayer of prayerNames) {
          await nativeAdhanService.cancelAdhanAlarm(prayer);
        }
        localStorage.setItem('adhan_settings', JSON.stringify({ enabled: false }));
        console.log('Adhan alarm cancelled');
      } catch (error) {
        console.error('Failed to cancel Adhan:', error);
      }
    }
  };

  const speakAdhanText = () => {
    try {
      const synth = window.speechSynthesis;
      if (synth) {
        synth.cancel();
        const adhanText = `الله أكبر الله أكبر، أشهد أن لا إله إلا الله، أشهد أن محمداً رسول الله، حي على الصلاة، حي على الفلاح، الله أكبر الله أكبر، لا إله إلا الله`;
        const utterance = new SpeechSynthesisUtterance(adhanText);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.9;
        synth.speak(utterance);
      }
    } catch (e) {
      console.warn('Could not use TTS for Adhan:', e);
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">📢</span>
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              إعدادات الأذان
            </h1>
          </div>
          <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            فعّل الأذان واختر الإعدادات المفضلة لديك
          </p>
        </div>

        {/* Enable/Disable Adhan Toggle */}
        <div className={`mb-8 p-6 rounded-lg border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {adhanEnabled ? 'الأذان مفعّل' : 'الأذان معطّل'}
              </h2>
              <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {adhanEnabled ? 'سيتم إعلامك بأوقات الصلاة' : 'لن تتلقى إشعارات الصلاة'}
              </p>
            </div>
            <button
              onClick={() => handleAdhanEnable(!adhanEnabled)}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                adhanEnabled
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-400 text-white hover:bg-slate-500'
              }`}
            >
              {adhanEnabled ? 'معطّل' : 'فعّل'}
            </button>
          </div>
        </div>

        {/* Location Selection */}
        {adhanEnabled && (
          <div className={`mb-8 p-6 rounded-lg border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <label className={`block text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              📍 اختر موقعك
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className={`w-full p-3 rounded-lg border-2 transition-all ${
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-white border-slate-300 text-slate-900'
              } focus:border-emerald-500 focus:outline-none`}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Muadhin Selection */}
        {adhanEnabled && (
          <div className={`mb-8 p-6 rounded-lg border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <label className={`block text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              🎵 اختر صوت الأذان
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {muadhins.map((muadhin) => (
                <button
                  key={muadhin}
                  onClick={() => setSelectedMuadhin(muadhin)}
                  className={`p-4 rounded-lg border-2 transition-all font-bold ${
                    selectedMuadhin === muadhin
                      ? `border-emerald-500 ${isDark ? 'bg-emerald-900 text-white' : 'bg-emerald-100 text-emerald-900'}`
                      : `border-slate-300 ${isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'} hover:border-emerald-400`
                  }`}
                >
                  {muadhin === 'default' && 'كلاسيكي'}
                  {muadhin === 'makkah' && 'مكة'}
                  {muadhin === 'madinah' && 'المدينة'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Test Button */}
        {adhanEnabled && (
          <div className={`mb-8 p-6 rounded-lg border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <button
              onClick={playTestAdhan}
              disabled={isTestPlaying}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isTestPlaying
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <span>{isTestPlaying ? '⏸️' : '▶️'}</span>
              {isTestPlaying ? 'قيد التشغيل...' : 'اختبر الأذان'}
            </button>
            <p className={`text-sm mt-3 text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              انقر لتشغيل عينة من صوت الأذان المختار
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className={`p-6 rounded-lg ${isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border-2`}>
          <h3 className={`font-bold mb-3 text-lg ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
            ℹ️ معلومات مهمة
          </h3>
          <ul className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <li>✅ الأذان سيعمل حتى عندما تغلق التطبيق</li>
            <li>✅ تأكد من تفعيل إشعارات التطبيق في إعدادات جهازك</li>
            <li>✅ الأذان يتم تشغيله محلياً دون الحاجة للإنترنت</li>
            <li>✅ يمكنك تغيير الإعدادات في أي وقت</li>
          </ul>
        </div>
      </div>

      {/* Hidden audio element for testing */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default AdhanMode;

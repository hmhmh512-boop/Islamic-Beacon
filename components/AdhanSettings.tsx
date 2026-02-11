import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import nativeAdhanService from '../services/nativeAdhanService';
import offlinePrayerTimesService from '../services/offlinePrayerTimesService';
import type { LocationData, PrayerTimeData } from '../services/offlinePrayerTimesService';

export default function AdhanSettings() {
  const { isDark } = useTheme();
  const [adhanEnabled, setAdhanEnabled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [selectedAudio, setSelectedAudio] = useState('adhan_default.mp3');
  const [availableAudios, setAvailableAudios] = useState<string[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [todayPrayers, setTodayPrayers] = useState<PrayerTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testPlaying, setTestPlaying] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    initializeSettings();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const prayers = offlinePrayerTimesService.getTodayPrayerTimes(selectedLocation);
      setTodayPrayers(prayers);
    }
  }, [selectedLocation]);

  async function initializeSettings() {
    try {
      // Check if native app
      const native = nativeAdhanService.isNativeApp();
      setIsNative(native);

      // Get saved settings
      const savedEnabled = localStorage.getItem('adhan_enabled');
      if (savedEnabled) {
        setAdhanEnabled(JSON.parse(savedEnabled));
      }

      const savedLocation = localStorage.getItem('adhan_location');
      if (savedLocation) {
        const location = JSON.parse(savedLocation);
        setSelectedLocation(location);
      }

      const savedAudio = localStorage.getItem('adhan_audio');
      if (savedAudio) {
        setSelectedAudio(savedAudio);
      }

      // Get available data
      const locs = offlinePrayerTimesService.getPredefinedLocations();
      setLocations(locs);

      if (!selectedLocation && locs.length > 0) {
        setSelectedLocation(locs[0]);
      }

      const audios = await nativeAdhanService.getAvailableAdhanAudio();
      setAvailableAudios(audios);

      // Request permissions if native
      if (native) {
        await nativeAdhanService.requestPermissions();
      }

      setLoading(false);
    } catch (error) {
      console.error('[AdhanSettings] Init error:', error);
      setLoading(false);
    }
  }

  async function handleToggleAdhan(enabled: boolean) {
    try {
      setAdhanEnabled(enabled);
      localStorage.setItem('adhan_enabled', JSON.stringify(enabled));

      if (enabled && selectedLocation && selectedAudio) {
        // Schedule alarms for today's prayers
        const prayers = offlinePrayerTimesService.getTodayPrayerTimes(selectedLocation);
        if (prayers) {
          const prayerTimes = [
            { name: 'Fajr', time: prayers.fajr, audio: selectedAudio },
            { name: 'Dhuhr', time: prayers.dhuhr, audio: selectedAudio },
            { name: 'Asr', time: prayers.asr, audio: selectedAudio },
            { name: 'Maghrib', time: prayers.maghrib, audio: selectedAudio },
            { name: 'Isha', time: prayers.isha, audio: selectedAudio },
          ];

          for (const prayer of prayerTimes) {
            await nativeAdhanService.scheduleAdhanAlarm(
              prayer.name,
              prayer.time.getTime(),
              prayer.audio,
              true
            );
          }

          console.log('[AdhanSettings] Adhan enabled and scheduled');
        }
      } else if (!enabled) {
        await nativeAdhanService.cancelAllAlarms();
        console.log('[AdhanSettings] Adhan disabled and alarms cancelled');
      }
    } catch (error) {
      console.error('[AdhanSettings] Error toggling Adhan:', error);
    }
  }

  async function handleLocationChange(location: LocationData) {
    try {
      setSelectedLocation(location);
      localStorage.setItem('adhan_location', JSON.stringify(location));

      // Reschedule alarms if enabled
      if (adhanEnabled) {
        const prayers = offlinePrayerTimesService.getTodayPrayerTimes(location);
        if (prayers) {
          const prayerTimes = [
            { name: 'Fajr', time: prayers.fajr },
            { name: 'Dhuhr', time: prayers.dhuhr },
            { name: 'Asr', time: prayers.asr },
            { name: 'Maghrib', time: prayers.maghrib },
            { name: 'Isha', time: prayers.isha },
          ];

          // Cancel old alarms
          await nativeAdhanService.cancelAllAlarms();

          // Schedule new alarms
          for (const prayer of prayerTimes) {
            await nativeAdhanService.scheduleAdhanAlarm(
              prayer.name,
              prayer.time.getTime(),
              selectedAudio,
              true
            );
          }
        }
      }
    } catch (error) {
      console.error('[AdhanSettings] Error changing location:', error);
    }
  }

  async function handleAudioChange(audio: string) {
    try {
      setSelectedAudio(audio);
      localStorage.setItem('adhan_audio', audio);

      // Reschedule with new audio if enabled
      if (adhanEnabled && selectedLocation) {
        const prayers = offlinePrayerTimesService.getTodayPrayerTimes(selectedLocation);
        if (prayers) {
          const prayerTimes = [
            { name: 'Fajr', time: prayers.fajr },
            { name: 'Dhuhr', time: prayers.dhuhr },
            { name: 'Asr', time: prayers.asr },
            { name: 'Maghrib', time: prayers.maghrib },
            { name: 'Isha', time: prayers.isha },
          ];

          await nativeAdhanService.cancelAllAlarms();

          for (const prayer of prayerTimes) {
            await nativeAdhanService.scheduleAdhanAlarm(
              prayer.name,
              prayer.time.getTime(),
              audio,
              true
            );
          }
        }
      }
    } catch (error) {
      console.error('[AdhanSettings] Error changing audio:', error);
    }
  }

  async function handleTestAdhan() {
    try {
      setTestPlaying(true);
      await nativeAdhanService.playTestAdhan(selectedAudio);
      setTimeout(() => setTestPlaying(false), 10000);
    } catch (error) {
      console.error('[AdhanSettings] Error playing test Adhan:', error);
      setTestPlaying(false);
    }
  }

  if (loading) {
    return (
      <div className={`p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            إعدادات الأذان
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            قم بتفعيل الأذان والتحكم في إعداداتك
          </p>
        </div>

        {/* Native App Warning */}
        {!isNative && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
            <p className="text-blue-900 text-sm">
              ⚠️ تطبيق الويب: ستعمل جميع الميزات ولكن الأذان لن يعمل عند إغلاق التطبيق. للأذان الكامل، استخدم تطبيق Android الأصلي.
            </p>
          </div>
        )}

        {/* Enable Adhan Toggle */}
        <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                تفعيل الأذان
              </h2>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {adhanEnabled ? '✓ الأذان مفعّل' : '✗ الأذان معطّل'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adhanEnabled}
                onChange={(e) => handleToggleAdhan(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 rounded-full peer ${
                  adhanEnabled
                    ? 'bg-blue-600'
                    : isDark
                    ? 'bg-gray-700'
                    : 'bg-gray-300'
                } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
              />
            </label>
          </div>
        </div>

        {/* Location Selection */}
        <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            الموقع الجغرافي
          </h2>
          <select
            value={JSON.stringify(selectedLocation)}
            onChange={(e) => {
              const location = JSON.parse(e.target.value);
              handleLocationChange(location);
            }}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {locations.map((loc, idx) => (
              <option key={idx} value={JSON.stringify(loc)}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Today's Prayer Times */}
        {todayPrayers && (
          <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              أوقات الصلاة اليوم
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'الفجر', time: todayPrayers.fajr },
                { name: 'الظهر', time: todayPrayers.dhuhr },
                { name: 'العصر', time: todayPrayers.asr },
                { name: 'المغرب', time: todayPrayers.maghrib },
                { name: 'العشاء', time: todayPrayers.isha },
              ].map((prayer) => (
                <div
                  key={prayer.name}
                  className={`p-3 rounded-lg text-center ${
                    isDark
                      ? 'bg-gray-700'
                      : 'bg-gradient-to-br from-blue-50 to-blue-100'
                  }`}
                >
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {prayer.name}
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {offlinePrayerTimesService.formatTimeArabic(prayer.time)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Selection */}
        <div className={`rounded-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            نوع الأذان
          </h2>
          <div className="space-y-2">
            {availableAudios.map((audio) => (
              <label key={audio} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="adhan_audio"
                  value={audio}
                  checked={selectedAudio === audio}
                  onChange={(e) => handleAudioChange(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span
                  className={`ml-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {audio.replace('adhan_', '').replace('.mp3', '').toUpperCase()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Test Adhan Button */}
        <button
          onClick={handleTestAdhan}
          disabled={testPlaying}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            testPlaying
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {testPlaying ? '🔊 يتم التشغيل...' : '🔊 اختبر الأذان'}
        </button>

        {/* Info */}
        <div
          className={`mt-6 p-4 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-blue-50'
          }`}
        >
          <p
            className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            ℹ️ <strong>ملاحظة:</strong> جميع أوقات الصلاة محسوبة بدون الحاجة للإنترنت. يجب تفعيل الإشعارات للحصول على تنبيهات الأذان.
          </p>
        </div>
      </div>
    </div>
  );
}

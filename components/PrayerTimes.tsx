import React, { useState, useEffect, useRef } from 'react';
import { PRAYER_SUPPLICATIONS, PrayerSupplication } from '../interactive-tools-data';
import { AdhanNotificationManager, calculateTimeUntilPrayer, savePrayerTimes, loadPrayerTimes, requestNotificationPermission } from '../utils/adhanService';
import { useTheme } from '../context/ThemeContext';

interface PrayerTimeData {
  name: string;
  arabic: string;
  time: string;
  icon: string;
  color: string;
  bgGradient: string;
}

const PrayerTimes: React.FC = () => {
  // FIX: Use theme context for dark mode
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [times, setTimes] = useState<Record<string, string>>({});
  const [city, setCity] = useState('جاري تحديد موقعك...');
  const [status, setStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerSupplication>(PRAYER_SUPPLICATIONS[0]);
  const [showSupplication, setShowSupplication] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('adhan_notifications_enabled');
    return saved === null ? true : saved === 'true';
  });
  const [adhanEnabled, setAdhanEnabled] = useState(() => {
    const saved = localStorage.getItem('adhan_enabled_v2');
    return saved === null ? false : saved === 'true';
  });

  // Save settings
  useEffect(() => {
    localStorage.setItem('adhan_notifications_enabled', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('adhan_enabled_v2', adhanEnabled.toString());
  }, [adhanEnabled]);
  // FIX: Add adhan manager and notification tracking
  const adhanManager = useRef<AdhanNotificationManager>(new AdhanNotificationManager());
  const notificationTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const synth = useRef<SpeechSynthesis | null>(null);

  const prayerConfigs: PrayerTimeData[] = [
    { name: 'الفجر', arabic: 'Fajr', time: '', icon: '🌅', color: 'emerald', bgGradient: 'from-emerald-950 to-emerald-900' },
    { name: 'الظهر', arabic: 'Dhuhr', time: '', icon: '🌞', color: 'amber', bgGradient: 'from-amber-950 to-amber-900' },
    { name: 'العصر', arabic: 'Asr', time: '', icon: '🌤️', color: 'orange', bgGradient: 'from-orange-950 to-orange-900' },
    { name: 'المغرب', arabic: 'Maghrib', time: '', icon: '🌇', color: 'red', bgGradient: 'from-red-950 to-red-900' },
    { name: 'العشاء', arabic: 'Isha', time: '', icon: '🌙', color: 'slate', bgGradient: 'from-slate-950 to-slate-900' },
  ];

  // Load Prayer Times
  useEffect(() => {
    synth.current = window.speechSynthesis;
    // FIX: Request notification permission
    if (notificationsEnabled) {
      requestNotificationPermission();
    }
    loadPrayerTimesFromAPI();
  }, []);

  // FIX: Enhanced prayer times loading with localStorage persistence
  const loadPrayerTimesFromAPI = async () => {
    try {
      // Try to load from localStorage first
      const savedTimes = loadPrayerTimes();
      if (savedTimes && savedTimes.times) {
        setTimes(savedTimes.times);
        setCity(savedTimes.city || 'موقعك المحفوظ');
        setStatus('online');
        updateNextPrayer();
        return;
      }

      if (!navigator.onLine) {
        setStatus('offline');
        setCity('وضع عدم الاتصال');
        setDefaultTimes();
        return;
      }

      if (!navigator.geolocation) {
        setCity('القاهرة (افتراضي)');
        await fetchTimingsByCity('Cairo', 'Egypt');
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
          const data = await res.json();
          setTimes(data.data.timings);
          setCity('موقعك الحالي');
          setStatus('online');
          // FIX: Save to localStorage for offline use
          savePrayerTimes(data.data.timings, 'موقعك الحالي');
          updateNextPrayer();
        } catch (e) {
          await fetchTimingsByCity('Cairo', 'Egypt');
        }
      }, async () => {
        await fetchTimingsByCity('Cairo', 'Egypt');
      });
    } catch (e) {
      setDefaultTimes();
      setStatus('offline');
    }
  };

  // Update next prayer timer
  useEffect(() => {
    const interval = setInterval(() => {
      updateNextPrayer();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [times]);

  const loadPrayerTimes = async () => {
    try {
      if (!navigator.onLine) {
        setStatus('offline');
        setCity('وضع عدم الاتصال');
        setDefaultTimes();
        return;
      }

      if (!navigator.geolocation) {
        setCity('القاهرة (افتراضي)');
        await fetchTimingsByCity('Cairo', 'Egypt');
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
          const data = await res.json();
          setTimes(data.data.timings);
          setCity('موقعك الحالي');
          setStatus('online');
          updateNextPrayer();
        } catch (e) {
          await fetchTimingsByCity('Cairo', 'Egypt');
        }
      }, async () => {
        await fetchTimingsByCity('Cairo', 'Egypt');
      });
    } catch (e) {
      setDefaultTimes();
      setStatus('offline');
    }
  };

  const fetchTimingsByCity = async (cityName: string, country: string) => {
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${cityName}&country=${country}&method=4`);
      const data = await res.json();
      setTimes(data.data.timings);
      setCity(cityName);
      setStatus('online');
      // FIX: Save to localStorage for offline use
      savePrayerTimes(data.data.timings, cityName);
      updateNextPrayer();
    } catch (e) {
      setDefaultTimes();
      setStatus('offline');
    }
  };

  const setDefaultTimes = () => {
    setTimes({
      Fajr: '05:00',
      Dhuhr: '12:00',
      Asr: '15:30',
      Maghrib: '18:00',
      Isha: '19:30'
    });
  };

  const updateNextPrayer = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let foundNext = false;

    for (const prayer of prayerOrder) {
      const timeStr = times[prayer];
      if (!timeStr) continue;
      
      const [hours, minutes] = timeStr.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;

      if (prayerTime > currentTime) {
        setNextPrayer(prayer);
        const diff = prayerTime - currentTime;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setTimeUntilNext(`${h} س ${m} د`);
        
        // FIX: Setup adhan notification for this prayer
        setupAdhanNotification(prayer, timeStr);
        foundNext = true;
        break;
      }
    }

    if (!foundNext) {
      setNextPrayer('Fajr');
      const fajrTime = (times.Fajr?.split(':').map(Number) || [5, 0])[0] * 60 + (times.Fajr?.split(':').map(Number) || [5, 0])[1];
      const diff = (24 * 60 - currentTime) + fajrTime;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      setTimeUntilNext(`${h} س ${m} د`);
      
      // FIX: Setup adhan notification for next Fajr
      setupAdhanNotification('Fajr', times.Fajr || '05:00');
    }
  };

  // FIX: Setup automatic adhan notification for prayer time
  const setupAdhanNotification = (prayer: string, prayerTimeStr: string) => {
    // Clear existing timeout for this prayer
    if (notificationTimeouts.current.has(prayer)) {
      clearTimeout(notificationTimeouts.current.get(prayer));
    }

    // Calculate time until prayer (with 0-second accuracy)
    const now = new Date();
    const [hours, minutes] = prayerTimeStr.split(':').map(Number);
    const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    
    if (prayerDate < now) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }

    const timeUntil = prayerDate.getTime() - now.getTime();

    if (timeUntil > 0 && notificationsEnabled) {
      const timeout = setTimeout(() => {
        // Trigger adhan
        if (voiceEnabled && adhanManager.current && adhanEnabled) {
          adhanManager.current.playAdhan(5000);
        }
        // Show notification
        const prayerArabic = getPrayerConfig(prayer)?.name || prayer;
        adhanManager.current?.showNotification(prayerArabic, prayerTimeStr);
      }, timeUntil);

      notificationTimeouts.current.set(prayer, timeout);
    }
  };

  const speakSupplication = (text: string) => {
    if (!voiceEnabled || !synth.current) return;

    synth.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8;
    utterance.pitch = 1;

    synth.current.speak(utterance);
  };

  const getPrayerConfig = (arabicName: string) => {
    return prayerConfigs.find(p => p.arabic === arabicName) || prayerConfigs[0];
  };

  const selectedSupplication = PRAYER_SUPPLICATIONS.find(s => s.prayer === selectedPrayer.prayer) || PRAYER_SUPPLICATIONS[0];

  return (
    <div className={`animate-fade-in space-y-8 pb-32 w-full min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Main Prayer Times Card */}
      <div className={`mx-2 rounded-[3rem] p-10 shadow-2xl border-b-8 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-red-950 to-red-900 border-red-600' : 'bg-gradient-to-br from-red-600 to-red-500 border-red-700'} text-white`}>
        <div className="absolute top-4 right-4 text-6xl opacity-10">🕌</div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black quran-text text-amber-400 glow-gold mb-2">مواقيت الصلاة</h2>
          <p className="text-slate-100 text-[10px] font-black uppercase">{city}</p>
          <div className={`inline-block mt-2 px-4 py-1 rounded-full text-[9px] font-black ${
            status === 'online'
              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
              : 'bg-red-500/30 text-red-300 border border-red-400/30'
          }`}>
            {status === 'online' ? '✓ متصل' : '⚠️ بدون اتصال'}
          </div>
        </div>

        {/* Next Prayer Alert */}
        {nextPrayer && (
          <div className="bg-black/20 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-sm">
            <p className="text-[10px] text-red-200 font-black uppercase mb-1">⏰ الصلاة القادمة</p>
            <p className="text-amber-300 font-black text-xl">{getPrayerConfig(nextPrayer).name}</p>
            <p className="text-slate-200 text-[10px] mt-1">{times[nextPrayer]} - متبقي: {timeUntilNext}</p>
          </div>
        )}

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-1 gap-3">
          {prayerConfigs.map((prayer, idx) => {
            const prayerTime = times[prayer.arabic] || '--:--';
            const isNext = prayer.arabic === nextPrayer;
            return (
              <button
                key={idx}
                onClick={() => {
                  const supp = PRAYER_SUPPLICATIONS.find(s => s.prayer === prayer.arabic);
                  if (supp) {
                    setSelectedPrayer(supp);
                    setShowSupplication(true);
                  }
                }}
                className={`p-4 rounded-2xl border-b-4 transition-all active:scale-95 flex items-center justify-between ${
                  isNext
                    ? 'bg-amber-600 border-amber-800 shadow-lg scale-[1.02]'
                    : 'bg-black/20 border-white/5 hover:bg-black/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{prayer.icon}</span>
                  <div className="text-right">
                    <p className={`font-black ${isNext ? 'text-white' : 'text-amber-400'}`}>{prayer.name}</p>
                    {isNext && <p className="text-[8px] text-amber-100">يحين وقتها قريباً</p>}
                  </div>
                </div>
                <p className="text-2xl font-black text-white">{prayerTime}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Supplication Card */}
      {showSupplication && (
        <div className={`mx-2 rounded-[3rem] p-8 shadow-2xl border-b-8 space-y-6 ${isDark ? 'bg-emerald-950 border-emerald-600' : 'bg-emerald-600 border-emerald-800'} text-white`}>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black quran-text text-amber-400">دعاء {selectedSupplication.nameArabic}</h3>
            <button
              onClick={() => setShowSupplication(false)}
              className="text-emerald-200 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="bg-black/20 border border-white/10 rounded-2xl p-6 space-y-4">
            <p className="text-amber-100 font-bold text-lg quran-text leading-relaxed text-right">{selectedSupplication.dua}</p>
            
            {selectedSupplication.reward && (
              <div className="bg-emerald-800/30 rounded-lg p-3 border border-emerald-500/30">
                <p className="text-[10px] text-emerald-300 font-black uppercase mb-1">الثواب والفضل:</p>
                <p className="text-amber-200 text-xs font-bold leading-relaxed">{selectedSupplication.reward}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => speakSupplication(selectedSupplication.dua)}
            className="w-full p-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            🔊 استمع للدعاء
          </button>
        </div>
      )}

      {/* Supplication Tabs */}
      <div className="mx-2 space-y-3">
        <h3 className={`text-xl font-black px-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>📿 أدعية الصلوات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-2">
          {PRAYER_SUPPLICATIONS.map((supp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPrayer(supp);
                setShowSupplication(true);
              }}
              className={`p-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-between border ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
              } shadow-md`}
            >
              <span>{supp.nameArabic}</span>
              <span className="text-xl">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mx-2 space-y-3">
        <h3 className={`text-xl font-black px-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>⚙️ الإعدادات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-4 rounded-2xl font-black text-sm flex items-center justify-between transition-all active:scale-95 ${
              voiceEnabled
                ? 'bg-emerald-600 text-white'
                : (isDark ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-200 text-slate-500 border-slate-300') + ' border'
            }`}
          >
            <span>🔊 تفعيل الصوت</span>
            <span>{voiceEnabled ? '✓' : '✗'}</span>
          </button>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`p-4 rounded-2xl font-black text-sm flex items-center justify-between transition-all active:scale-95 ${
              notificationsEnabled
                ? 'bg-emerald-600 text-white'
                : (isDark ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-200 text-slate-500 border-slate-300') + ' border'
            }`}
          >
            <span>🔔 الإشعارات</span>
            <span>{notificationsEnabled ? '✓' : '✗'}</span>
          </button>
          <button
            onClick={() => setAdhanEnabled(!adhanEnabled)}
            className={`p-4 rounded-2xl font-black text-sm flex items-center justify-between transition-all active:scale-95 ${
              adhanEnabled
                ? 'bg-emerald-600 text-white'
                : (isDark ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-slate-200 text-slate-500 border-slate-300') + ' border'
            }`}
          >
            <span>🔊 تشغيل الأذان؟</span>
            <span className="text-lg">{adhanEnabled ? '✓ نعم' : '✗ لا'}</span>
          </button>
          <button
            onClick={() => loadPrayerTimesFromAPI()}
            className="p-4 rounded-2xl font-black text-sm bg-blue-600 text-white flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            🔄 تحديث المواقيت
          </button>
        </div>
      </div>

      {/* Prayer Info */}
      <div className={`mx-2 rounded-[2rem] p-6 space-y-4 shadow-xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className={`${isDark ? 'text-amber-400' : 'text-amber-600'} font-black`}>📖 فضل الصلاة</h3>
        <div className={`space-y-3 text-[11px] leading-relaxed font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <p>
            <span className="text-amber-500 font-black">🕌 عماد الدين:</span> الصلاة هي الركن الثاني من أركان الإسلام وصلة العبد بخالقه.
          </p>
          <p>
            <span className="text-amber-500 font-black">🌅 راحة النفس:</span> قال النبي ﷺ: "وجعلت قرة عيني في الصلاة".
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;

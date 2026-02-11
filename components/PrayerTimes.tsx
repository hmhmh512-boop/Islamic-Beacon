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
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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
        if (voiceEnabled && adhanManager.current) {
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
    <div className={`animate-fade-in space-y-8 pb-32 w-full min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Main Prayer Times Card */}
      <div className={`mx-2 rounded-[3rem] p-10 shadow-2xl border-b-8 relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-red-950 to-red-900 border-red-600' : 'bg-gradient-to-br from-red-600 to-red-700 border-red-800'}`}>
        <div className="absolute top-4 right-4 text-6xl opacity-10">🕌</div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black quran-text text-amber-400 glow-gold mb-2">مواقيت الصلاة</h2>
          <p className="text-slate-300 text-[10px] font-black uppercase">{city}</p>
          <div className={`inline-block mt-2 px-4 py-1 rounded-full text-[9px] font-black ${
            status === 'online'
              ? 'bg-emerald-600/30 text-emerald-300'
              : 'bg-red-600/30 text-red-300'
          }`}>
            {status === 'online' ? '✓ متصل' : '⚠️ بدون اتصال'}
          </div>
        </div>

        {/* Next Prayer Alert */}
        {nextPrayer && (
          <div className="bg-red-800/40 border border-red-600/50 rounded-2xl p-4 mb-6">
            <p className="text-[10px] text-red-300 font-black uppercase mb-2">⏰ الصلاة القادمة</p>
            <p className="text-amber-300 font-black text-xl">{getPrayerConfig(nextPrayer).name}</p>
            <p className="text-slate-200 text-[10px] mt-2">{times[nextPrayer]} - متبقي: {timeUntilNext}</p>
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
                className={`p-4 rounded-2xl border-b-4 transition-all active:scale-95 ${
                  isNext
                    ? 'bg-red-700 border-red-900 shadow-lg scale-105'
                    : 'bg-red-800/40 border-red-700/30 hover:bg-red-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{prayer.icon}</span>
                    <div className="text-left">
                      <p className="text-amber-300 font-black">{prayer.name}</p>
                      {isNext && <p className="text-[8px] text-red-200">الصلاة القادمة 🔔</p>}
                    </div>
                  </div>
                  <p className="text-3xl font-black text-amber-400">{prayerTime}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Supplication Card */}
      {showSupplication && (
        <div className="mx-2 rounded-[3rem] p-10 bg-gradient-to-br from-emerald-950 to-emerald-900 shadow-2xl border-b-8 border-emerald-600 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black quran-text text-amber-400">دعاء {selectedSupplication.nameArabic}</h3>
            <button
              onClick={() => setShowSupplication(false)}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Supplication Text */}
          <div className="bg-emerald-800/40 border border-emerald-600/50 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-[10px] text-emerald-300 font-black uppercase mb-2">📖 الدعاء بالعربية:</p>
              <p className="text-amber-100 font-bold text-lg quran-text leading-relaxed">{selectedSupplication.dua}</p>
            </div>

            {selectedSupplication.transliteration && (
              <div>
                <p className="text-[10px] text-emerald-300 font-black uppercase mb-2">🔤 التشكيل:</p>
                <p className="text-slate-300 text-[10px] font-bold leading-relaxed">{selectedSupplication.transliteration}</p>
              </div>
            )}

            <div>
              <p className="text-[10px] text-emerald-300 font-black uppercase mb-2">⏰ وقت الدعاء:</p>
              <p className="text-slate-200 text-sm font-bold">{selectedSupplication.timing}</p>
            </div>

            {selectedSupplication.reward && (
              <div className="bg-emerald-800/30 rounded-lg p-3 border border-emerald-600/30">
                <p className="text-[10px] text-emerald-300 font-black uppercase mb-1">🏆 الثواب والفضل:</p>
                <p className="text-amber-200 text-sm font-bold">{selectedSupplication.reward}</p>
              </div>
            )}
          </div>

          {/* Voice Button */}
          <button
            onClick={() => speakSupplication(selectedSupplication.dua)}
            className="w-full p-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            🔊 استمع للدعاء
          </button>
        </div>
      )}

      {/* Supplication Tabs */}
      <div className="mx-2 space-y-3">
        <h3 className="text-xl font-black text-amber-400 px-4">📿 أدعية الصلوات</h3>
        <div className="px-2 space-y-3">
          {PRAYER_SUPPLICATIONS.map((supp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPrayer(supp);
                setShowSupplication(true);
              }}
              className="w-full p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-black text-sm transition-all active:scale-95 flex items-center justify-between"
            >
              <span>{supp.nameArabic}</span>
              <span className="text-xl">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mx-2 space-y-3">
        <h3 className="text-xl font-black text-amber-400 px-4">⚙️ الإعدادات</h3>
        <div className="space-y-2 px-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`w-full p-4 rounded-2xl font-black text-sm flex items-center justify-between ${
              voiceEnabled
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span>🔊 تفعيل الصوت</span>
            <span>{voiceEnabled ? '✓' : '✗'}</span>
          </button>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-full p-4 rounded-2xl font-black text-sm flex items-center justify-between ${
              notificationsEnabled
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <span>🔔 الإشعارات</span>
            <span>{notificationsEnabled ? '✓' : '✗'}</span>
          </button>
          <button
            onClick={() => loadPrayerTimesFromAPI()}
            className="w-full p-4 rounded-2xl font-black text-sm bg-blue-700 text-white flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 transition-all"
          >
            🔄 تحديث المواقيت
          </button>
        </div>
      </div>

      {/* Prayer Info */}
      <div className="mx-2 bg-slate-800/50 rounded-2xl p-6 space-y-4">
        <h3 className="text-amber-400 font-black">📖 معلومات الصلاة</h3>
        <div className="space-y-3 text-[10px] text-slate-300 leading-relaxed font-bold">
          <p>
            <span className="text-amber-400 font-black">🕌 الحكمة:</span> {' '}
            الصلاة عماد الدين وهي الركن الثاني من أركان الإسلام، والمقصود من الصلاة هو التضرع والخضوع والقرب من الله تعالى وتنقية النفس من الذنوب والآثام.
          </p>
          <p>
            <span className="text-amber-400 font-black">⏰ الأوقات:</span> {' '}
            حددت الصلوات الخمس في أوقات معينة تبدأ من طلوع الفجر وتنتهي بدخول الليل، وكل وقت له حكمة شرعية وفوائد روحية وصحية.
          </p>
          <p>
            <span className="text-amber-400 font-black">💪 الفضل:</span> {' '}
            قال الله تعالى: (إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ)، والصلاة تجلب بركة في الوقت والرزق وتطهر من الخطايا.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;

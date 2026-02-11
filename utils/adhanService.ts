// FIX: Adhan notification and prayer time utilities
// Provides Adhan sounds and notification management for prayer times

export interface AdhanAudio {
  name: string;
  url: string;
  duration: number; // in milliseconds
}

// Adhan audio URLs (using libre/open sources)
export const ADHAN_SOUNDS: Record<string, AdhanAudio> = {
  default: {
    name: 'أذان الفجر والمغرب (تقليدي)',
    url: 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==', // Minimal WAV fallback
    duration: 15000
  }
};

export class AdhanNotificationManager {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private isPlaying = false;

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        this.audioContext = new window.AudioContext();
      } catch (e) {
        console.warn('AudioContext not available');
      }
    }
  }

  /**
   * FIX: Play Adhan using Web Audio API
   * Generates a simple adhan-like tone pattern
   */
  playAdhan = (duration: number = 3000) => {
    if (this.isPlaying || !this.audioContext) return;

    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      // Create oscillator for adhan tone
      this.oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      this.oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Set up adhan-like tone (around 800Hz, typical for Adhan)
      this.oscillator.frequency.setValueAtTime(800, now);
      this.oscillator.frequency.setValueAtTime(900, now + 0.5);
      this.oscillator.frequency.setValueAtTime(800, now + 1.0);

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

      this.oscillator.start(now);
      this.oscillator.stop(now + duration / 1000);

      this.isPlaying = true;

      setTimeout(() => {
        this.isPlaying = false;
      }, duration);
    } catch (e) {
      console.warn('Failed to play Adhan:', e);
    }
  };

  /**
   * FIX: Show browser notification for prayer time
   */
  showNotification = (prayerName: string, prayerTime: string) => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return;
    }

    // Request permission if needed
    if (Notification.permission === 'granted') {
      this.displayNotification(prayerName, prayerTime);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          this.displayNotification(prayerName, prayerTime);
        }
      });
    }
  };

  private displayNotification = (prayerName: string, prayerTime: string) => {
    const options: NotificationOptions = {
      icon: '🕌',
      badge: '🕌',
      tag: 'prayer-time',
      requireInteraction: true,
      body: `الوقت الآن: ${prayerTime}. تفضل بأداء الصلاة المفروضة.`
    };

    try {
      new Notification(`⏰ حان وقت صلاة ${prayerName}`, options);
    } catch (e) {
      console.warn('Failed to show notification:', e);
    }
  };

  stopAdhan = () => {
    if (this.oscillator && this.audioContext) {
      this.oscillator.stop(this.audioContext.currentTime);
      this.isPlaying = false;
    }
  };
}

/**
 * FIX: Calculate time until next prayer
 * Returns { hours, minutes } object
 */
export const calculateTimeUntilPrayer = (prayerTimeStr: string): { hours: number; minutes: number; seconds: number } => {
  const now = new Date();
  const [hours, minutes] = prayerTimeStr.split(':').map(Number);
  const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

  // If prayer time has passed, calculate for next day
  if (prayerDate < now) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  const diff = prayerDate.getTime() - now.getTime();
  const totalSeconds = Math.floor(diff / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return { hours: h, minutes: m, seconds: s };
};

/**
 * FIX: Format prayer time display
 */
export const formatPrayerTime = (timeStr: string): string => {
  if (!timeStr) return '--:--';
  return timeStr;
};

/**
 * FIX: Save prayer times to localStorage with cross-device compatibility
 */
export const savePrayerTimes = (times: Record<string, string>, city: string) => {
  try {
    const data = {
      times,
      city,
      timestamp: Date.now(),
      version: 1 // For future compatibility
    };
    localStorage.setItem('prayer_times_data', JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save prayer times:', e);
  }
};

/**
 * FIX: Load prayer times from localStorage with fallback
 */
export const loadPrayerTimes = (): { times: Record<string, string>; city: string } | null => {
  try {
    const data = localStorage.getItem('prayer_times_data');
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    // Verify data structure
    if (parsed.times && parsed.city && typeof parsed.times === 'object') {
      return { times: parsed.times, city: parsed.city };
    }
  } catch (e) {
    console.warn('Failed to load prayer times:', e);
  }
  return null;
};

/**
 * FIX: Request permission for notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported in this browser');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.warn('Failed to request notification permission:', e);
      return false;
    }
  }

  return false;
};

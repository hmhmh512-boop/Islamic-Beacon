/**
 * خدمة تشغيل الصوت المتقدمة باستخدام Web Audio API
 * تنشئ أصواتًا تشبه التلاوة الفعلية
 */

interface AudioConfig {
  frequency?: number;
  duration?: number;
  volume?: number;
  playbackRate?: number;
}

class SoundPlayer {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  /**
   * إنشاء وتشغيل صوت تشبيه التلاوة
   */
  playQuranicAudio(surahNumber: number, reciterId: string, config: AudioConfig = {}) {
    if (!this.audioContext) return;

    const {
      frequency = 300,
      duration = 2,
      volume = 0.5,
      playbackRate = 1
    } = config;

    try {
      const ctx = this.audioContext;
      
      // إنشاء oscillator يشبه صوت التلاوة
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // الإعدادات الأساسية
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      // تطبيق مرشح تمرير منخفض لصوت طبيعي أكثر
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, ctx.currentTime);

      // ربط الأجهزة
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      // تشغيل الصوت
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      this.isPlaying = true;
      setTimeout(() => {
        this.isPlaying = false;
      }, duration * 1000);
    } catch (e) {
      console.error('Error playing Quranic audio:', e);
    }
  }

  /**
   * تشغيل صوت الأذان البسيط
   */
  playAdhanSound(config: AudioConfig = {}) {
    if (!this.audioContext) return;

    const {
      frequency = 400,
      duration = 3,
      volume = 0.7
    } = config;

    try {
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      this.isPlaying = true;
      setTimeout(() => {
        this.isPlaying = false;
      }, duration * 1000);
    } catch (e) {
      console.error('Error playing Adhan sound:', e);
    }
  }

  /**
   * تشغيل صوت الذكر (تكبير، تسبيح، إلخ)
   */
  playDhikrSound(text: string, config: AudioConfig = {}) {
    const {
      frequency = 500,
      duration = 1.5,
      volume = 0.6
    } = config;

    if (!this.audioContext) return;

    try {
      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      // استخدم Web Speech API للنص أيضًا
      this.speakText(text);

      this.isPlaying = true;
      setTimeout(() => {
        this.isPlaying = false;
      }, duration * 1000);
    } catch (e) {
      console.error('Error playing Dhikr sound:', e);
    }
  }

  /**
   * التحدث بالنص باستخدام Web Speech API
   */
  speakText(text: string, lang: string = 'ar-SA') {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      try {
        window.speechSynthesis.cancel(); // إلغاء أي صوت سابق
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }
  }

  /**
   * إيقاف التشغيل
   */
  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
  }

  /**
   * التحقق من حالة التشغيل
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * محاولة تحميل صوت من الإنترنت مع fallback
   */
  async loadAndPlayAudio(url: string, volume: number = 0.5): Promise<void> {
    try {
      if (!this.audioContext) {
        // إذا لم يكن لدينا Web Audio Context، استخدم HTML Audio
        const audio = new Audio(url);
        audio.volume = volume;
        audio.crossOrigin = 'anonymous';
        audio.onerror = () => {
          console.warn('Failed to load audio from URL:', url);
          // يمكن هنا تشغيل صوت بديل من Web Audio API
        };
        await audio.play();
        return;
      }

      // محاولة تحميل من الإنترنت
      const response = await fetch(url, { 
        mode: 'cors',
        headers: {
          'Accept': 'audio/*'
        }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = audioBuffer;
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start(0);
      this.isPlaying = true;
      
      source.onended = () => {
        this.isPlaying = false;
      };
    } catch (error) {
      console.error('Error loading and playing audio:', error);
      // تشغيل صوت بديل
      this.playQuranicAudio(1, 'default', { duration: 2 });
    }
  }
}

// إنشاء instance واحد عام
const soundPlayer = new SoundPlayer();

export default soundPlayer;

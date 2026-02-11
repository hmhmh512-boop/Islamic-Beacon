/**
 * Local Audio Manager
 * Handles all offline audio playback and recording
 */

import offlineStorage from './offlineStorage';

interface AudioConfig {
  volume?: number;
  autoplay?: boolean;
  loop?: boolean;
}

class LocalAudioManager {
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private isPlaying = false;
  private currentBuffer: AudioBuffer | null = null;
  private currentTime = 0;

  constructor() {
    this.initAudioContext();
  }

  /**
   * Initialize Web Audio Context
   */
  private initAudioContext(): void {
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
        console.log('[LocalAudioManager] Audio context initialized');
      } catch (e) {
        console.error('[LocalAudioManager] Web Audio API not supported:', e);
      }
    }
  }

  /**
   * Load audio from local storage or URL
   */
  async loadAudio(key: string, url?: string): Promise<AudioBuffer | null> {
    try {
      // Try to get from local storage first
      const stored = await offlineStorage.getAudio(key);
      if (stored) {
        console.log(`[LocalAudioManager] Audio loaded from storage: ${key}`);
        const decoded = await this.audioContext!.decodeAudioData(stored.slice(0));
        this.currentBuffer = decoded;
        return decoded;
      }

      // If not stored, try to load from URL and cache it
      if (url) {
        try {
          const response = await fetch(url, { 
            mode: 'cors',
            cache: 'force-cache' 
          });
          
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          
          const arrayBuffer = await response.arrayBuffer();
          
          // Decode
          const decoded = await this.audioContext!.decodeAudioData(arrayBuffer.slice(0));
          
          // Save to storage for future offline use
          await offlineStorage.saveAudio(key, arrayBuffer);
          console.log(`[LocalAudioManager] Audio cached: ${key}`);
          
          this.currentBuffer = decoded;
          return decoded;
        } catch (fetchError) {
          console.warn(`[LocalAudioManager] Failed to load from URL: ${url}`, fetchError);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error(`[LocalAudioManager] Error loading audio: ${key}`, error);
      return null;
    }
  }

  /**
   * Play loaded audio
   */
  async play(key: string, url?: string, config: AudioConfig = {}): Promise<void> {
    try {
      if (!this.audioContext) {
        console.error('[LocalAudioManager] Audio context not initialized');
        return;
      }

      // Stop current playback
      if (this.isPlaying) {
        this.stop();
      }

      // Load audio
      const buffer = await this.loadAudio(key, url);
      if (!buffer) {
        console.error(`[LocalAudioManager] Failed to load audio: ${key}`);
        return;
      }

      // Create source
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      
      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(config.volume || 0.8, this.audioContext.currentTime);
      
      // Connect
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Play
      source.start(0);
      source.loop = config.loop || false;
      
      this.currentSource = source;
      this.isPlaying = true;
      this.currentTime = 0;
      
      console.log(`[LocalAudioManager] Playing: ${key}`);

      // Handle end
      source.onended = () => {
        this.isPlaying = false;
        this.currentSource = null;
      };
    } catch (error) {
      console.error('[LocalAudioManager] Playback error:', error);
      this.isPlaying = false;
    }
  }

  /**
   * Stop playback
   */
  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        console.warn('[LocalAudioManager] Error stopping audio:', e);
      }
    }
    this.isPlaying = false;
    this.currentTime = 0;
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (this.audioContext) {
      this.audioContext.suspend();
      this.isPlaying = false;
    }
  }

  /**
   * Resume playback
   */
  resume(): void {
    if (this.audioContext) {
      this.audioContext.resume();
      this.isPlaying = true;
    }
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.audioContext) {
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.audioContext.currentTime);
    }
  }

  /**
   * Check if playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Create offline Adhan sound (synthetic)
   */
  async createAdhanSound(prayerName: string): Promise<AudioBuffer | null> {
    try {
      if (!this.audioContext) return null;

      const sampleRate = this.audioContext.sampleRate;
      const duration = 10; // 10 seconds
      const audioBuffer = this.audioContext.createBuffer(
        1,
        sampleRate * duration,
        sampleRate
      );

      const channelData = audioBuffer.getChannelData(0);
      const frequencies = {
        fajr: [600, 700], // Lower frequencies for dawn
        dhuhr: [800, 900],
        asr: [800, 900],
        maghrib: [900, 1000],
        isha: [700, 800],
      };

      const freqRange = (frequencies as any)[prayerName] || [500, 600];

      // Generate simple sine wave pattern for Adhan
      for (let i = 0; i < channelData.length; i++) {
        const t = i / sampleRate;
        const freq = freqRange[0] + (freqRange[1] - freqRange[0]) * Math.sin(t * 0.5);
        const value = Math.sin(2 * Math.PI * freq * t) * 0.3;
        const envelope = Math.exp(-t * 0.3); // Fade out
        channelData[i] = value * envelope;
      }

      return audioBuffer;
    } catch (error) {
      console.error('[LocalAudioManager] Error creating Adhan sound:', error);
      return null;
    }
  }
}

// Export singleton
const localAudioManager = new LocalAudioManager();
export default localAudioManager;

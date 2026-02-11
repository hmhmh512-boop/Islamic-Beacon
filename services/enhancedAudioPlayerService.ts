/**
 * Enhanced Audio Player Service
 * Works with Web Audio API and native Android MediaPlayer
 * Supports: Quran, Azkar, Adhan, Tasbih
 */

interface AudioTrack {
  id: string;
  audio?: HTMLAudioElement;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  onProgress?: (position: number, duration: number) => void;
  onComplete?: () => void;
  updateInterval?: NodeJS.Timeout;
}

class EnhancedAudioPlayerService {
  private tracks: Map<string, AudioTrack> = new Map();
  private audioContext?: AudioContext;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('[AudioPlayer] Could not initialize AudioContext:', e);
      }
    }
  }

  /**
   * Play audio with support for:
   * - Web Audio API (fallback)
   * - HTML5 Audio (default)
   * - Native Android MediaPlayer (if available)
   */
  async play(
    id: string,
    assetPath: string,
    onProgress?: (position: number, duration: number) => void,
    onComplete?: () => void
  ): Promise<boolean> {
    try {
      // Stop any existing playback
      if (this.tracks.has(id)) {
        await this.stop(id);
      }

      // Try native first
      const nativeInterface = (window as any).NativeMediaPlayer;
      if (nativeInterface?.play) {
        console.log('[AudioPlayer] Using native Android MediaPlayer');
        nativeInterface.play(
          id,
          `file:///android_asset/${assetPath}`,
          (position: number, duration: number) => onProgress?.(position, duration),
          () => {
            this.tracks.delete(id);
            onComplete?.();
          },
          (error: string) => console.error('[AudioPlayer] Native error:', error)
        );
        return true;
      }

      // Fallback to Web Audio API
      console.log('[AudioPlayer] Using Web Audio API fallback');
      return this.playWithWebAudio(id, assetPath, onProgress, onComplete);
    } catch (error) {
      console.error('[AudioPlayer] Error playing audio:', error);
      return false;
    }
  }

  /**
   * Play using Web Audio API
   */
  private async playWithWebAudio(
    id: string,
    assetPath: string,
    onProgress?: (position: number, duration: number) => void,
    onComplete?: () => void
  ): Promise<boolean> {
    try {
      // Handle Quran, Azkar, etc.
      const audioElement = new Audio();
      
      // Support both public and asset paths
      if (assetPath.startsWith('audio/')) {
        // Local public folder
        audioElement.src = `/${assetPath}`;
      } else if (assetPath.startsWith('http')) {
        audioElement.src = assetPath;
      } else {
        audioElement.src = `/audio/${assetPath}`;
      }

      audioElement.crossOrigin = 'anonymous';

      const track: AudioTrack = {
        id,
        audio: audioElement,
        isPlaying: true,
        duration: 0,
        currentTime: 0,
        onProgress,
        onComplete
      };

      // Update duration when metadata loads
      audioElement.onloadedmetadata = () => {
        track.duration = audioElement.duration * 1000; // Convert to ms
      };

      // Handle completion
      audioElement.onended = () => {
        this.tracks.delete(id);
        onComplete?.();
      };

      // Handle errors
      audioElement.onerror = (error) => {
        console.error(`[AudioPlayer] Error loading audio ${assetPath}:`, error);
        this.tracks.delete(id);
      };

      // Progress updates
      if (onProgress) {
        track.updateInterval = setInterval(() => {
          if (audioElement && !audioElement.paused) {
            onProgress(audioElement.currentTime * 1000, audioElement.duration * 1000);
          }
        }, 100);
      }

      this.tracks.set(id, track);

      // Play
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('[AudioPlayer] Play error:', error);
        });
      }

      return true;
    } catch (error) {
      console.error('[AudioPlayer] Web audio fallback failed:', error);
      return false;
    }
  }

  /**
   * Pause playback
   */
  async pause(id: string): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeMediaPlayer;
      if (nativeInterface?.pause) {
        nativeInterface.pause(id);
      }

      const track = this.tracks.get(id);
      if (track?.audio) {
        track.audio.pause();
        track.isPlaying = false;
      }
      return true;
    } catch (error) {
      console.error('[AudioPlayer] Error pausing:', error);
      return false;
    }
  }

  /**
   * Resume playback
   */
  async resume(id: string): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeMediaPlayer;
      if (nativeInterface?.resume) {
        nativeInterface.resume(id);
      }

      const track = this.tracks.get(id);
      if (track?.audio) {
        track.audio.play();
        track.isPlaying = true;
      }
      return true;
    } catch (error) {
      console.error('[AudioPlayer] Error resuming:', error);
      return false;
    }
  }

  /**
   * Stop playback
   */
  async stop(id: string): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeMediaPlayer;
      if (nativeInterface?.stop) {
        nativeInterface.stop(id);
      }

      const track = this.tracks.get(id);
      if (track) {
        if (track.audio) {
          track.audio.pause();
          track.audio.src = '';
        }
        if (track.updateInterval) {
          clearInterval(track.updateInterval);
        }
      }

      this.tracks.delete(id);
      return true;
    } catch (error) {
      console.error('[AudioPlayer] Error stopping:', error);
      return false;
    }
  }

  /**
   * Seek to position
   */
  async seek(id: string, positionMs: number): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeMediaPlayer;
      if (nativeInterface?.seek) {
        nativeInterface.seek(id, positionMs);
      }

      const track = this.tracks.get(id);
      if (track?.audio) {
        track.audio.currentTime = positionMs / 1000;
      }
      return true;
    } catch (error) {
      console.error('[AudioPlayer] Error seeking:', error);
      return false;
    }
  }

  /**
   * Set volume (0.0 - 1.0)
   */
  async setVolume(id: string, volume: number): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeMediaPlayer;
      if (nativeInterface?.setVolume) {
        nativeInterface.setVolume(id, volume);
      }

      const track = this.tracks.get(id);
      if (track?.audio) {
        track.audio.volume = Math.max(0, Math.min(1, volume));
      }
      return true;
    } catch (error) {
      console.error('[AudioPlayer] Error setting volume:', error);
      return false;
    }
  }

  /**
   * Check if audio is playing
   */
  async isPlaying(id: string): Promise<boolean> {
    const track = this.tracks.get(id);
    if (track?.audio) {
      return !track.audio.paused;
    }
    return false;
  }

  /**
   * Stop all playbacks
   */
  async stopAll(): Promise<void> {
    const nativeInterface = (window as any).NativeMediaPlayer;
    if (nativeInterface?.stopAll) {
      nativeInterface.stopAll();
    }

    for (const [id, track] of this.tracks.entries()) {
      if (track.audio) {
        track.audio.pause();
        track.audio.src = '';
      }
      if (track.updateInterval) {
        clearInterval(track.updateInterval);
      }
    }
    this.tracks.clear();
  }

  /**
   * Generate test audio (silence) for development
   */
  generateTestAudio(durationSeconds: number = 3): Blob {
    if (!this.audioContext) {
      throw new Error('AudioContext not available');
    }

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * durationSeconds, sampleRate);
    const data = buffer.getChannelData(0);

    // Create silence
    for (let i = 0; i < data.length; i++) {
      data[i] = 0;
    }

    // Convert to WAV Blob
    const audioBuffer = this.bufferToWave(buffer);
    return new Blob([audioBuffer], { type: 'audio/wav' });
  }

  /**
   * Convert AudioBuffer to WAV
   */
  private bufferToWave(audioBuffer: AudioBuffer): ArrayBuffer {
    const length = audioBuffer.length * audioBuffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // "RIFF" chunk descriptor
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // "fmt " sub-chunk
    setUint32(0x20746366); // "fmt "
    setUint32(16); // chunkSize
    setUint16(1); // compressionCode (PCM)
    setUint16(audioBuffer.numberOfChannels);
    setUint32(audioBuffer.sampleRate);
    setUint32(audioBuffer.sampleRate * 2 * audioBuffer.numberOfChannels); // avgByteRate
    setUint16(audioBuffer.numberOfChannels * 2); // blockAlign
    setUint16(16); // bitsPerSample

    // "data" sub-chunk
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4); // chunkSize

    // Write audio data
    const volume = 0.8;
    let index = pos;
    const volume32Bit = volume < 1 ? volume * 0x7fff : 0x7fff;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        let sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(index, sample, true);
        index += 2;
      }
    }

    return arrayBuffer;
  }
}

// Export singleton
const enhancedAudioPlayerService = new EnhancedAudioPlayerService();
export default enhancedAudioPlayerService;

/**
 * Native MediaPlayer Service
 * Handles offline audio playback for Quran, Azkar, and Tasbih
 */

interface AudioPlayback {
  id: string;
  filePath: string;
  isPlaying: boolean;
  currentPosition: number;
  duration: number;
  onProgress?: (position: number, duration: number) => void;
  onComplete?: () => void;
}

class NativeMediaPlayerService {
  private activePlaybacks: Map<string, AudioPlayback> = new Map();

  constructor() {
    this.initializeNativeInterface();
  }

  private initializeNativeInterface(): void {
    if (typeof (window as any).NativeMediaPlayer === 'undefined') {
      console.warn('[MediaPlayer] Native interface not available (running in web)');
    }
  }

  /**
   * Play audio file from assets
   * Path format: android_asset/folder/file.mp3 or android_asset/audio/quran/afs/001.mp3
   */
  async play(
    id: string,
    assetPath: string,
    onProgress?: (position: number, duration: number) => void,
    onComplete?: () => void
  ): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeMediaPlayer;

      if (!nativeInterface || !nativeInterface.play) {
        console.log('[MediaPlayer] Native not available, using web fallback');
        return this.playWebFallback(id, assetPath, onProgress, onComplete);
      }

      // Call native Android MediaPlayer
      nativeInterface.play(
        id,
        `file:///android_asset/${assetPath}`,
        (position: number, duration: number) => {
          onProgress?.(position, duration);
        },
        () => {
          this.activePlaybacks.delete(id);
          onComplete?.();
        },
        (error: string) => {
          console.error('[MediaPlayer] Error:', error);
          this.activePlaybacks.delete(id);
        }
      );

      this.activePlaybacks.set(id, {
        id,
        filePath: assetPath,
        isPlaying: true,
        currentPosition: 0,
        duration: 0,
        onProgress,
        onComplete
      });

      return true;
    } catch (error) {
      console.error('[MediaPlayer] Error playing:', error);
      return this.playWebFallback(id, assetPath, onProgress, onComplete);
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

      const playback = this.activePlaybacks.get(id);
      if (playback) {
        playback.isPlaying = false;
      }
      return true;
    } catch (error) {
      console.error('[MediaPlayer] Error pausing:', error);
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

      const playback = this.activePlaybacks.get(id);
      if (playback) {
        playback.isPlaying = true;
      }
      return true;
    } catch (error) {
      console.error('[MediaPlayer] Error resuming:', error);
      return false;
    }
  }

  /**
   * Stop playback and release resources
   */
  async stop(id: string): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeMediaPlayer;
      if (nativeInterface?.stop) {
        nativeInterface.stop(id);
      }

      this.activePlaybacks.delete(id);
      return true;
    } catch (error) {
      console.error('[MediaPlayer] Error stopping:', error);
      return false;
    }
  }

  /**
   * Seek to position (milliseconds)
   */
  async seek(id: string, positionMs: number): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeMediaPlayer;
      if (nativeInterface?.seek) {
        nativeInterface.seek(id, positionMs);
      }

      const playback = this.activePlaybacks.get(id);
      if (playback) {
        playback.currentPosition = positionMs;
      }
      return true;
    } catch (error) {
      console.error('[MediaPlayer] Error seeking:', error);
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
        nativeInterface.setVolume(id, Math.max(0, Math.min(1, volume)));
      }
      return true;
    } catch (error) {
      console.error('[MediaPlayer] Error setting volume:', error);
      return false;
    }
  }

  /**
   * Get current playback state
   */
  getPlayback(id: string): AudioPlayback | undefined {
    return this.activePlaybacks.get(id);
  }

  /**
   * Check if currently playing
   */
  isPlaying(id: string): boolean {
    return this.activePlaybacks.get(id)?.isPlaying ?? false;
  }

  /**
   * Web fallback for testing
   */
  private playWebFallback(
    id: string,
    assetPath: string,
    onProgress?: (position: number, duration: number) => void,
    onComplete?: () => void
  ): boolean {
    try {
      // In web fallback, try HTML5 audio
      const audio = new Audio(`/audio/${assetPath}`);
      
      audio.addEventListener('timeupdate', () => {
        onProgress?.(audio.currentTime * 1000, audio.duration * 1000);
      });

      audio.addEventListener('ended', () => {
        this.activePlaybacks.delete(id);
        onComplete?.();
      });

      audio.play().catch(() => {
        console.warn('[MediaPlayer] Web fallback failed to play');
      });

      this.activePlaybacks.set(id, {
        id,
        filePath: assetPath,
        isPlaying: true,
        currentPosition: 0,
        duration: audio.duration * 1000,
        onProgress,
        onComplete
      });

      return true;
    } catch (error) {
      console.error('[MediaPlayer] Fallback error:', error);
      return false;
    }
  }

  /**
   * Stop all active playbacks
   */
  async stopAll(): Promise<void> {
    for (const [id] of this.activePlaybacks) {
      await this.stop(id);
    }
  }
}

// Export singleton
const nativeMediaPlayerService = new NativeMediaPlayerService();
export default nativeMediaPlayerService;

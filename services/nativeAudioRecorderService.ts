/**
 * Native Audio Recorder Service
 * Handles recording user voice using native Android MediaRecorder
 */

interface Recording {
  id: string;
  filePath: string;
  duration: number;
  timestamp: number;
  size: number;
}

class NativeAudioRecorderService {
  private currentRecording: { id: string; startTime: number } | null = null;
  private recordings: Map<string, Recording> = new Map();

  constructor() {
    this.initializeNativeInterface();
    this.loadSavedRecordings();
  }

  private initializeNativeInterface(): void {
    if (typeof (window as any).NativeAudioRecorder === 'undefined') {
      console.warn('[AudioRecorder] Native interface not available (running in web)');
    }
  }

  /**
   * Request microphone permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeAudioRecorder;

      if (!nativeInterface || !nativeInterface.requestPermission) {
        console.log('[AudioRecorder] Native not available');
        return true; // Assume granted in web
      }

      return new Promise((resolve) => {
        nativeInterface.requestPermission(
          (granted: boolean) => resolve(granted),
          (error: string) => {
            console.error('[AudioRecorder] Permission error:', error);
            resolve(false);
          }
        );
      });
    } catch (error) {
      console.error('[AudioRecorder] Error requesting permission:', error);
      return false;
    }
  }

  /**
   * Start recording
   */
  async startRecording(id: string): Promise<boolean> {
    try {
      // Check permission first
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.error('[AudioRecorder] No microphone permission');
        return false;
      }

      const nativeInterface = (window as any).NativeAudioRecorder;

      if (!nativeInterface || !nativeInterface.startRecording) {
        console.log('[AudioRecorder] Native not available');
        return false;
      }

      const recordingPath = `audio_recordings/${id}_${Date.now()}.aac`;

      nativeInterface.startRecording(
        recordingPath,
        () => {
          console.log('[AudioRecorder] Recording started:', id);
          this.currentRecording = { id, startTime: Date.now() };
        },
        (error: string) => {
          console.error('[AudioRecorder] Recording error:', error);
          this.currentRecording = null;
        }
      );

      return true;
    } catch (error) {
      console.error('[AudioRecorder] Error starting recording:', error);
      return false;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<Recording | null> {
    try {
      if (!this.currentRecording) {
        console.warn('[AudioRecorder] No active recording');
        return null;
      }

      const nativeInterface = (window as any).NativeAudioRecorder;

      if (!nativeInterface || !nativeInterface.stopRecording) {
        return null;
      }

      return new Promise((resolve) => {
        nativeInterface.stopRecording(
          (result: { filePath: string; duration: number; size: number }) => {
            const recording: Recording = {
              id: this.currentRecording!.id,
              filePath: result.filePath,
              duration: result.duration,
              timestamp: this.currentRecording!.startTime,
              size: result.size
            };

            this.recordings.set(recording.id, recording);
            this.saveRecordings();

            console.log('[AudioRecorder] Recording saved:', recording);
            this.currentRecording = null;
            resolve(recording);
          },
          (error: string) => {
            console.error('[AudioRecorder] Error stopping recording:', error);
            this.currentRecording = null;
            resolve(null);
          }
        );
      });
    } catch (error) {
      console.error('[AudioRecorder] Error stopping recording:', error);
      this.currentRecording = null;
      return null;
    }
  }

  /**
   * Cancel current recording
   */
  async cancelRecording(): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeAudioRecorder;

      if (!nativeInterface || !nativeInterface.cancelRecording) {
        return false;
      }

      nativeInterface.cancelRecording(
        () => {
          console.log('[AudioRecorder] Recording cancelled');
          this.currentRecording = null;
        },
        (error: string) => {
          console.error('[AudioRecorder] Cancel error:', error);
        }
      );

      return true;
    } catch (error) {
      console.error('[AudioRecorder] Error cancelling recording:', error);
      return false;
    }
  }

  /**
   * Delete recording
   */
  async deleteRecording(id: string): Promise<boolean> {
    try {
      const nativeInterface = (window as any).NativeAudioRecorder;
      const recording = this.recordings.get(id);

      if (!recording) {
        return false;
      }

      if (nativeInterface?.deleteRecording) {
        nativeInterface.deleteRecording(
          recording.filePath,
          () => {
            this.recordings.delete(id);
            this.saveRecordings();
            console.log('[AudioRecorder] Recording deleted:', id);
          },
          (error: string) => {
            console.error('[AudioRecorder] Delete error:', error);
          }
        );
      }

      return true;
    } catch (error) {
      console.error('[AudioRecorder] Error deleting recording:', error);
      return false;
    }
  }

  /**
   * Get all recordings
   */
  getRecordings(): Recording[] {
    return Array.from(this.recordings.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }

  /**
   * Get recording by ID
   */
  getRecording(id: string): Recording | undefined {
    return this.recordings.get(id);
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.currentRecording !== null;
  }

  /**
   * Save recordings to localStorage
   */
  private saveRecordings(): void {
    try {
      const data = Array.from(this.recordings.values());
      localStorage.setItem('audio_recordings', JSON.stringify(data));
    } catch (error) {
      console.error('[AudioRecorder] Error saving recordings:', error);
    }
  }

  /**
   * Load recordings from localStorage
   */
  private loadSavedRecordings(): void {
    try {
      const data = localStorage.getItem('audio_recordings');
      if (data) {
        const recordings = JSON.parse(data) as Recording[];
        recordings.forEach((r) => {
          this.recordings.set(r.id, r);
        });
      }
    } catch (error) {
      console.error('[AudioRecorder] Error loading recordings:', error);
    }
  }
}

// Export singleton
const nativeAudioRecorderService = new NativeAudioRecorderService();
export default nativeAudioRecorderService;

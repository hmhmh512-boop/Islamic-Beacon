/**
 * Microphone Recording System
 * Handles voice recording for Tasme'a (Quranic dictation practice)
 */

import offlineStorage from './offlineStorage';

interface RecordingMetadata {
  id: string;
  timestamp: number;
  duration: number;
  surahId?: number;
  surahName?: string;
  ayahRange?: string;
  audioKey: string;
}

class MicrophoneRecorder {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private isRecording = false;
  private recordingChunks: Blob[] = [];
  private startTime = 0;
  private recordingId: string | null = null;

  /**
   * Request microphone access
   */
  async requestPermission(): Promise<boolean> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
        video: false,
      });

      console.log('[MicrophoneRecorder] Microphone access granted');
      return true;
    } catch (error) {
      console.error('[MicrophoneRecorder] Microphone access denied:', error);
      return false;
    }
  }

  /**
   * Start recording
   */
  async startRecording(recordingId?: string): Promise<boolean> {
    try {
      if (!this.mediaStream) {
        const hasPermission = await this.requestPermission();
        if (!hasPermission) {
          return false;
        }
      }

      if (!this.mediaStream) {
        console.error('[MicrophoneRecorder] No media stream available');
        return false;
      }

      this.recordingChunks = [];
      this.recordingId = recordingId || `recording_${Date.now()}`;
      this.startTime = Date.now();

      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      };

      // Fallback for browsers that don't support opus
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn('[MicrophoneRecorder] Opus not supported, using default codec');
        this.mediaRecorder = new MediaRecorder(this.mediaStream);
      } else {
        this.mediaRecorder = new MediaRecorder(this.mediaStream, options);
      }

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordingChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        await this.handleRecordingStop();
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('[MicrophoneRecorder] Recording error:', event.error);
      };

      this.mediaRecorder.start();
      this.isRecording = true;

      console.log(`[MicrophoneRecorder] Recording started: ${this.recordingId}`);
      return true;
    } catch (error) {
      console.error('[MicrophoneRecorder] Error starting recording:', error);
      this.isRecording = false;
      return false;
    }
  }

  /**
   * Stop recording
   */
  async stopRecording(): Promise<string | null> {
    try {
      if (!this.mediaRecorder || !this.isRecording) {
        console.warn('[MicrophoneRecorder] No active recording');
        return null;
      }

      this.mediaRecorder.stop();
      this.isRecording = false;

      console.log('[MicrophoneRecorder] Recording stopped');
      return this.recordingId;
    } catch (error) {
      console.error('[MicrophoneRecorder] Error stopping recording:', error);
      return null;
    }
  }

  /**
   * Handle recording completion
   */
  private async handleRecordingStop(): Promise<void> {
    try {
      const audioBlob = new Blob(this.recordingChunks, { type: 'audio/webm' });
      
      if (!this.recordingId) {
        console.error('[MicrophoneRecorder] No recording ID');
        return;
      }

      // Convert blob to ArrayBuffer
      const arrayBuffer = await audioBlob.arrayBuffer();

      // Save to offline storage
      await offlineStorage.saveAudio(this.recordingId, arrayBuffer);

      // Save metadata
      const duration = Math.floor((Date.now() - this.startTime) / 1000);
      const metadata: RecordingMetadata = {
        id: this.recordingId,
        timestamp: this.startTime,
        duration,
        audioKey: this.recordingId,
      };

      await offlineStorage.saveData(`metadata_${this.recordingId}`, metadata);

      console.log(`[MicrophoneRecorder] Recording saved: ${this.recordingId} (${duration}s)`);
    } catch (error) {
      console.error('[MicrophoneRecorder] Error saving recording:', error);
    }
  }

  /**
   * Get recording
   */
  async getRecording(recordingId: string): Promise<{ audio: ArrayBuffer; metadata: RecordingMetadata } | null> {
    try {
      const audio = await offlineStorage.getAudio(recordingId);
      const metadata = await offlineStorage.getData(`metadata_${recordingId}`);

      if (!audio || !metadata) {
        return null;
      }

      return { audio, metadata };
    } catch (error) {
      console.error('[MicrophoneRecorder] Error retrieving recording:', error);
      return null;
    }
  }

  /**
   * List all recordings
   */
  async listRecordings(): Promise<RecordingMetadata[]> {
    try {
      const allRecordings: RecordingMetadata[] = [];
      
      // This would need to be enhanced with a proper DB query
      // For now, retrieve from localStorage fallback
      const savedRecordings = localStorage.getItem('tasme_recordings');
      if (savedRecordings) {
        return JSON.parse(savedRecordings);
      }

      return allRecordings;
    } catch (error) {
      console.error('[MicrophoneRecorder] Error listing recordings:', error);
      return [];
    }
  }

  /**
   * Delete recording
   */
  async deleteRecording(recordingId: string): Promise<void> {
    try {
      await offlineStorage.deleteData(recordingId);
      await offlineStorage.deleteData(`metadata_${recordingId}`);

      console.log(`[MicrophoneRecorder] Recording deleted: ${recordingId}`);
    } catch (error) {
      console.error('[MicrophoneRecorder] Error deleting recording:', error);
    }
  }

  /**
   * Release microphone
   */
  releaseMicrophone(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = null;
      console.log('[MicrophoneRecorder] Microphone released');
    }
  }

  /**
   * Get recording status
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Get current recording duration (in seconds)
   */
  getCurrentDuration(): number {
    if (!this.isRecording) {
      return 0;
    }
    return Math.floor((Date.now() - this.startTime) / 1000);
  }
}

// Export singleton
const microphoneRecorder = new MicrophoneRecorder();
export default microphoneRecorder;

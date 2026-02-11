/**
 * Native Android Bridge Service
 * Communicates with native Adhan and alarm scheduling
 */

import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';

interface PrayerTime {
  name: string;
  time: Date;
  audio: string;
}

class NativeAdhanService {
  private adhanEnabled = false;
  private scheduledalarms: Map<string, number> = new Map();

  constructor() {
    this.initializeNativeListeners();
  }

  private initializeNativeListeners(): void {
    if (typeof (window as any).NativeAdhan === 'undefined') {
      console.warn('[NativeAdhanService] Native interface not available (running in web)');
      return;
    }
  }

  /**
   * Check if running on native Android app
   */
  isNativeApp(): boolean {
    return (window as any).cordova !== undefined || (window as any).NativeAdhan !== undefined;
  }

  /**
   * Request native permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!this.isNativeApp()) {
      console.log('[NativeAdhanService] Not running on native app');
      return false;
    }

    try {
      // Request notification permission (Android 13+)
      const result = await LocalNotifications.requestPermissions();
      console.log('[NativeAdhanService] Permissions result:', result);
      return result.display === 'granted';
    } catch (error) {
      console.error('[NativeAdhanService] Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Schedule Adhan alarm via native Android
   */
  async scheduleAdhanAlarm(
    prayerName: string,
    timeInMillis: number,
    audioAsset: string,
    enableSound: boolean = true
  ): Promise<boolean> {
    if (!this.isNativeApp()) {
      console.log('[NativeAdhanService] Not running on native app, using web-only scheduling');
      return this.scheduleWebFallback(prayerName, timeInMillis);
    }

    try {
      const nativeInterface = (window as any).NativeAdhan;
      
      if (nativeInterface && nativeInterface.scheduleAdhanAlarm) {
        // Call native Android method
        nativeInterface.scheduleAdhanAlarm(
          prayerName,
          timeInMillis,
          audioAsset,
          enableSound,
          () => {
            console.log('[NativeAdhanService] Alarm scheduled successfully:', prayerName);
            this.scheduledalarms.set(prayerName, timeInMillis);
          },
          (error: string) => {
            console.error('[NativeAdhanService] Error scheduling alarm:', error);
          }
        );
        return true;
      }
    } catch (error) {
      console.error('[NativeAdhanService] Error calling native method:', error);
      return this.scheduleWebFallback(prayerName, timeInMillis);
    }

    return false;
  }

  /**
   * Fallback web scheduling
   */
  private scheduleWebFallback(prayerName: string, timeInMillis: number): boolean {
    try {
      const timeout = timeInMillis - Date.now();
      
      if (timeout > 0) {
        setTimeout(() => {
          console.log('[NativeAdhanService] Web fallback: Adhan time reached for', prayerName);
          this.triggerAdhanNotification(prayerName);
        }, timeout);
        
        this.scheduledalarms.set(prayerName, timeInMillis);
        return true;
      }
    } catch (error) {
      console.error('[NativeAdhanService] Web fallback error:', error);
    }
    return false;
  }

  /**
   * Cancel scheduled alarm
   */
  async cancelAdhanAlarm(prayerName: string): Promise<boolean> {
    if (!this.isNativeApp()) {
      this.scheduledalarms.delete(prayerName);
      return true;
    }

    try {
      const nativeInterface = (window as any).NativeAdhan;
      
      if (nativeInterface && nativeInterface.cancelAdhanAlarm) {
        nativeInterface.cancelAdhanAlarm(
          prayerName,
          () => {
            console.log('[NativeAdhanService] Alarm cancelled:', prayerName);
            this.scheduledalarms.delete(prayerName);
          },
          (error: string) => {
            console.error('[NativeAdhanService] Error cancelling alarm:', error);
          }
        );
        return true;
      }
    } catch (error) {
      console.error('[NativeAdhanService] Error cancelling alarm:', error);
    }

    return false;
  }

  /**
   * Schedule multiple prayer alarms
   */
  async schedulePrayerAlarms(
    prayerTimes: PrayerTime[],
    enableSound: boolean = true
  ): Promise<void> {
    for (const prayer of prayerTimes) {
      await this.scheduleAdhanAlarm(
        prayer.name,
        prayer.time.getTime(),
        prayer.audio,
        enableSound
      );
    }
  }

  /**
   * Cancel all scheduled alarms
   */
  async cancelAllAlarms(): Promise<void> {
    for (const prayerName of this.scheduledalarms.keys()) {
      await this.cancelAdhanAlarm(prayerName);
    }
  }

  /**
   * Trigger Adhan notification (web fallback)
   */
  private async triggerAdhanNotification(prayerName: string): Promise<void> {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id: parseInt(prayerName.charCodeAt(0).toString()),
            title: `أذان ${prayerName}`,
            body: 'حان وقت الصلاة',
            smallIcon: 'ic_launcher_foreground',
            largeIcon: 'ic_launcher',
            autoCancel: true,
            silent: false,
          },
        ],
      });
    } catch (error) {
      console.error('[NativeAdhanService] Error triggering notification:', error);
    }
  }

  /**
   * Get list of installed Adhan audio files
   */
  async getAvailableAdhanAudio(): Promise<string[]> {
    // These should be in android/app/src/main/assets/adhan/
    return [
      'adhan_default.mp3',
      'adhan_makkah.mp3',
      'adhan_madinah.mp3',
      'adhan_traditional.mp3'
    ];
  }

  /**
   * Play test Adhan sound
   */
  async playTestAdhan(audioAsset: string): Promise<void> {
    if (!this.isNativeApp()) {
      console.log('[NativeAdhanService] Not on native app, cannot play test Adhan');
      return;
    }

    try {
      const nativeInterface = (window as any).NativeAdhan;
      
      if (nativeInterface && nativeInterface.playTestAdhan) {
        nativeInterface.playTestAdhan(
          audioAsset,
          () => {
            console.log('[NativeAdhanService] Test Adhan playing:', audioAsset);
          },
          (error: string) => {
            console.error('[NativeAdhanService] Error playing test Adhan:', error);
          }
        );
      }
    } catch (error) {
      console.error('[NativeAdhanService] Error calling playTestAdhan:', error);
    }
  }

  /**
   * Set Adhan enabled status
   */
  setAdhanEnabled(enabled: boolean): void {
    this.adhanEnabled = enabled;
    localStorage.setItem('adhan_enabled', JSON.stringify(enabled));
  }

  /**
   * Get Adhan enabled status
   */
  isAdhanEnabled(): boolean {
    const stored = localStorage.getItem('adhan_enabled');
    return stored ? JSON.parse(stored) : this.adhanEnabled;
  }
}

// Export singleton
const nativeAdhanService = new NativeAdhanService();
export default nativeAdhanService;

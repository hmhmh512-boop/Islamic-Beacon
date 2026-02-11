/**
 * Offline System Manager
 * Handles offline mode, syncing, and permissions
 */

import offlineStorage from './offlineStorage';

interface OfflineStatus {
  isOnline: boolean;
  canSync: boolean;
  lastSyncTime: number;
  cacheSize: number;
  isCaching: boolean;
}

class OfflineSystemManager {
  private status: OfflineStatus = {
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
    canSync: false,
    lastSyncTime: 0,
    cacheSize: 0,
    isCaching: false,
  };

  private listeners: ((status: OfflineStatus) => void)[] = [];

  constructor() {
    this.initializeOfflineSystem();
  }

  /**
   * Initialize offline system
   */
  private initializeOfflineSystem(): void {
    if (typeof window === 'undefined') return;

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Request persistent storage
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        console.log(`[OfflineSystem] Persistent storage: ${persistent}`);
      });
    }

    // Get initial cache size
    this.updateCacheSize();

    console.log('[OfflineSystem] System initialized');
  }

  /**
   * Handle online event
   */
  private handleOnline(): void {
    this.status.isOnline = true;
    this.status.canSync = true;
    console.log('[OfflineSystem] Device is online');
    this.notifyListeners();
  }

  /**
   * Handle offline event
   */
  private handleOffline(): void {
    this.status.isOnline = false;
    this.status.canSync = false;
    console.log('[OfflineSystem] Device is offline');
    this.notifyListeners();
  }

  /**
   * Update cache size
   */
  async updateCacheSize(): Promise<void> {
    try {
      const info = await offlineStorage.getStorageInfo();
      this.status.cacheSize = info.usage;
      this.notifyListeners();
    } catch (error) {
      console.warn('[OfflineSystem] Could not get storage info:', error);
    }
  }

  /**
   * Pre-cache important data for offline use
   */
  async precacheOfflineAssets(): Promise<void> {
    try {
      this.status.isCaching = true;
      this.notifyListeners();

      console.log('[OfflineSystem] Starting offline asset caching...');

      // Cache Quran metadata
      const quranMetadata = {
        totalSurahs: 114,
        lastUpdated: new Date().toISOString(),
      };
      await offlineStorage.saveData('quran_metadata', quranMetadata);

      // Cache Azkar data (already in constants)
      const azkarMetadata = {
        categories: ['صباح', 'مساء', 'النوم', 'السفر', 'الشكر'],
        lastUpdated: new Date().toISOString(),
      };
      await offlineStorage.saveData('azkar_metadata', azkarMetadata);

      // Cache app settings
      const appSettings = {
        theme: localStorage.getItem('noor_theme_mode') || 'dark',
        language: 'ar',
        lastUpdated: new Date().toISOString(),
      };
      await offlineStorage.saveData('app_settings', appSettings);

      this.status.isCaching = false;
      this.status.lastSyncTime = Date.now();
      this.notifyListeners();

      console.log('[OfflineSystem] Offline assets cached successfully');
    } catch (error) {
      console.error('[OfflineSystem] Error caching offline assets:', error);
      this.status.isCaching = false;
      this.notifyListeners();
    }
  }

  /**
   * Clear offline cache (use with caution)
   */
  async clearOfflineCache(): Promise<void> {
    try {
      await offlineStorage.clearAll();
      console.log('[OfflineSystem] Offline cache cleared');
      this.notifyListeners();
    } catch (error) {
      console.error('[OfflineSystem] Error clearing cache:', error);
    }
  }

  /**
   * Request required permissions
   */
  async requestPermissions(): Promise<void> {
    try {
      // Request camera permission (for future video features)
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'camera' as any }).then((permission) => {
          console.log('[OfflineSystem] Camera permission:', permission.state);
        });
      }

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          console.log('[OfflineSystem] Notification permission:', permission);
        });
      }

      console.log('[OfflineSystem] Permissions requested');
    } catch (error) {
      console.warn('[OfflineSystem] Error requesting permissions:', error);
    }
  }

  /**
   * Get offline status
   */
  getStatus(): OfflineStatus {
    return { ...this.status };
  }

  /**
   * Subscribe to status changes
   */
  subscribe(listener: (status: OfflineStatus) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getStatus());
      } catch (error) {
        console.error('[OfflineSystem] Error in listener:', error);
      }
    });
  }

  /**
   * Check if running offline
   */
  isOffline(): boolean {
    return !this.status.isOnline;
  }

  /**
   * Check if running online
   */
  isOnline(): boolean {
    return this.status.isOnline;
  }
}

// Export singleton
const offlineSystemManager = new OfflineSystemManager();
export default offlineSystemManager;

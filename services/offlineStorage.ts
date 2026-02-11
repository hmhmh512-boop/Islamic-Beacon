/**
 * Local Storage System
 * Manages offline data storage using IndexedDB
 */

interface OfflineData {
  key: string;
  value: any;
  timestamp: number;
  type: 'audio' | 'json' | 'text' | 'binary';
}

class OfflineStorageManager {
  private dbName = 'NoorApp';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  /**
   * Initialize IndexedDB
   */
  private initDB(): void {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onerror = () => {
      console.error('IndexedDB Error:', request.error);
    };

    request.onsuccess = () => {
      this.db = request.result;
      console.log('[OfflineStorage] Database initialized');
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      
      // Create object stores
      if (!db.objectStoreNames.contains('audioCache')) {
        db.createObjectStore('audioCache', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('dataCache')) {
        db.createObjectStore('dataCache', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'key' });
      }

      console.log('[OfflineStorage] Database schema created');
    };
  }

  /**
   * Save audio file locally
   */
  async saveAudio(key: string, arrayBuffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['audioCache'], 'readwrite');
      const store = transaction.objectStore('audioCache');

      const data: OfflineData = {
        key,
        value: arrayBuffer,
        timestamp: Date.now(),
        type: 'binary',
      };

      const request = store.put(data);

      request.onsuccess = () => {
        console.log(`[OfflineStorage] Audio saved: ${key}`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to save audio: ${key}`));
      };
    });
  }

  /**
   * Get audio file from local storage
   */
  async getAudio(key: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['audioCache'], 'readonly');
      const store = transaction.objectStore('audioCache');
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`[OfflineStorage] Audio retrieved: ${key}`);
          resolve(request.result.value);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to get audio: ${key}`));
      };
    });
  }

  /**
   * Save JSON data
   */
  async saveData(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['dataCache'], 'readwrite');
      const store = transaction.objectStore('dataCache');

      const offlineData: OfflineData = {
        key,
        value: data,
        timestamp: Date.now(),
        type: 'json',
      };

      const request = store.put(offlineData);

      request.onsuccess = () => {
        console.log(`[OfflineStorage] Data saved: ${key}`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to save data: ${key}`));
      };
    });
  }

  /**
   * Get JSON data
   */
  async getData(key: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['dataCache'], 'readonly');
      const store = transaction.objectStore('dataCache');
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`[OfflineStorage] Data retrieved: ${key}`);
          resolve(request.result.value);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        reject(new Error(`Failed to get data: ${key}`));
      };
    });
  }

  /**
   * Save preference/setting
   */
  async setPreference(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['preferences'], 'readwrite');
      const store = transaction.objectStore('preferences');

      const request = store.put({ key, value, timestamp: Date.now() });

      request.onsuccess = () => {
        console.log(`[OfflineStorage] Preference saved: ${key}`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to save preference: ${key}`));
      };
    });
  }

  /**
   * Get preference/setting
   */
  async getPreference(key: string, defaultValue?: any): Promise<any> {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(defaultValue);
        return;
      }

      const transaction = this.db.transaction(['preferences'], 'readonly');
      const store = transaction.objectStore('preferences');
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`[OfflineStorage] Preference retrieved: ${key}`);
          resolve(request.result.value);
        } else {
          resolve(defaultValue);
        }
      };

      request.onerror = () => {
        resolve(defaultValue);
      };
    });
  }

  /**
   * Check if data exists
   */
  async hasData(key: string): Promise<boolean> {
    const data = await this.getData(key);
    return data !== null;
  }

  /**
   * Delete data
   */
  async deleteData(key: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['dataCache', 'audioCache'], 'readwrite');
      const dataStore = transaction.objectStore('dataCache');
      const audioStore = transaction.objectStore('audioCache');

      dataStore.delete(key);
      audioStore.delete(key);

      transaction.oncomplete = () => {
        console.log(`[OfflineStorage] Data deleted: ${key}`);
        resolve();
      };
    });
  }

  /**
   * Clear all data (use with caution)
   */
  async clearAll(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction(['dataCache', 'audioCache', 'preferences'], 'readwrite');
      
      transaction.objectStore('dataCache').clear();
      transaction.objectStore('audioCache').clear();
      transaction.objectStore('preferences').clear();

      transaction.oncomplete = () => {
        console.log('[OfflineStorage] All data cleared');
        resolve();
      };
    });
  }

  /**
   * Get storage size info
   */
  async getStorageInfo(): Promise<{ usage: number; quota: number }> {
    if (!navigator.storage || !navigator.storage.estimate) {
      return { usage: 0, quota: 0 };
    }

    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
    };
  }
}

// Export singleton instance
const offlineStorage = new OfflineStorageManager();
export default offlineStorage;

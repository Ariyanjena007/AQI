// IndexedDB offline cache manager for AQ Intelligence
const DB_NAME = 'AQIntelligenceDB';
const DB_VERSION = 1;

export interface OfflineReading {
  id?: number;
  deviceId: string;
  timestamp: string;
  data: Record<string, any>;
  synced: boolean;
}

export interface CachedDeviceRecord {
  id: string;
  lastSeen: string;
  cachedState: any;
}

class StorageDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('offlineReadings')) {
          const store = db.createObjectStore('offlineReadings', { keyPath: 'id', autoIncrement: true });
          store.createIndex('deviceId', 'deviceId', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains('cachedTelemetry')) {
          db.createObjectStore('cachedTelemetry', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('offlineJournal')) {
          db.createObjectStore('offlineJournal', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = () => {
        console.warn('IndexedDB failed to open, falling back to in-memory/localStorage');
        resolve();
      };
    });
  }

  async saveTelemetry(key: string, data: any): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction('cachedTelemetry', 'readwrite');
        const store = tx.objectStore('cachedTelemetry');
        store.put({ key, data, updatedAt: new Date().toISOString() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      } catch (e) {
        resolve();
      }
    });
  }

  async getTelemetry(key: string): Promise<any | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('cachedTelemetry', 'readonly');
        const store = tx.objectStore('cachedTelemetry');
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result ? req.result.data : null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async queueOfflineReading(reading: Omit<OfflineReading, 'id' | 'synced'>): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('offlineReadings', 'readwrite');
        const store = tx.objectStore('offlineReadings');
        store.add({ ...reading, synced: false });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  async getPendingCount(): Promise<number> {
    if (!this.db) await this.init();
    if (!this.db) return 0;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('offlineReadings', 'readonly');
        const store = tx.objectStore('offlineReadings');
        const index = store.index('synced');
        const req = index.count(IDBKeyRange.only(false));
        req.onsuccess = () => resolve(req.result || 0);
        req.onerror = () => resolve(0);
      } catch (e) {
        resolve(0);
      }
    });
  }

  async getPendingReadings(): Promise<OfflineReading[]> {
    if (!this.db) await this.init();
    if (!this.db) return [];

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('offlineReadings', 'readonly');
        const store = tx.objectStore('offlineReadings');
        const index = store.index('synced');
        const req = index.getAll(IDBKeyRange.only(false));
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  }

  async markAsSynced(ids: number[]): Promise<void> {
    if (!this.db) return;
    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction('offlineReadings', 'readwrite');
        const store = tx.objectStore('offlineReadings');
        for (const id of ids) {
          store.delete(id);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }
}

export const idbStorage = new StorageDB();

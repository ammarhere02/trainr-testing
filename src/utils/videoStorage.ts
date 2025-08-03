// Video storage utility using IndexedDB with ArrayBuffer for reliable blob storage
export interface StoredVideo {
  id: number;
  title: string;
  arrayBuffer: ArrayBuffer; // Store as ArrayBuffer instead of Blob
  mimeType: string; // Store MIME type separately
  duration: number;
  size: number;
  mode: string;
  date: string;
  thumbnail?: string;
}

// Generate thumbnail from video blob
export const generateVideoThumbnail = (videoBlob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    video.addEventListener('loadedmetadata', () => {
      canvas.width = Math.min(video.videoWidth, 320);
      canvas.height = Math.min(video.videoHeight, 240);
      
      const seekTime = Math.min(1, video.duration * 0.1);
      video.currentTime = seekTime;
    });

    video.addEventListener('seeked', () => {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        URL.revokeObjectURL(video.src);
        resolve(thumbnail);
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video for thumbnail generation'));
    });

    video.src = URL.createObjectURL(videoBlob);
    video.load();
  });
};

class VideoStorageManager {
  private dbName = 'TrainrVideoLibrary';
  private dbVersion = 3; // Increment to force upgrade
  private storeName = 'videos';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Delete old store if it exists
        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName);
        }
        
        // Create new store with ArrayBuffer support
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('title', 'title', { unique: false });
        console.log('IndexedDB store created/upgraded for ArrayBuffer storage');
      };
    });
  }

  async saveVideo(videoBlob: Blob, metadata: { id: number; title: string; duration: number; mode: string; thumbnail?: string }): Promise<void> {
    if (!this.db) await this.init();
    
    // Store blob directly as Uint8Array for better compatibility
    const arrayBuffer = await videoBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const videoData: StoredVideo = {
      id: metadata.id,
      title: metadata.title,
      arrayBuffer: uint8Array.buffer,
      mimeType: videoBlob.type,
      duration: metadata.duration,
      size: videoBlob.size,
      mode: metadata.mode,
      date: new Date().toISOString(),
      thumbnail: metadata.thumbnail
    };
    
    console.log('Saving video to IndexedDB:', videoData.id, videoData.title);
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(videoData);

      request.onerror = () => {
        console.error('Failed to save video:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log('Video saved successfully to IndexedDB');
        resolve();
      };
    });
  }

  async getVideo(id: number): Promise<{ blob: Blob; metadata: StoredVideo } | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onerror = () => {
        console.error('Failed to get video:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.arrayBuffer) {
          console.log('Retrieved video from IndexedDB:', {
            id: result.id,
            title: result.title,
            arrayBufferSize: result.arrayBuffer.byteLength,
            mimeType: result.mimeType
          });
          
          // Convert ArrayBuffer back to Blob
          const blob = new Blob([result.arrayBuffer], { type: result.mimeType });
          
          console.log('Converted ArrayBuffer to Blob:', {
            blobSize: blob.size,
            blobType: blob.type
          });
          
          resolve({
            blob: blob,
            metadata: result
          });
        } else {
          console.log('Video not found or has no data:', id);
          resolve(null);
        }
      };
    });
  }

  async getAllVideos(): Promise<StoredVideo[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => {
        console.error('Failed to get all videos:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const videos = request.result || [];
        console.log('Retrieved all videos from IndexedDB:', videos.length);
        resolve(videos);
      };
    });
  }

  async deleteVideo(id: number): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteMultipleVideos(ids: number[]): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      let completed = 0;
      const total = ids.length;
      
      if (total === 0) {
        resolve();
        return;
      }

      ids.forEach(id => {
        const request = store.delete(id);
        request.onsuccess = () => {
          completed++;
          if (completed === total) resolve();
        };
        request.onerror = () => reject(request.error);
      });
    });
  }

  // Test if a blob is valid and playable
  async testBlobPlayback(blob: Blob): Promise<boolean> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(blob);
      
      let resolved = false;
      
      video.addEventListener('loadedmetadata', () => {
        if (!resolved) {
          resolved = true;
          URL.revokeObjectURL(url);
          console.log('Blob test successful - duration:', video.duration);
          resolve(video.duration > 0);
        }
      });
      
      video.addEventListener('error', (e) => {
        if (!resolved) {
          resolved = true;
          URL.revokeObjectURL(url);
          console.error('Blob test failed:', e);
          resolve(false);
        }
      });
      
      video.src = url;
      video.load();
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          URL.revokeObjectURL(url);
          console.log('Blob test timed out');
          resolve(false);
        }
      }, 5000);
    });
  }

  async getVideoMetadata(): Promise<{ totalVideos: number; totalSize: number; totalDuration: number }> {
    const videos = await this.getAllVideos();
    return {
      totalVideos: videos.length,
      totalSize: videos.reduce((total, video) => total + video.size, 0),
      totalDuration: videos.reduce((total, video) => total + video.duration, 0)
    };
  }
}

// Singleton instance
export const videoStorage = new VideoStorageManager();
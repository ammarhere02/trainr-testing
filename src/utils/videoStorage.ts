// Video storage utility using IndexedDB for persistent video storage
export interface StoredVideo {
  id: number;
  title: string;
  blob: Blob;
  duration: number;
  size: number;
  type: string;
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
      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to 1 second or 10% of video duration, whichever is smaller
      const seekTime = Math.min(1, video.duration * 0.1);
      video.currentTime = seekTime;
    });

    video.addEventListener('seeked', () => {
      try {
        // Draw the current frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL (thumbnail)
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        
        // Clean up
        URL.revokeObjectURL(video.src);
        
        resolve(thumbnail);
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video for thumbnail generation'));
    });

    // Load the video
    video.src = URL.createObjectURL(videoBlob);
    video.load();
  });
};

class VideoStorageManager {
  private dbName = 'TrainrVideoLibrary';
  private dbVersion = 2; // Increment version to force upgrade
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
        
        // Create new store
        const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('title', 'title', { unique: false });
        console.log('IndexedDB store created/upgraded');
      };
    });
  }

  async saveVideo(video: StoredVideo): Promise<void> {
    if (!this.db) await this.init();
    
    // Validate video data before saving
    if (!video.blob || video.blob.size === 0) {
      throw new Error('Cannot save video: blob is empty or missing');
    }
    
    // Test blob validity before saving
    const isValid = await this.testBlobPlayback(video.blob);
    if (!isValid) {
      throw new Error('Cannot save video: blob data is corrupted or unplayable');
    }
    
    console.log('Saving video to IndexedDB:', {
      id: video.id,
      title: video.title,
      blobSize: video.blob.size,
      blobType: video.blob.type,
      duration: video.duration
    });
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      // Create a copy of the video object to ensure it's serializable
      const videoToStore = {
        id: video.id,
        title: video.title,
        blob: video.blob,
        duration: video.duration,
        size: video.size,
        type: video.type,
        mode: video.mode,
        date: video.date,
        thumbnail: video.thumbnail
      };
      
      const request = store.put(videoToStore);

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

  async getVideo(id: number): Promise<StoredVideo | null> {
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
        if (result) {
          console.log('Retrieved video from IndexedDB:', {
            id: result.id,
            title: result.title,
            blobSize: result.blob?.size,
            blobType: result.blob?.type,
            hasBlobData: !!(result.blob && result.blob.size > 0)
          });
        } else {
          console.log('Video not found in IndexedDB:', id);
        }
        resolve(result || null);
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
        videos.forEach((video, index) => {
          console.log(`Video ${index + 1}:`, {
            id: video.id,
            title: video.title,
            blobSize: video.blob?.size,
            blobType: video.blob?.type,
            hasBlobData: !!(video.blob && video.blob.size > 0)
          });
        });
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

  createVideoURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  revokeVideoURL(url: string): void {
    URL.revokeObjectURL(url);
  }

  async getVideoMetadata(): Promise<{ totalVideos: number; totalSize: number; totalDuration: number }> {
    const videos = await this.getAllVideos();
    return {
      totalVideos: videos.length,
      totalSize: videos.reduce((total, video) => total + video.size, 0),
      totalDuration: videos.reduce((total, video) => total + video.duration, 0)
    };
  }

  // Test if a blob is valid and playable
  async testBlobPlayback(blob: Blob): Promise<boolean> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(blob);
      
      video.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(url);
        resolve(true);
      });
      
      video.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve(false);
      });
      
      video.src = url;
      video.load();
      
      // Timeout after 5 seconds
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve(false);
      }, 5000);
    });
  }
}

// Singleton instance
export const videoStorage = new VideoStorageManager();
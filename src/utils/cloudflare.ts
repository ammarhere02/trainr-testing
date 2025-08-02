// Cloudflare Stream API integration
export interface CloudflareStreamConfig {
  accountId: string;
  apiToken: string;
}

export interface StreamVideo {
  uid: string;
  thumbnail: string;
  playback: {
    hls: string;
    dash: string;
  };
  preview: string;
  status: {
    state: string;
    pctComplete: string;
  };
  meta: {
    name: string;
    duration?: number;
  };
  created: string;
  size: number;
}

export class CloudflareStreamAPI {
  private accountId: string;
  private apiToken: string;
  private baseUrl: string;

  constructor(config: CloudflareStreamConfig) {
    this.accountId = config.accountId;
    this.apiToken = config.apiToken;
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/stream`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Cloudflare Stream API error: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  async uploadVideo(videoBlob: Blob, metadata: { name: string; description?: string }): Promise<StreamVideo> {
    const formData = new FormData();
    formData.append('file', videoBlob);
    
    // Add metadata
    const meta = {
      name: metadata.name,
      ...(metadata.description && { description: metadata.description })
    };
    formData.append('meta', JSON.stringify(meta));

    const result = await this.makeRequest('', {
      method: 'POST',
      body: formData,
    });

    return result.result;
  }

  async getVideo(videoId: string): Promise<StreamVideo> {
    const result = await this.makeRequest(`/${videoId}`);
    return result.result;
  }

  async deleteVideo(videoId: string): Promise<void> {
    await this.makeRequest(`/${videoId}`, {
      method: 'DELETE',
    });
  }

  async listVideos(limit: number = 50): Promise<StreamVideo[]> {
    const result = await this.makeRequest(`?limit=${limit}`);
    return result.result;
  }

  async updateVideoMetadata(videoId: string, metadata: { name?: string; description?: string }): Promise<StreamVideo> {
    const result = await this.makeRequest(`/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ meta: metadata }),
    });
    return result.result;
  }

  // Get embed URL for video player
  getEmbedUrl(videoId: string, options: { autoplay?: boolean; muted?: boolean; controls?: boolean } = {}): string {
    const params = new URLSearchParams();
    if (options.autoplay) params.set('autoplay', 'true');
    if (options.muted) params.set('muted', 'true');
    if (options.controls !== false) params.set('controls', 'true');
    
    const queryString = params.toString();
    const streamDomain = process.env.VITE_CLOUDFLARE_STREAM_DOMAIN || 'embed.cloudflarestream.com';
    return `https://${streamDomain}/${videoId}${queryString ? `?${queryString}` : ''}`;
  }

  // Get direct video URL for downloads
  getDirectUrl(videoId: string): string {
    const streamDomain = import.meta.env.VITE_CLOUDFLARE_STREAM_DOMAIN || 'videodelivery.net';
    return `https://${streamDomain.replace('customer-', 'videodelivery-')}/${videoId}/downloads/default.mp4`;
  }

  // Get thumbnail URL
  getThumbnailUrl(videoId: string, options: { time?: string; width?: number; height?: number } = {}): string {
    const params = new URLSearchParams();
    if (options.time) params.set('time', options.time);
    if (options.width) params.set('width', options.width.toString());
    if (options.height) params.set('height', options.height.toString());
    
    const queryString = params.toString();
    const streamDomain = import.meta.env.VITE_CLOUDFLARE_STREAM_DOMAIN || 'videodelivery.net';
    return `https://${streamDomain.replace('customer-', 'videodelivery-')}/${videoId}/thumbnails/thumbnail.jpg${queryString ? `?${queryString}` : ''}`;
  }
}

// Singleton instance
let streamAPI: CloudflareStreamAPI | null = null;

export const getStreamAPI = (): CloudflareStreamAPI => {
  if (!streamAPI) {
    // These would come from environment variables in production
    const config = {
      accountId: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || '',
      apiToken: import.meta.env.VITE_CLOUDFLARE_STREAM_TOKEN || ''
    };
    
    if (!config.accountId || !config.apiToken) {
      throw new Error('Cloudflare Stream credentials not configured');
    }
    
    streamAPI = new CloudflareStreamAPI(config);
  }
  
  return streamAPI;
};

// Helper function to check if Cloudflare Stream is configured
export const isStreamConfigured = (): boolean => {
  try {
    const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
    const apiToken = import.meta.env.VITE_CLOUDFLARE_STREAM_TOKEN;
    
    console.log('Checking Stream config:', {
      hasAccountId: !!accountId,
      hasApiToken: !!apiToken,
      accountIdLength: accountId?.length || 0
    });
    
    if (!accountId || !apiToken) {
      console.log('Missing Cloudflare Stream credentials');
      return false;
    }
    
    if (accountId.length < 10) {
      console.log('Invalid Cloudflare Stream credentials format');
      return false;
    }
    
    return true;
  } catch {
    console.log('Error checking Stream configuration');
    return false;
  }
};
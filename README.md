trainr

## Cloudflare Stream Setup

To enable professional video hosting with Cloudflare Stream:

1. **Get your Cloudflare credentials:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to "Stream" in the sidebar
   - Go to "API Tokens" tab
   - Copy your Account ID and create a Stream API token

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Cloudflare Account ID and Stream API token
   - Restart the development server

3. **Features enabled:**
   - ✅ Professional video hosting
   - ✅ Automatic MP4 conversion
   - ✅ Global CDN delivery
   - ✅ Adaptive streaming
   - ✅ Automatic thumbnails
   - ✅ Video analytics

## Environment Variables

```bash
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_STREAM_TOKEN=your_stream_api_token_here
```

## Video Storage Options

- **Without Cloudflare Stream**: Videos stored locally as WebM files
- **With Cloudflare Stream**: Videos uploaded to professional cloud hosting with automatic MP4 conversion

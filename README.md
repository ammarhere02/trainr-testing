trainr

## Supabase Setup

To enable user authentication and data storage:

1. **Create a Supabase project:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Wait for the project to be ready

2. **Get your Supabase credentials:**
   - In your project dashboard, go to Settings > API
   - Copy your Project URL and anon/public key

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key
   - Restart the development server

4. **Required environment variables:**
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

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
# Supabase (Required)
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Cloudflare Stream (Optional)
VITE_CLOUDFLARE_ACCOUNT_ID=your_account_id_here
VITE_CLOUDFLARE_STREAM_TOKEN=your_stream_api_token_here
```

## Video Storage Options

- **Without Cloudflare Stream**: Videos stored locally as WebM files
- **With Cloudflare Stream**: Videos uploaded to professional cloud hosting with automatic MP4 conversion

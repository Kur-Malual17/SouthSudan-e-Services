# Media Files Storage Issue on Render Free Tier

## The Problem

You're seeing "Image not found" errors when trying to view uploaded documents in the admin dashboard. This is happening because:

### Render Free Tier Uses Ephemeral Storage
- **Ephemeral** means temporary - files are deleted when:
  - The service restarts
  - You deploy new code
  - The service scales down due to inactivity
  - Render performs maintenance

- All uploaded files (photos, PDFs, payment proofs) are stored in the `/media/` folder on the server
- This folder is **NOT persistent** on Render's free tier
- Files uploaded by users will disappear after a restart

## Current Status

✅ **Fixed Issues:**
- Frontend now correctly uses `${BACKEND_URL}` for all media URLs
- Backend media serving is configured for production
- CORS headers are properly set for media files
- URL patterns are correct

❌ **Remaining Issue:**
- Files are being uploaded successfully
- But they disappear when Render restarts the service
- This is a **hosting limitation**, not a code issue

## Solutions

### Option 1: Use Cloud Storage (Recommended for Production)

Use a cloud storage service to store media files permanently:

#### A. AWS S3 (Most Popular)
```bash
pip install django-storages boto3
```

Add to `settings.py`:
```python
# AWS S3 Configuration
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='us-east-1')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_DEFAULT_ACL = 'public-read'
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}

# Storage backends
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

**Cost**: AWS S3 Free Tier includes 5GB storage for 12 months, then ~$0.023/GB/month

#### B. Cloudinary (Easier Setup)
```bash
pip install cloudinary django-cloudinary-storage
```

Add to `settings.py`:
```python
import cloudinary
import cloudinary.uploader
import cloudinary.api

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': config('CLOUDINARY_API_KEY'),
    'API_SECRET': config('CLOUDINARY_API_SECRET')
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

**Cost**: Free tier includes 25GB storage and 25GB bandwidth/month

#### C. Backblaze B2 (Most Affordable)
Similar to S3 but cheaper:
- 10GB free storage
- 1GB free download per day
- After that: $0.005/GB/month (5x cheaper than S3)

### Option 2: Upgrade Render Plan

Upgrade to Render's paid plan with persistent disk:

- **Starter Plan**: $7/month
  - Includes persistent disk (you can add storage)
  - No automatic restarts that wipe files
  - Better performance

To add persistent disk:
1. Go to your Render service dashboard
2. Click "Disks" tab
3. Add a new disk (e.g., 1GB = $0.25/month)
4. Mount it to `/opt/render/project/src/media`

### Option 3: Use Vercel Blob Storage

Since your frontend is on Vercel, you could use Vercel Blob:

```bash
npm install @vercel/blob
```

**Cost**: 
- Free tier: 500MB storage
- Pro: $0.15/GB/month

### Option 4: Temporary Workaround (Not Recommended)

For testing purposes only, you could:
1. Use a separate file hosting service (like Imgur API, ImgBB)
2. Upload files there and store only the URLs in your database
3. This is NOT recommended for production (security, reliability issues)

## Recommended Solution for Your Project

Given that this is a government immigration portal handling sensitive documents:

### Best Choice: AWS S3 or Cloudinary

**Why:**
- ✅ Secure and reliable
- ✅ Automatic backups
- ✅ Fast global CDN
- ✅ Scalable (handles millions of files)
- ✅ Industry standard for document storage
- ✅ GDPR/compliance friendly

**Implementation Steps:**

1. **Choose Cloudinary** (easier for beginners):
   - Sign up at https://cloudinary.com
   - Get your credentials (Cloud Name, API Key, API Secret)
   - Add to Render environment variables

2. **Install package**:
   ```bash
   pip install cloudinary django-cloudinary-storage
   ```

3. **Update `requirements.txt`**:
   ```
   cloudinary==1.36.0
   django-cloudinary-storage==0.3.0
   ```

4. **Update `settings.py`**:
   ```python
   INSTALLED_APPS = [
       # ... other apps
       'cloudinary_storage',
       'cloudinary',
   ]

   CLOUDINARY_STORAGE = {
       'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
       'API_KEY': config('CLOUDINARY_API_KEY'),
       'API_SECRET': config('CLOUDINARY_API_SECRET')
   }

   DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
   ```

5. **Add to Render environment variables**:
   - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `CLOUDINARY_API_KEY=your_api_key`
   - `CLOUDINARY_API_SECRET=your_api_secret`

6. **Redeploy** - all new uploads will go to Cloudinary automatically!

## Testing the Fix

After implementing cloud storage:

1. Upload a new application with documents
2. Restart your Render service (to simulate a crash)
3. Check if documents are still accessible
4. ✅ They should load correctly from cloud storage

## Current Workaround

Until you implement cloud storage, you can:

1. **Test locally** - files work fine on localhost
2. **Avoid restarting** Render service
3. **Document the issue** for users (temporary storage limitation)
4. **Prioritize implementing** cloud storage ASAP

## Need Help?

If you want me to implement Cloudinary storage for you, just say:
- "Set up Cloudinary for media files"
- "Implement AWS S3 storage"
- "Add Vercel Blob storage"

I'll handle all the configuration and code changes!

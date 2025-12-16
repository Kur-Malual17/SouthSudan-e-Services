# Fix Document Viewing Issue

## Problem
Modal opens but image doesn't load (shows broken image icon).

## Root Cause
Django is not serving media files correctly, or the file path is wrong.

## Quick Test

Open this URL in your browser:
```
http://localhost:8000/media/documents/photos/WhatsApp_Image_2025-12-07_at_12.30.16_NqG5uDe.jpeg
```

**If you see the image**: Django is working, issue is with modal
**If you see 404 or blank**: Django isn't serving media files

## Solution 1: Use "Open in New Tab" Button

I've added a new button in the modal:
- **🔗 Open in New Tab** - Opens image directly in browser
- **📥 Download Image** - Downloads the file

Click "🔗 Open in New Tab" instead of "Download Image"

## Solution 2: Restart Django Server

```bash
# Stop Django (Ctrl+C in the terminal where it's running)
cd backend
python manage.py runserver
```

Then try viewing documents again.

## Solution 3: Check Django is Running

Make sure Django server is running on port 8000:
```bash
# In backend folder
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
```

## Solution 4: Verify Media Files Exist

```bash
cd backend/media/documents
dir photos
dir signatures  
dir ids
```

Should show your uploaded files.

## Solution 5: Check Browser Console

1. Press F12 to open Developer Tools
2. Go to Console tab
3. Click on a document
4. Look for errors like:
   - "Failed to load resource: net::ERR_CONNECTION_REFUSED"
   - "404 Not Found"
   - "CORS error"

## Solution 6: Test Direct URL

Right-click on the photo thumbnail → "Open image in new tab"

If it opens: Modal issue
If it doesn't: Django not serving files

## Updated Features

I've added:
1. **"Open in New Tab" button** in modal - More reliable
2. **Error handling** - If image fails to load, automatically opens in new tab
3. **Fallback image** - Shows "Image not found" if thumbnail fails
4. **Two options per document**:
   - 🔍 View (in modal)
   - 🔗 Open (in new tab)

## How to View Documents Now

### Method 1: Modal (Recommended)
1. Click on document thumbnail
2. Modal opens
3. Click "🔗 Open in New Tab" button
4. Image opens in browser

### Method 2: Direct Link
1. Click "🔗 Open" link under thumbnail
2. Opens directly in new tab

### Method 3: For PDFs
1. Click "📄 View Document"
2. Opens in browser's PDF viewer

## Still Not Working?

### Check Django Settings

File: `backend/immigration_portal/settings.py`
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

File: `backend/immigration_portal/urls.py`
```python
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Check File Paths in Database

```bash
cd backend
python manage.py shell
```

```python
from applications.models import Application
app = Application.objects.first()
print(f"Photo: {app.photo}")
print(f"ID Copy: {app.id_copy}")
print(f"Signature: {app.signature}")
```

Should show paths like:
```
Photo: documents/photos/filename.jpeg
ID Copy: documents/ids/filename.pdf
Signature: documents/signatures/filename.jpeg
```

### Verify Files Exist

```bash
cd backend
ls -la media/documents/photos/
ls -la media/documents/ids/
ls -la media/documents/signatures/
```

## Summary

✅ **Modal now has "Open in New Tab" button** - Use this!
✅ **Auto-fallback** - If modal fails, opens in new tab automatically
✅ **Direct links** - Each document has "🔗 Open" link
✅ **Error handling** - Shows helpful messages if files don't load

**Recommended**: Use the "🔗 Open in New Tab" button in the modal or the "🔗 Open" link under each thumbnail.

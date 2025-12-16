# Testing Media File Access

## Issue
Images show as thumbnails but don't load in full-screen modal.

## Test URLs

Try opening these URLs directly in your browser:

1. **Test if Django is serving media files**:
   ```
   http://localhost:8000/media/documents/photos/WhatsApp_Image_2025-12-07_at_12.30.16_NqG5uDe.jpeg
   ```

2. **Test signature**:
   ```
   http://localhost:8000/media/documents/signatures/chol.jpeg
   ```

3. **Test ID copy**:
   ```
   http://localhost:8000/media/documents/ids/m.pdf
   ```

## Expected Results

✅ **If working**: You should see the image/PDF in your browser
❌ **If broken**: You'll see 404 error or blank page

## If URLs Don't Work

The issue is Django isn't serving media files properly. 

### Fix 1: Check Django Server is Running

Make sure Django is running on port 8000:
```bash
cd backend
python manage.py runserver
```

### Fix 2: Verify MEDIA Settings

Check `backend/immigration_portal/settings.py`:
```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

Check `backend/immigration_portal/urls.py`:
```python
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Fix 3: Check File Permissions

Files must be readable:
```bash
cd backend/media
ls -la documents/photos/
```

### Fix 4: Restart Django Server

Sometimes Django needs restart to pick up media files:
```bash
# Stop Django (Ctrl+C)
# Start again
cd backend
python manage.py runserver
```

## Quick Fix

If media files aren't accessible, the modal will show broken image.

**Temporary Solution**: 
Instead of modal, open images in new tab directly.

Let me know what you see when you open the test URLs above!

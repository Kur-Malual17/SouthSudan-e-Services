# Admin Dashboard - Content Management Troubleshooting

## Issue: News/Blog/Gallery Not Showing in Admin

If you don't see "News Articles", "Blog Posts", or "Gallery Images" in your Django admin sidebar, follow these steps:

## Step 1: Check Deployment Status

### Verify Render Deployment
1. Go to: https://dashboard.render.com/
2. Find your service: `southsudan-e-services`
3. Check the deployment status:
   - ✅ **Green "Live"** = Deployment complete
   - 🟡 **Yellow "Building"** = Still deploying (wait 2-5 minutes)
   - 🔴 **Red "Failed"** = Deployment failed (check logs)

### Check Deployment Logs
1. Click on your service in Render dashboard
2. Click "Logs" tab
3. Look for these lines:
   ```
   Running migrations:
     Applying applications.0004_newsarticle_galleryimage_blogpost... OK
   ```

If you see this, migrations ran successfully! ✅

## Step 2: Check if Models Are Registered

Open this URL in your browser:
```
https://southsudan-e-services.onrender.com/api/check-models/
```

You should see:
```json
{
  "success": true,
  "models_registered": {
    "NewsArticle": true,
    "BlogPost": true,
    "GalleryImage": true
  },
  "content_counts": {
    "news": 0,
    "blog": 0,
    "gallery": 0
  }
}
```

### If Models Are NOT Registered (all false):
- Deployment hasn't completed yet
- Wait 2-5 minutes and check again
- Refresh the `/api/check-models/` page

### If Models ARE Registered (all true):
- Models exist in database ✅
- Continue to Step 3

## Step 3: Access Django Admin

1. Go to: https://southsudan-e-services.onrender.com/admin/
2. Login with:
   - Username: `admin`
   - Password: `admin123`

3. Look for these sections in the sidebar:
   ```
   APPLICATIONS
   ├── Applications
   ├── User profiles
   ├── News Articles      ← Should be here
   ├── Blog Posts         ← Should be here
   └── Gallery Images     ← Should be here
   ```

## Step 4: If Still Not Showing

### Option A: Manual Render Restart (Recommended)

1. Go to Render Dashboard: https://dashboard.render.com/
2. Click on your service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait 2-5 minutes for deployment
5. Check admin again

### Option B: Trigger Redeploy from GitHub

1. Make a small change to any file (add a comment)
2. Commit and push to GitHub
3. Render will auto-deploy
4. Wait 2-5 minutes
5. Check admin again

### Option C: Check Admin Registration

The models should be registered in `backend/applications/admin.py`. Let me verify:

```python
# These should be in admin.py:
@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    ...

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    ...

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    ...
```

If these are missing, the models won't show in admin.

## Step 5: Clear Browser Cache

Sometimes the admin interface is cached:

1. **Chrome/Edge**: Press `Ctrl + Shift + Delete`
2. **Firefox**: Press `Ctrl + Shift + Delete`
3. **Safari**: Press `Cmd + Option + E`
4. Select "Cached images and files"
5. Click "Clear data"
6. Reload admin page

## Step 6: Verify Database Tables

If you have database access, check if tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'applications_%';
```

You should see:
- `applications_newsarticle`
- `applications_blogpost`
- `applications_galleryimage`

## Common Issues & Solutions

### Issue 1: "No module named 'applications.models'"
**Solution**: Deployment failed. Check Render logs for errors.

### Issue 2: Models show in API but not in Admin
**Solution**: 
1. Check `admin.py` has `@admin.register()` decorators
2. Restart Render service
3. Clear browser cache

### Issue 3: "Table doesn't exist" error
**Solution**: Migrations didn't run. 
1. Check `build.sh` includes `python manage.py migrate`
2. Redeploy on Render

### Issue 4: Admin shows but can't add content
**Solution**: Check user permissions
1. Make sure you're logged in as admin (not officer/supervisor)
2. Admin user should have `is_superuser=True`

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Render deployment shows "Live" (green)
- [ ] `/api/check-models/` shows all models as `true`
- [ ] Logged into admin as superuser (admin/admin123)
- [ ] Browser cache cleared
- [ ] Tried manual Render restart

If all checked ✅ and still not showing, there may be a code issue.

## Testing Locally (If You Have Access)

If you can run the project locally:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Then visit: http://localhost:8000/admin/

If models show locally but not on Render, it's a deployment issue.

## What Should You See in Admin?

Once working, your admin sidebar should look like this:

```
┌─────────────────────────────────┐
│ DJANGO ADMINISTRATION           │
├─────────────────────────────────┤
│ APPLICATIONS                    │
│  • Applications                 │
│  • User profiles                │
│  • News Articles        [+Add]  │ ← NEW
│  • Blog Posts           [+Add]  │ ← NEW
│  • Gallery Images       [+Add]  │ ← NEW
├─────────────────────────────────┤
│ AUTHENTICATION AND AUTHORIZATION│
│  • Groups                       │
│  • Users                        │
└─────────────────────────────────┘
```

## Next Steps After Models Appear

1. **Create Sample Content**:
   - Visit: https://southsudan-e-services.onrender.com/api/setup-content/
   - This creates 3 news articles and 3 blog posts automatically

2. **Add Your Own Content**:
   - Click "News Articles" → "Add News Article"
   - Fill in the form
   - Check "Published" and "Featured"
   - Click "Save"

3. **View on Website**:
   - Go to: https://south-sudan-e-services.vercel.app/
   - Scroll down to see "News & Updates" section

## Still Having Issues?

If you've tried everything and models still don't show:

1. **Check Render Logs** for error messages
2. **Verify migrations file exists**: `backend/applications/migrations/0004_newsarticle_galleryimage_blogpost.py`
3. **Check if file was pushed to GitHub**: Look in your repository
4. **Contact Support**: Share the output from `/api/check-models/`

## Quick Links

- **Admin Panel**: https://southsudan-e-services.onrender.com/admin/
- **Check Models**: https://southsudan-e-services.onrender.com/api/check-models/
- **Setup Content**: https://southsudan-e-services.onrender.com/api/setup-content/
- **Render Dashboard**: https://dashboard.render.com/
- **GitHub Repo**: https://github.com/Kur-Malual17/SouthSudan-e-Services

---

**Most Common Solution**: Wait 2-5 minutes for Render deployment to complete, then refresh the admin page. The models will appear automatically once deployment finishes! 🎉

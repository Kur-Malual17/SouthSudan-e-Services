# Cloudinary Setup Guide - Fix Image Storage

## Why You Need This

Render's free tier uses **ephemeral storage** - uploaded images disappear when the service restarts. Cloudinary provides permanent cloud storage for your images.

## ✅ Benefits

- 📸 Images never disappear
- 🚀 Fast global CDN
- 🆓 Free tier: 25GB storage + 25GB bandwidth/month
- 🔒 Secure and reliable
- ⚡ Automatic image optimization

## 🚀 Setup Steps (5 Minutes)

### Step 1: Create Cloudinary Account

1. Go to: https://cloudinary.com/users/register/free
2. Fill in the form:
   - Email
   - Password
   - Choose "Developer" as your role
3. Click "Create Account"
4. Verify your email

### Step 2: Get Your Credentials

After login, you'll see your dashboard. Copy these three values:

```
Cloud Name: dxxxxx (example)
API Key: 123456789012345 (example)
API Secret: abcdefghijklmnopqrstuvwxyz (example)
```

**Where to find them:**
- Dashboard → Account Details (top right)
- Or go to: https://cloudinary.com/console

### Step 3: Add to Render Environment Variables

1. Go to: https://dashboard.render.com/
2. Click on your service: `southsudan-e-services`
3. Click **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"**
5. Add these three variables:

   **Variable 1:**
   ```
   Key: CLOUDINARY_CLOUD_NAME
   Value: [paste your Cloud Name]
   ```

   **Variable 2:**
   ```
   Key: CLOUDINARY_API_KEY
   Value: [paste your API Key]
   ```

   **Variable 3:**
   ```
   Key: CLOUDINARY_API_SECRET
   Value: [paste your API Secret]
   ```

6. Click **"Save Changes"**

### Step 4: Deploy Updated Code

The code is already updated and ready. Just push to GitHub:

```bash
# Already done - code is committed
# Render will auto-deploy when you add environment variables
```

### Step 5: Wait for Deployment

1. After adding environment variables, Render will automatically redeploy
2. Wait 2-3 minutes for deployment to complete
3. Check deployment status in Render dashboard

### Step 6: Re-upload Your Images

**Important:** Existing images in local storage won't transfer automatically. You need to:

1. Go to: https://southsudan-e-services.onrender.com/admin/
2. Edit your blog posts and gallery images
3. Re-upload the images
4. Click "Save"

**New images will now be stored in Cloudinary permanently!** ✅

## 🧪 Testing

### Test 1: Upload an Image
1. Add a new blog post with an image
2. Save it
3. View on website - image should load

### Test 2: Restart Service
1. Go to Render dashboard
2. Click "Manual Deploy" → "Clear build cache & deploy"
3. Wait for deployment
4. Check website - images should still be there! ✅

### Test 3: Check Cloudinary Dashboard
1. Go to: https://cloudinary.com/console/media_library
2. You should see your uploaded images
3. Click on an image to see details

## 📊 What You'll See

### Before Cloudinary:
```
Image URL: https://southsudan-e-services.onrender.com/media/blog/image.jpg
Status: ❌ Disappears after restart
```

### After Cloudinary:
```
Image URL: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/blog/image.jpg
Status: ✅ Permanent, never disappears
```

## 🔧 Troubleshooting

### Images Still Not Loading?

**Check 1: Environment Variables Set?**
- Go to Render → Environment tab
- Verify all 3 variables are there
- Make sure there are no extra spaces

**Check 2: Deployment Complete?**
- Check Render logs for "Live" status
- Look for: `cloudinary` in the pip install logs

**Check 3: Re-uploaded Images?**
- Old images won't transfer automatically
- You must re-upload them through admin

**Check 4: Cloudinary Credentials Correct?**
- Go to Cloudinary dashboard
- Copy credentials again
- Update in Render if needed

### Error: "cloudinary module not found"

**Solution:** Deployment hasn't completed yet. Wait 2-3 minutes.

### Error: "Invalid Cloudinary credentials"

**Solution:** 
1. Double-check credentials in Cloudinary dashboard
2. Make sure you copied them correctly (no extra spaces)
3. Update in Render environment variables

## 💰 Cloudinary Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

**This is more than enough for your immigration portal!**

If you exceed limits:
- Paid plan starts at $89/month
- But you'd need thousands of images to hit the limit

## 🎯 Alternative: AWS S3

If you prefer AWS S3 instead:

1. Create AWS account
2. Create S3 bucket
3. Get Access Key and Secret Key
4. Use `django-storages` with S3 backend

See `MEDIA_FILES_STORAGE_ISSUE.md` for AWS S3 setup instructions.

## ✅ Verification Checklist

After setup, verify:

- [ ] Cloudinary account created
- [ ] 3 environment variables added to Render
- [ ] Render deployment completed successfully
- [ ] Re-uploaded images through admin
- [ ] Images visible on website
- [ ] Images still there after Render restart
- [ ] Images visible in Cloudinary dashboard

## 📚 Additional Resources

- **Cloudinary Docs**: https://cloudinary.com/documentation/django_integration
- **Django Cloudinary Storage**: https://github.com/klis87/django-cloudinary-storage
- **Render Environment Variables**: https://render.com/docs/environment-variables

## 🆘 Need Help?

If you're stuck:
1. Check Render deployment logs
2. Check browser console for errors
3. Verify Cloudinary credentials
4. Try re-uploading images

---

**Once set up, you'll never lose images again!** 🎉

# Deployment Guide - South Sudan e-Services

## Current Status
- ✅ **Frontend**: Deployed on Vercel at https://south-sudan-e-services-8546902ip-kur-malual17s-projects.vercel.app
- ✅ **Backend**: Deployed on Render at https://southsudan-e-services.onrender.com

## Problem
Your frontend on Vercel is trying to connect to `http://localhost:8000/api/` which doesn't exist in production. You need to deploy the backend.

## Solution: Deploy Backend to Render (Recommended)

### Why Render?
- Free tier available
- Easy Django deployment
- PostgreSQL database included
- Automatic HTTPS
- Good for production

### Step-by-Step Deployment

#### 1. Prepare Your Repository
Make sure these files are committed:
- ✅ `backend/requirements.txt` (updated with gunicorn and whitenoise)
- ✅ `backend/Procfile` (created)
- ✅ `backend/runtime.txt` (created)

#### 2. Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repository

#### 3. Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `immigration-db`
3. Select Free tier
4. Click "Create Database"
5. **Save these credentials** (you'll need them):
   - Internal Database URL
   - External Database URL
   - Database name
   - Username
   - Password

#### 4. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `southsudan-immigration-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn immigration_portal.wsgi:application`
   - **Instance Type**: Free

#### 5. Add Environment Variables
Click "Environment" and add these variables:

```
SECRET_KEY=your-secret-key-here-change-this-in-production-make-it-long-and-random
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com
DATABASE_URL=<paste-internal-database-url-from-step-3>

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=k.malual@alustudent.com
EMAIL_HOST_PASSWORD=wfmg qnyz bzxb yice
DEFAULT_FROM_EMAIL=k.malual@alustudent.com

# Paystack
PAYSTACK_SECRET_KEY=sk_test_811f060a864e6eb0dc1aa08a5219eabd4d7e1240
PAYSTACK_PUBLIC_KEY=pk_test_6e9074c0882d74a78d93d9a72a17878430acf513
```

#### 6. Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend will be at: `https://southsudan-immigration-api.onrender.com`

#### 7. Create Superuser
After deployment, go to Render dashboard:
1. Click on your service
2. Go to "Shell" tab
3. Run: `python manage.py createsuperuser`
4. Follow prompts to create admin account

#### 8. Update Frontend to Use Production Backend
Update your Vercel environment variables:

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   ```
   VITE_API_URL=https://southsudan-immigration-api.onrender.com
   ```

5. Redeploy frontend

#### 9. Update API Base URL in Frontend
In `client/src/lib/api.ts`, update:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // ... rest of config
});
```

## Alternative: Deploy to Railway

### Quick Railway Deployment
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects Django
6. Add environment variables (same as above)
7. Deploy!

Railway will give you a URL like: `https://southsudan-immigration.up.railway.app`

## Alternative: Deploy to Heroku

### Heroku Deployment
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create southsudan-immigration-api`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
5. Set environment variables: `heroku config:set KEY=VALUE`
6. Deploy: `git push heroku main`

## Update CORS Settings

After deploying backend, update `backend/immigration_portal/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://south-sudan-e-services-g4dulgluv-kur-malual17s-projects.vercel.app',
    'http://localhost:5173',  # Keep for local development
]

CSRF_TRUSTED_ORIGINS = [
    'https://south-sudan-e-services-g4dulgluv-kur-malual17s-projects.vercel.app',
    'https://southsudan-immigration-api.onrender.com',  # Your backend URL
]
```

## Testing After Deployment

1. Visit your backend URL: `https://southsudan-immigration-api.onrender.com/admin`
2. You should see Django admin login
3. Visit your frontend: `https://south-sudan-e-services-g4dulgluv-kur-malual17s-projects.vercel.app`
4. Try to register/login
5. Should work!

## Common Issues

### Issue: "CORS Error"
**Solution**: Add your Vercel URL to CORS_ALLOWED_ORIGINS in settings.py

### Issue: "Database connection failed"
**Solution**: Check DATABASE_URL environment variable is set correctly

### Issue: "Static files not loading"
**Solution**: Run `python manage.py collectstatic` in Render shell

### Issue: "502 Bad Gateway"
**Solution**: Check Render logs for errors. Usually missing environment variables.

## Cost Breakdown

### Free Tier (Good for testing)
- **Render**: Free PostgreSQL (90 days), Free web service (sleeps after 15 min inactivity)
- **Vercel**: Free frontend hosting
- **Total**: $0/month

### Paid Tier (Recommended for production)
- **Render**: $7/month (PostgreSQL) + $7/month (Web service)
- **Vercel**: Free (or $20/month for Pro)
- **Total**: $14-34/month

## Next Steps

1. ✅ Commit the new files (Procfile, runtime.txt, updated requirements.txt)
2. ✅ Push to GitHub
3. ⏳ Deploy backend to Render
4. ⏳ Update frontend environment variables
5. ⏳ Test the application
6. ⏳ Create superuser account
7. ⏳ Start using in production!

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
3. Test API directly: `curl https://your-backend-url.onrender.com/api/csrf/`

Good luck with your deployment! 🚀

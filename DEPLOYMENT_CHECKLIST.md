# Deployment Checklist - Forgot Password & Arabic Language

## ✅ Files Created/Modified

### Frontend Files
- ✅ `client/src/pages/ForgotPassword.tsx` - Forgot password page
- ✅ `client/src/pages/ResetPassword.tsx` - Reset password page
- ✅ `client/src/i18n/translations.ts` - English/Arabic translations
- ✅ `client/src/store/languageStore.ts` - Language state management
- ✅ `client/src/hooks/useTranslation.ts` - Translation hook
- ✅ `client/src/pages/Login.tsx` - Added forgot password link + translations
- ✅ `client/src/components/Layout.tsx` - Added language switcher
- ✅ `client/src/pages/Home.tsx` - Added translations
- ✅ `client/src/App.tsx` - Added forgot/reset password routes

### Backend Files
- ✅ `backend/applications/views.py` - Added password reset endpoints
- ✅ `backend/applications/urls.py` - Added password reset URLs
- ✅ `backend/.env` - Updated email configuration
- ✅ `backend/test_email.py` - Email testing script

## 🔍 Verification Steps

### 1. Check if Files are Committed
```bash
git status
# Should show: "nothing to commit, working tree clean"

git log --oneline -1
# Should show your latest commit
```

### 2. Verify Files Exist in Repository
```bash
# Check frontend files
ls client/src/pages/ForgotPassword.tsx
ls client/src/pages/ResetPassword.tsx
ls client/src/i18n/translations.ts
ls client/src/store/languageStore.ts
ls client/src/hooks/useTranslation.ts

# Check backend files
ls backend/test_email.py
```

### 3. Push to GitHub (if not already pushed)
```bash
git add .
git commit -m "Add forgot password and Arabic language support"
git push origin main
```

## 🚀 Deployment Status

### Vercel (Frontend)
- **Auto-deploys** when you push to GitHub
- Check deployment status: https://vercel.com/dashboard
- Your site: https://south-sudan-e-services.vercel.app

**To verify deployment:**
1. Go to Vercel dashboard
2. Check latest deployment status
3. Look for "Building" or "Ready"
4. Click on deployment to see build logs

### Render (Backend)
- **Auto-deploys** when you push to GitHub
- Check deployment status: https://dashboard.render.com
- Your backend API

**To verify deployment:**
1. Go to Render dashboard
2. Check your service status
3. Look for "Live" status
4. Check logs for any errors

## 🐛 Troubleshooting "Failed to send reset email"

### Issue: Email Not Sending

**Possible Causes:**

1. **Email Not in Database**
   - The email `kur.malual@ashesi.edu.gh` must be registered first
   - Go to your site and register with this email
   - Then try forgot password

2. **Gmail App Password Issue**
   - Current password in `.env`: `wfmg qnyz bzxb yice`
   - This might be expired or incorrect
   - Generate new App Password:
     1. Go to https://myaccount.google.com/apppasswords
     2. Create new password for "Mail"
     3. Update `EMAIL_HOST_PASSWORD` in Render environment variables

3. **Environment Variables Not Set in Render**
   - Go to Render Dashboard → Your Service → Environment
   - Verify these are set:
     ```
     EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USE_TLS=True
     EMAIL_HOST_USER=k.malual@alustudent.com
     EMAIL_HOST_PASSWORD=wfmg qnyz bzxb yice
     DEFAULT_FROM_EMAIL=k.malual@alustudent.com
     FRONTEND_URL=https://south-sudan-e-services.vercel.app
     ```

4. **Backend Not Redeployed**
   - Check Render dashboard
   - Look for latest deployment
   - If old, manually trigger redeploy

### Check Backend Logs in Render

1. Go to Render Dashboard
2. Click on your backend service
3. Click "Logs" tab
4. Try forgot password on your site
5. Watch logs for error messages like:
   ```
   Attempting to send password reset email to: kur.malual@ashesi.edu.gh
   Using EMAIL_HOST_USER: k.malual@alustudent.com
   Error sending password reset email...
   ```

## 🌐 Testing Arabic Language

### On Production Site

1. Go to https://south-sudan-e-services.vercel.app
2. Look for language switcher in navigation bar (globe icon 🌐)
3. Click it - should show "العربية" or "English"
4. Click to switch language
5. Verify:
   - All text translates
   - Layout switches to RTL for Arabic
   - Navigation menu translates
   - Login page translates
   - Footer translates

### If Language Switcher Not Showing

**Possible Issues:**

1. **Frontend Not Redeployed**
   - Check Vercel dashboard
   - Look for latest deployment
   - Should show recent timestamp

2. **Build Failed**
   - Check Vercel deployment logs
   - Look for TypeScript errors
   - Look for missing imports

3. **Browser Cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or open in incognito/private window

## 📝 Quick Test Commands

### Test Email Locally (if running locally)
```bash
cd backend
python test_email.py
# Enter: kur.malual@ashesi.edu.gh
```

### Check if Email Exists in Database
```bash
cd backend
python manage.py shell
```
```python
from django.contrib.auth.models import User
User.objects.filter(email='kur.malual@ashesi.edu.gh').exists()
# Should return True
```

### Manual Password Reset (Workaround)
```bash
cd backend
python manage.py changepassword kur.malual@ashesi.edu.gh
```

## ✅ Expected Behavior

### Forgot Password Flow
1. User goes to `/login`
2. Clicks "Forgot Password?" link
3. Enters email: `kur.malual@ashesi.edu.gh`
4. Clicks "Send Reset Link"
5. Sees success message
6. Receives email with reset link
7. Clicks link → redirected to `/reset-password?token=...`
8. Enters new password
9. Clicks "Reset Password"
10. Redirected to login
11. Logs in with new password

### Language Switcher Flow
1. User visits site
2. Sees globe icon (🌐) in navigation
3. Clicks it
4. Language switches English ↔ Arabic
5. All text translates
6. Layout adjusts for RTL (Arabic)
7. Preference saved in browser

## 🔧 Force Redeploy

### Vercel (Frontend)
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Deployments" tab
4. Click "..." on latest deployment
5. Click "Redeploy"

### Render (Backend)
1. Go to https://dashboard.render.com
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"

## 📞 Support

If issues persist:
1. Check Vercel deployment logs
2. Check Render service logs
3. Verify environment variables in Render
4. Test email configuration
5. Verify email exists in database

---

## Current Status

- ✅ All files created
- ✅ Code committed to Git
- ⏳ Waiting for deployment
- ⏳ Need to verify on production

**Next Steps:**
1. Push to GitHub (if not done)
2. Wait for Vercel/Render to deploy
3. Test on production site
4. Check logs if issues occur

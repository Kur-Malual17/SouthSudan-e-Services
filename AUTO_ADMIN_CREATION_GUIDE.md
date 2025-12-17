# Automatic Admin Creation on Render (Free Tier)

## Problem
Render's free tier doesn't provide shell access, so you can't manually create superusers using `python manage.py createsuperuser`.

## Solution
We've set up **automatic admin creation** that runs every time your app deploys!

---

## How It Works

### 1. Management Command Created
**File:** `backend/applications/management/commands/create_default_admin.py`

This Django management command creates 3 default staff users:
- Admin (superuser)
- Supervisor
- Officer

### 2. Build Script Updated
**File:** `backend/build.sh`

Added this line at the end:
```bash
python manage.py create_default_admin
```

This runs automatically during deployment on Render.

### 3. What Happens on Deploy

When you push to GitHub:
1. Render detects the push
2. Runs `build.sh`
3. Installs dependencies
4. Runs migrations
5. **Creates/updates default admin users** ✨
6. Starts the server

---

## Default Credentials

After deployment, these users are automatically created:

### ADMIN (Superuser)
- **Email:** `admin@immigration.gov.ss`
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Admin (full access)
- **Can access:** Admin Dashboard, Django Admin

### SUPERVISOR
- **Email:** `supervisor@immigration.gov.ss`
- **Username:** `supervisor`
- **Password:** `super123`
- **Role:** Supervisor
- **Can access:** Admin Dashboard

### OFFICER
- **Email:** `officer1@immigration.gov.ss`
- **Username:** `officer1`
- **Password:** `officer123`
- **Role:** Officer
- **Can access:** Admin Dashboard

---

## How to Login

### Option 1: Your Website
1. Go to: https://south-sudan-e-services.vercel.app/login
2. Enter email: `admin@immigration.gov.ss`
3. Enter password: `admin123`
4. Click "Login"
5. You'll see "Admin Dashboard" link in navigation

### Option 2: Django Admin
1. Go to: `https://your-backend-url.onrender.com/admin`
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click "Log in"

---

## After First Login

### ⚠️ IMPORTANT: Change Default Passwords!

#### Method 1: Via Your Website
1. Login as admin
2. Go to Admin Dashboard
3. Click on your profile
4. Change password

#### Method 2: Via Django Admin
1. Login to Django Admin
2. Click "Users"
3. Click on "admin"
4. Scroll to "Password" section
5. Click "this form" link
6. Enter new password twice
7. Save

---

## Verify It's Working

### Check Render Logs

1. Go to Render Dashboard
2. Click on your backend service
3. Click "Logs" tab
4. Look for these messages after deployment:

```
Creating default admin users...
✓ Created ADMIN user
  Email: admin@immigration.gov.ss
  Username: admin
  Password: admin123

✓ Created SUPERVISOR user
  Email: supervisor@immigration.gov.ss
  Username: supervisor
  Password: super123

✓ Created OFFICER user
  Email: officer1@immigration.gov.ss
  Username: officer1
  Password: officer123

============================================================
Staff users created/updated successfully!
============================================================

⚠️  IMPORTANT: Change these default passwords immediately!

Login at: https://south-sudan-e-services.vercel.app/login
```

---

## Troubleshooting

### "Users not created"

**Check Render logs for errors:**
1. Render Dashboard → Your Service → Logs
2. Look for error messages during build

**Common issues:**
- Database connection error
- Migration not run
- UserProfile model issue

**Solution:**
- Check environment variables (DB_NAME, DB_USER, etc.)
- Ensure migrations ran successfully
- Redeploy the service

### "Can't login with credentials"

**Possible reasons:**
1. Users not created yet (check logs)
2. Wrong email/password
3. Database not connected

**Try:**
- Check Render logs
- Wait for deployment to complete
- Try both email and username
- Check if backend is running

### "Admin Dashboard not showing"

**Check:**
1. Are you logged in?
2. Is your role set to 'admin', 'supervisor', or 'officer'?
3. Check browser console for errors

---

## Manual Creation (If Needed)

If automatic creation fails, you can still create users manually:

### Option 1: Run Command Manually
If you get shell access later:
```bash
python manage.py create_default_admin
```

### Option 2: Use Python Script
Run locally and connect to production database:
```bash
python create_staff_simple.py
```

### Option 3: Create via API
Register a new user, then update their role in the database.

---

## Security Best Practices

### 1. Change Default Passwords Immediately
The default passwords are publicly visible in your code. Change them ASAP!

### 2. Use Strong Passwords
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't use common words

### 3. Create Individual Accounts
Don't share the admin account. Create separate accounts for each staff member.

### 4. Disable Unused Accounts
If someone leaves, disable their account immediately.

### 5. Regular Audits
Regularly review who has admin access.

---

## Adding More Staff Users

### Via Django Admin
1. Login to Django Admin
2. Click "Users" → "Add User"
3. Enter username and password
4. Click "Save and continue editing"
5. Fill in email, first name, last name
6. Check "Staff status"
7. Save
8. Go to "User profiles"
9. Find the user's profile
10. Set role to 'admin', 'supervisor', or 'officer'
11. Save

### Via Management Command
Create a new management command similar to `create_default_admin.py`

---

## How to Update Default Credentials

If you want to change the default credentials:

1. **Edit the management command:**
   `backend/applications/management/commands/create_default_admin.py`

2. **Change the values:**
   ```python
   admin, created = User.objects.get_or_create(
       username='your_new_username',  # Change this
       defaults={
           'email': 'your_new_email@example.com',  # Change this
           'first_name': 'Your',
           'last_name': 'Name',
           'is_staff': True,
           'is_superuser': True,
       }
   )
   
   if created:
       admin.set_password('your_new_password')  # Change this
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update default admin credentials"
   git push origin main
   ```

4. **Render will redeploy** and create users with new credentials

---

## Summary

✅ **Automatic admin creation** is now set up!

✅ **Every deployment** creates/updates default staff users

✅ **No shell access needed** - everything happens automatically

✅ **Login immediately** after deployment with default credentials

⚠️ **Remember to change passwords** after first login!

---

## Quick Reference

| User | Email | Username | Password | Role |
|------|-------|----------|----------|------|
| Admin | admin@immigration.gov.ss | admin | admin123 | admin |
| Supervisor | supervisor@immigration.gov.ss | supervisor | super123 | supervisor |
| Officer | officer1@immigration.gov.ss | officer1 | officer123 | officer |

**Login URL:** https://south-sudan-e-services.vercel.app/login

**Django Admin:** https://your-backend-url.onrender.com/admin

---

## Need Help?

1. Check Render deployment logs
2. Verify environment variables
3. Check database connection
4. Review STAFF_LOGIN_GUIDE.md
5. Contact support

# Create Superuser on Render - Quick Guide

## Your Backend URL
Find your backend URL in Render Dashboard → Your Service → Settings

Example: `https://your-app-name.onrender.com`

---

## Method 1: Using Render Shell (Recommended)

### Steps:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click on your backend service

2. **Open Shell Tab**
   - Click "Shell" in the top navigation
   - Wait for terminal to load

3. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

4. **Enter Details:**
   ```
   Username: admin
   Email address: admin@immigration.gov.ss
   Password: [your-secure-password]
   Password (again): [confirm-password]
   ```

5. **Success!**
   ```
   Superuser created successfully.
   ```

---

## Method 2: Using Your Existing Script

### Steps:

1. **Open Render Shell** (same as above)

2. **Run the script:**
   ```bash
   python create_staff_simple.py
   ```

3. **This creates 3 users:**

   **ADMIN (Superuser):**
   - Email: `admin@immigration.gov.ss`
   - Username: `admin`
   - Password: `admin123`
   - Role: Admin (full access)

   **SUPERVISOR:**
   - Email: `supervisor@immigration.gov.ss`
   - Username: `supervisor`
   - Password: `super123`
   - Role: Supervisor

   **OFFICER:**
   - Email: `officer1@immigration.gov.ss`
   - Username: `officer1`
   - Password: `officer123`
   - Role: Officer

---

## Where to Login

### Your Production Site:
- **Frontend:** https://south-sudan-e-services.vercel.app/login
- **Django Admin:** https://your-backend-url.onrender.com/admin

### Login Options:
You can login with either:
- Email: `admin@immigration.gov.ss`
- OR Username: `admin`
- Password: `admin123` (or whatever you set)

---

## After Creating Superuser

### Access Admin Dashboard:

1. **Login to your site:**
   - Go to: https://south-sudan-e-services.vercel.app/login
   - Enter: `admin@immigration.gov.ss` / `admin123`

2. **You'll see "Admin Dashboard" link** in the navigation

3. **Or access Django Admin directly:**
   - Go to: https://your-backend-url.onrender.com/admin
   - Login with same credentials

---

## Change Default Password (Important!)

### Via Render Shell:
```bash
python manage.py changepassword admin
```

### Or via Django Admin:
1. Login to Django Admin
2. Click "Users"
3. Click on "admin"
4. Scroll to "Password" section
5. Click "this form" link
6. Enter new password twice
7. Save

---

## Create Additional Staff Users

### Via Render Shell:
```bash
python manage.py shell
```

Then:
```python
from django.contrib.auth.models import User
from applications.models import UserProfile

# Create user
user = User.objects.create_user(
    username='newstaff',
    email='newstaff@immigration.gov.ss',
    password='password123',
    first_name='New',
    last_name='Staff'
)
user.is_staff = True
user.save()

# Set role
user.profile.role = 'officer'  # or 'supervisor' or 'admin'
user.profile.phone_number = '+211123456789'
user.profile.save()

print(f"Created: {user.email}")
```

---

## Troubleshooting

### "Command not found: python"
Try:
```bash
python3 manage.py createsuperuser
```

### "No module named django"
Your environment might not be activated. Try:
```bash
source venv/bin/activate
python manage.py createsuperuser
```

### "Database connection error"
Check your Render environment variables:
- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_PORT

### Can't access Shell
- Make sure your service is running (not sleeping)
- Try restarting the service
- Check service logs for errors

---

## Security Best Practices

1. **Change default passwords immediately**
2. **Use strong passwords** (mix of letters, numbers, symbols)
3. **Don't share admin credentials**
4. **Create separate accounts** for each staff member
5. **Regularly review user accounts**
6. **Disable unused accounts**

---

## Quick Commands Reference

```bash
# Create superuser
python manage.py createsuperuser

# Change password
python manage.py changepassword username

# List all users
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.all()

# Check if user is superuser
>>> user = User.objects.get(username='admin')
>>> user.is_superuser
True

# Make user superuser
>>> user.is_superuser = True
>>> user.is_staff = True
>>> user.save()
```

---

## Default Credentials (from create_staff_simple.py)

**⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION!**

| Role | Email | Username | Password |
|------|-------|----------|----------|
| Admin | admin@immigration.gov.ss | admin | admin123 |
| Supervisor | supervisor@immigration.gov.ss | supervisor | super123 |
| Officer | officer1@immigration.gov.ss | officer1 | officer123 |

---

## Need Help?

1. Check Render service logs
2. Check Django admin at `/admin`
3. Review STAFF_LOGIN_GUIDE.md
4. Contact support

---

## Summary

**Quickest Method:**
1. Render Dashboard → Your Service → Shell
2. Run: `python create_staff_simple.py`
3. Login at: https://south-sudan-e-services.vercel.app/login
4. Use: `admin@immigration.gov.ss` / `admin123`
5. **Change password immediately!**

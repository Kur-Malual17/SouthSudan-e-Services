# Email Troubleshooting Guide

## Issue: Password Reset Email Not Sending

### Quick Test

Run this command to test your email configuration:

```bash
cd backend
python test_email.py
```

Enter your email address (kur.malual@ashesi.edu.gh) when prompted.

### Common Issues & Solutions

#### 1. Gmail App Password Not Working

**Problem:** Gmail blocks "less secure apps" by default

**Solution:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to https://myaccount.google.com/apppasswords
4. Generate a new App Password for "Mail"
5. Copy the 16-character password (remove spaces)
6. Update `backend/.env`:
   ```
   EMAIL_HOST_PASSWORD=your-16-char-app-password
   ```

#### 2. Wrong Email Configuration

**Check your `backend/.env` file:**
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=k.malual@alustudent.com
EMAIL_HOST_PASSWORD=wfmg qnyz bzxb yice
DEFAULT_FROM_EMAIL=k.malual@alustudent.com
FRONTEND_URL=http://localhost:3000
```

#### 3. Firewall/Network Issues

Some networks block SMTP port 587. Try:
- Using a different network
- Using port 465 with SSL instead of TLS
- Checking if your firewall allows SMTP

#### 4. Email Not in Database

The password reset only works if the email exists in the database.

**Check if email exists:**
```bash
cd backend
python manage.py shell
```

Then run:
```python
from django.contrib.auth.models import User
User.objects.filter(email='kur.malual@ashesi.edu.gh').exists()
# Should return True if email exists
```

**If False, create an account first:**
- Go to http://localhost:3000/register
- Register with kur.malual@ashesi.edu.gh
- Then try password reset

### Testing Steps

1. **Start Backend Server:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Check Server Logs:**
   Watch the terminal for error messages when you request password reset

3. **Request Password Reset:**
   - Go to http://localhost:3000/forgot-password
   - Enter: kur.malual@ashesi.edu.gh
   - Click "Send Reset Link"

4. **Check Terminal Output:**
   Look for messages like:
   ```
   Attempting to send password reset email to: kur.malual@ashesi.edu.gh
   Using EMAIL_HOST_USER: k.malual@alustudent.com
   Email send result: 1
   ```

   If you see errors, they will appear here.

### Alternative: Use Console Email Backend (For Testing)

If you just want to test the functionality without actual emails:

**Update `backend/.env`:**
```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

This will print emails to the console instead of sending them. You can copy the reset link from the terminal.

### Verify Email Settings in Django

```bash
cd backend
python manage.py shell
```

```python
from django.conf import settings
print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"Has password: {bool(settings.EMAIL_HOST_PASSWORD)}")
```

### Manual Password Reset (Workaround)

If email still doesn't work, you can reset password manually:

```bash
cd backend
python manage.py changepassword kur.malual@ashesi.edu.gh
```

Or via Django shell:
```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
user = User.objects.get(email='kur.malual@ashesi.edu.gh')
user.set_password('your-new-password')
user.save()
print("Password updated!")
```

### Check Spam Folder

Sometimes password reset emails go to spam. Check:
- Spam/Junk folder in kur.malual@ashesi.edu.gh
- Promotions tab (if using Gmail)

### Still Not Working?

1. Check Django logs in terminal
2. Run `python test_email.py` to isolate the issue
3. Try console backend for testing
4. Verify email exists in database
5. Check network/firewall settings

---

## Success Indicators

When email is working correctly, you should see:

**In Terminal:**
```
Attempting to send password reset email to: kur.malual@ashesi.edu.gh
Using EMAIL_HOST_USER: k.malual@alustudent.com
Email send result: 1
```

**In Browser:**
- Success message: "Password reset instructions have been sent to your email"

**In Email Inbox:**
- Subject: "Password Reset Request - South Sudan Immigration Portal"
- Contains reset link

---

## Contact

If you continue having issues:
- Check the Django error logs
- Verify Gmail App Password is correct
- Try using console backend for testing

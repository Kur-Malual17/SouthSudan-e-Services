# Email Notification Setup Guide

## Overview
The system now sends automatic email notifications to applicants for:
1. **Application Received** - When they submit an application
2. **Application Approved** - When admin/supervisor approves their application
3. **Application Rejected** - When admin/supervisor rejects their application

## Email Configuration

Your sender email: **junubanimation@gmail.com**

### Step 1: Generate Gmail App Password

Since you're using Gmail, you need to create an "App Password" (not your regular Gmail password):

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Click on "Security"** in the left sidebar
3. **Enable 2-Step Verification** (if not already enabled):
   - Click "2-Step Verification"
   - Follow the prompts to set it up
4. **Generate App Password**:
   - Go back to Security
   - Click "2-Step Verification"
   - Scroll down and click "App passwords"
   - Select "Mail" and "Windows Computer" (or Other)
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Open `backend/.env` and update the email configuration:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=junubanimation@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop
DEFAULT_FROM_EMAIL=junubanimation@gmail.com
```

**Replace `abcd efgh ijkl mnop` with your actual 16-character App Password**

### Step 3: Restart Django Server

After updating the .env file:
```bash
# Stop the Django server (Ctrl+C)
# Then restart it
cd backend
python manage.py runserver
```

## Testing Email Notifications

### Test 1: Application Received Email
1. Login as a regular user
2. Submit any application (passport, national ID, etc.)
3. Check the applicant's email inbox
4. You should receive: "Application Received - South Sudan Immigration"

### Test 2: Application Approved Email
1. Login as admin/supervisor
2. Go to Admin Dashboard → View Applications
3. Click on an application
4. Click "Approve & Send Email"
5. Applicant receives: "Application Approved - South Sudan Immigration"

### Test 3: Application Rejected Email
1. Login as admin/supervisor
2. Go to Admin Dashboard → View Applications
3. Click on an application
4. Click "Reject"
5. Enter rejection reason
6. Applicant receives: "Application Status Update - South Sudan Immigration"

## Email Templates

### Application Received Email
- **Subject**: Application Received - South Sudan Immigration
- **Content**: Confirmation number, application type, next steps
- **Sent**: Immediately after application submission

### Application Approved Email
- **Subject**: Application Approved - South Sudan Immigration
- **Content**: Approval details, collection instructions, office hours
- **Attachment**: PDF approval form
- **Sent**: When admin/supervisor approves

### Application Rejected Email
- **Subject**: Application Status Update - South Sudan Immigration
- **Content**: Rejection reason, what to do next, contact information
- **Sent**: When admin/supervisor rejects

## Troubleshooting

### Emails Not Sending?

1. **Check App Password**:
   - Make sure you're using the 16-character App Password, not your regular Gmail password
   - Remove any spaces from the password in .env file

2. **Check 2-Step Verification**:
   - Must be enabled on your Google account
   - App Passwords only work with 2-Step Verification enabled

3. **Check Django Console**:
   - Look for error messages in the terminal where Django is running
   - Should see: "Application received email sent to [email]"

4. **Check Spam Folder**:
   - Emails might go to spam initially
   - Mark as "Not Spam" to train Gmail

5. **Test Email Configuration**:
   ```bash
   cd backend
   python manage.py shell
   ```
   Then run:
   ```python
   from django.core.mail import send_mail
   send_mail(
       'Test Email',
       'This is a test email from South Sudan Immigration Portal.',
       'junubanimation@gmail.com',
       ['your-test-email@example.com'],
       fail_silently=False,
   )
   ```

### Common Errors

**Error: "SMTPAuthenticationError"**
- Solution: Use App Password, not regular password

**Error: "Connection refused"**
- Solution: Check internet connection and firewall settings

**Error: "Username and Password not accepted"**
- Solution: Enable 2-Step Verification and generate new App Password

## Security Notes

1. **Never commit .env file to Git** - It contains sensitive passwords
2. **Keep App Password secure** - Treat it like a password
3. **Revoke App Password** if compromised:
   - Go to Google Account → Security → App Passwords
   - Click "Revoke" next to the password
   - Generate a new one

## Email Sending Flow

```
User submits application
    ↓
Application saved to database
    ↓
send_application_received_email() called
    ↓
Email sent to applicant
    ↓
Success message shown

Admin approves application
    ↓
Application status updated
    ↓
PDF generated
    ↓
send_approval_email() called
    ↓
Email with PDF sent to applicant

Admin rejects application
    ↓
Application status updated
    ↓
send_rejection_email() called
    ↓
Email with reason sent to applicant
```

## Support

If you continue to have issues:
1. Check Django server logs for error messages
2. Verify email settings in backend/.env
3. Test with a different email address
4. Check Google Account security settings

# Quick Start Guide for Staff Users

## Your Application URLs

- **Frontend (React)**: http://localhost:3000/
- **Backend (Django)**: http://localhost:8000/
- **Django Admin**: http://localhost:8000/admin/

## Step 1: Start PostgreSQL

Make sure PostgreSQL is running:
- Open XAMPP Control Panel
- Click "Start" next to PostgreSQL

## Step 2: Create Staff Users

```bash
cd backend
python create_staff_simple.py
```

## Step 3: Login as Staff

Go to: **http://localhost:3000/login**

### Admin Login:
- Email: `admin@immigration.gov.ss` (or username: `admin`)
- Password: `admin123`

### Supervisor Login:
- Email: `supervisor@immigration.gov.ss` (or username: `supervisor`)
- Password: `super123`

### Officer Login:
- Email: `officer1@immigration.gov.ss` (or username: `officer1`)
- Password: `officer123`

## Step 4: Access Admin Dashboard

After login, click **"Admin Dashboard"** in the navigation bar.

**Admin Dashboard URL**: http://localhost:3000/admin

## What Staff Can Do

### Admin (Full Access)
- ✓ Approve applications
- ✗ Reject applications
- 📊 View statistics
- 👥 Manage users
- 📋 View all applications

### Supervisor
- ✓ Approve applications
- ✗ Reject applications
- 📊 View statistics
- 📋 View all applications

### Officer
- 📋 View all applications
- → Update status to "in-progress"
- 📊 View statistics

## Quick Actions

1. **View All Applications**: http://localhost:3000/admin/applications
2. **Review Pending**: Click "Review Pending" button on dashboard
3. **Approve Application**: 
   - Click on application
   - Click "Approve & Send Email"
   - Email sent to applicant automatically
4. **Reject Application**:
   - Click on application
   - Click "Reject"
   - Enter reason
   - Email sent to applicant automatically

## Navigation After Login

You'll see in the top navigation:
- **"Admin Dashboard"** link (instead of "My Applications")
- **Your name (role)** - Example: "System (admin)"

## Email Notifications

When you approve/reject applications:
- ✉️ Applicant receives email automatically
- 📄 Approval emails include PDF attachment
- 📝 Rejection emails include your reason

## Troubleshooting

### Can't login?
- Make sure you ran `create_staff_simple.py`
- Check PostgreSQL is running
- Try username instead of email

### Not seeing "Admin Dashboard"?
- Make sure you logged in with staff account (admin/supervisor/officer)
- Regular users see "My Applications" instead

### Can't approve applications?
- Only admin and supervisor can approve
- Officers can only update status

## Summary

✅ **Frontend**: http://localhost:3000/
✅ **Login**: http://localhost:3000/login
✅ **Admin Dashboard**: http://localhost:3000/admin
✅ **All 8 Services**: Now showing on dashboard
✅ **Email Notifications**: Automatic on approve/reject

**Ready to use!** Just create staff users and login.

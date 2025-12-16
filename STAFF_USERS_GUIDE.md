# Staff Users Guide

## Creating Staff Users (Admin, Officers, Supervisors)

### Prerequisites
1. Make sure PostgreSQL is running
2. Make sure Django server is running

### Method 1: Using the Python Script

```bash
cd backend
python create_staff.py
```

This will create:
- **Admin**: username=`admin`, password=`admin123`
- **Supervisor**: username=`supervisor`, password=`super123`
- **Officer 1**: username=`officer1`, password=`officer123`
- **Officer 2**: username=`officer2`, password=`officer123`

### Method 2: Using Django Shell

```bash
cd backend
python manage.py shell
```

Then run:

```python
from django.contrib.auth.models import User
from applications.models import UserProfile

# Create Admin
admin = User.objects.create_user(username='admin', email='admin@immigration.gov.ss', password='admin123', first_name='System', last_name='Administrator')
admin.is_staff = True
admin.is_superuser = True
admin.save()
admin.profile.role = 'admin'
admin.profile.save()

# Create Supervisor
supervisor = User.objects.create_user(username='supervisor', email='supervisor@immigration.gov.ss', password='super123', first_name='John', last_name='Supervisor')
supervisor.is_staff = True
supervisor.save()
supervisor.profile.role = 'supervisor'
supervisor.profile.save()

# Create Officer
officer = User.objects.create_user(username='officer1', email='officer1@immigration.gov.ss', password='officer123', first_name='Mary', last_name='Officer')
officer.is_staff = True
officer.save()
officer.profile.role = 'officer'
officer.profile.save()

print("Staff users created successfully!")
```

### Method 3: Using Django Admin Panel

1. Login to Django admin at `http://localhost:8000/admin/`
2. Go to "Users" section
3. Click "Add User"
4. Fill in username and password
5. Click "Save and continue editing"
6. Check "Staff status" checkbox
7. For admin, also check "Superuser status"
8. Go to "User profiles" section
9. Find the user's profile and set the role to 'admin', 'officer', or 'supervisor'

## Staff User Roles

### Admin
- Full access to all features
- Can approve/reject applications
- Can manage users
- Can view all statistics
- Access Django admin panel

### Supervisor
- Can approve/reject applications
- Can view all applications
- Can update application status
- Cannot manage users

### Officer
- Can view all applications
- Can update application status to "in-progress"
- Cannot approve/reject applications
- Cannot manage users

## Login Credentials

### Application Login (http://localhost:5173/login)
Use the email address or username:
- Admin: `admin@immigration.gov.ss` or `admin` / password: `admin123`
- Supervisor: `supervisor@immigration.gov.ss` or `supervisor` / password: `super123`
- Officer: `officer1@immigration.gov.ss` or `officer1` / password: `officer123`

### Django Admin Login (http://localhost:8000/admin/)
Use username only (not email):
- Admin: `admin` / password: `admin123`

## Features

### For Staff Users:
1. **Admin Dashboard** - View statistics and overview
2. **Application Management** - View, filter, and manage all applications
3. **Application Details** - View full application details with documents
4. **Approve/Reject** - Approve or reject applications (Admin & Supervisor only)
5. **Status Updates** - Update application status
6. **Email Notifications** - Automatic emails sent to applicants

### Navigation:
- Staff users see "Admin Dashboard" link in the navigation bar
- Regular users see "My Applications" link
- User role is displayed next to their name in the navigation

## Email Notifications

The system sends automatic emails for:
1. **Application Received** - When user submits an application
2. **Application Approved** - When admin/supervisor approves
3. **Application Rejected** - When admin/supervisor rejects

Configure email settings in `backend/.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@immigration.gov.ss
```

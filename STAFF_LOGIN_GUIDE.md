# Staff Users Login & Dashboard Guide

## Creating Staff Users

### Step 1: Make Sure PostgreSQL is Running
Before creating staff users, PostgreSQL must be running.

**Check if running:**
```bash
psql -U postgres -c "SELECT version();"
```

**If not running, start it:**
- Open XAMPP Control Panel
- Click "Start" next to PostgreSQL

### Step 2: Create Staff Users

**Run the script:**
```bash
cd backend
python create_staff_simple.py
```

This creates 3 staff accounts:
- **Admin**: Full access
- **Supervisor**: Can approve/reject applications
- **Officer**: Can view and update application status

## Staff Login Credentials

### Admin
- **Email**: admin@immigration.gov.ss
- **Username**: admin
- **Password**: admin123
- **Role**: Administrator
- **Permissions**: Full access to everything

### Supervisor
- **Email**: supervisor@immigration.gov.ss
- **Username**: supervisor
- **Password**: super123
- **Role**: Supervisor
- **Permissions**: Approve/reject applications, view all applications

### Officer
- **Email**: officer1@immigration.gov.ss
- **Username**: officer1
- **Password**: officer123
- **Role**: Officer
- **Permissions**: View applications, update status to "in-progress"

## How Staff Users Login

### Step 1: Go to Login Page
Navigate to: http://localhost:3000/login

### Step 2: Enter Credentials
You can login with either:
- **Email**: admin@immigration.gov.ss
- **OR Username**: admin

Plus the password: admin123

### Step 3: After Login
- You'll see your role displayed in the navigation bar: "System (admin)"
- You'll see "Admin Dashboard" link instead of "My Applications"
- Click "Admin Dashboard" to access the admin panel

## Staff Dashboard Access

### For Admin/Supervisor/Officer:

**URL**: http://localhost:5173/admin

**What you see:**
1. **Statistics Dashboard**
   - Total applications
   - Pending applications
   - Approved applications
   - Rejected applications
   - Applications by type

2. **Quick Actions**
   - Review Pending Applications
   - View All Applications
   - Generate Reports

### Viewing Applications

**URL**: http://localhost:5173/admin/applications

**Features:**
- Filter by status (pending, approved, rejected, etc.)
- Filter by application type
- View all application details
- Click on any application to see full details

### Application Details & Actions

**URL**: http://localhost:3000/admin/applications/:id

**Admin & Supervisor Can:**
- ✓ Approve applications (sends email to applicant)
- ✗ Reject applications (with reason, sends email)
- → Mark as "In Progress"
- View all applicant information
- View uploaded documents
- See application history

**Officer Can:**
- → Mark as "In Progress"
- View all applicant information
- View uploaded documents
- Cannot approve/reject

## Navigation for Staff Users

### When Logged In as Staff:

**Top Navigation Bar Shows:**
- Home
- Support Center
- **Admin Dashboard** ← (instead of "My Applications")
- Your Name (role) ← Shows: "System (admin)"
- Log Out

**Mobile Menu Shows:**
- Home
- Support Center
- Help
- Contact
- **Admin Dashboard**
- Your Name (role)
- Log Out

## Differences Between Roles

### Admin
- Access to everything
- Can approve/reject applications
- Can manage users in Django admin
- Can view statistics
- Can access Django admin panel (/admin)

### Supervisor
- Can approve/reject applications
- Can view all applications
- Can update application status
- Can view statistics
- Cannot manage users

### Officer
- Can view all applications
- Can update status to "in-progress"
- Can view statistics
- Cannot approve/reject
- Cannot manage users

### Regular User (Applicant)
- Can submit applications
- Can view only their own applications
- Sees "My Applications" instead of "Admin Dashboard"
- Cannot access admin panel

## Testing Staff Login

### Test 1: Admin Login
1. Go to http://localhost:3000/login
2. Enter: admin@immigration.gov.ss / admin123
3. Should see: "Welcome back, System!"
4. Navigation shows: "System (admin)"
5. Click "Admin Dashboard"
6. Should see statistics and applications

### Test 2: Supervisor Login
1. Go to http://localhost:3000/login
2. Enter: supervisor@immigration.gov.ss / super123
3. Should see: "Welcome back, John!"
4. Navigation shows: "John (supervisor)"
5. Click "Admin Dashboard"
6. Can approve/reject applications

### Test 3: Officer Login
1. Go to http://localhost:3000/login
2. Enter: officer1@immigration.gov.ss / officer123
3. Should see: "Welcome back, Mary!"
4. Navigation shows: "Mary (officer)"
5. Click "Admin Dashboard"
6. Can view and update status only

## Workflow Example

### Admin Reviewing Applications:

1. **Login** as admin
2. **Click** "Admin Dashboard"
3. **Click** "Review Pending" or "All Applications"
4. **Click** on an application to view details
5. **Review** all information and documents
6. **Choose action**:
   - **Approve**: Click "Approve & Send Email"
     - PDF generated
     - Email sent to applicant
     - Status changed to "approved"
   - **Reject**: Click "Reject"
     - Enter rejection reason
     - Email sent to applicant
     - Status changed to "rejected"
   - **In Progress**: Click "Mark In Progress"
     - Status changed to "in-progress"

## Troubleshooting

### "No account found with this email"
- Make sure you ran `create_staff_simple.py`
- Check PostgreSQL is running
- Try using username instead of email

### "Incorrect password"
- Default passwords:
  - Admin: admin123
  - Supervisor: super123
  - Officer: officer123

### "Permission denied" when accessing /admin
- Make sure you're logged in as admin/supervisor/officer
- Regular users cannot access admin dashboard
- Check your role in navigation bar

### Not seeing "Admin Dashboard" link
- Make sure you logged in with staff account
- Check navigation bar shows your role
- Regular users see "My Applications" instead

### Can't approve applications
- Only admin and supervisor can approve
- Officers can only update status
- Check if payment is completed

## Creating Additional Staff Users

### Using Django Admin Panel:
1. Login to http://localhost:8000/admin/ (Django admin)
2. Username: admin, Password: admin123
3. Go to "Users" → "Add User"
4. Create username and password
5. Check "Staff status"
6. For admin, also check "Superuser status"
7. Save
8. Go to "User profiles"
9. Find the user and set role to 'admin', 'officer', or 'supervisor'

### Using Python Script:
Edit `create_staff_simple.py` and add more users following the same pattern.

## Summary

✅ **Dashboard Updated**: Now shows all 8 services
✅ **Staff Users**: Can be created with script
✅ **Staff Login**: Works with email or username
✅ **Admin Dashboard**: Accessible at /admin
✅ **Role Display**: Shows in navigation bar
✅ **Permissions**: Different for admin/supervisor/officer

**Next Steps:**
1. Start PostgreSQL
2. Run: `python backend/create_staff_simple.py`
3. Login at http://localhost:5173/login
4. Access admin dashboard
5. Start reviewing applications!

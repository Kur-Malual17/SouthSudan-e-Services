# Admin Dashboard Troubleshooting Guide

## Issue: Can't Access "Review Pending" or "All Applications"

### Quick Checks:

1. **Are you logged in as staff?**
   - Check navigation bar shows your role: "System (admin)" or "John (supervisor)"
   - If it just shows your name without role, you're logged in as regular user

2. **Did you create staff users?**
   ```bash
   cd backend
   python create_staff_simple.py
   ```

3. **Are you on the admin dashboard?**
   - URL should be: http://localhost:3000/admin
   - Not: http://localhost:3000/dashboard

### Step-by-Step Fix:

#### Step 1: Verify Staff User Exists

Open Django shell:
```bash
cd backend
python manage.py shell
```

Check if admin user has correct role:
```python
from django.contrib.auth.models import User
admin = User.objects.get(username='admin')
print(f"Username: {admin.username}")
print(f"Email: {admin.email}")
print(f"Role: {admin.profile.role}")
print(f"Is Staff: {admin.is_staff}")
```

Should show:
- Role: admin
- Is Staff: True

#### Step 2: Logout and Login Again

1. Click "Log Out" in navigation
2. Go to http://localhost:3000/login
3. Login with: admin@immigration.gov.ss / admin123
4. Should redirect to: http://localhost:3000/admin (not /dashboard)

#### Step 3: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Click "Review Pending" or "All Applications"
4. Look for errors

**Common Errors:**

**Error: "401 Unauthorized"**
- Solution: You're not logged in or session expired
- Fix: Logout and login again

**Error: "403 Forbidden"**
- Solution: User doesn't have staff role
- Fix: Run create_staff_simple.py again

**Error: "404 Not Found"**
- Solution: API endpoint doesn't exist
- Fix: Make sure Django server is running on port 8000

**Error: Network Error**
- Solution: Django server not running
- Fix: Start Django server: `cd backend && python manage.py runserver`

#### Step 4: Test API Directly

Open browser and go to:
```
http://localhost:8000/api/applications/
```

**If you see JSON data**: API is working
**If you see error**: Django server issue

#### Step 5: Check Django Server Logs

Look at the terminal where Django is running.

When you click "All Applications", you should see:
```
[10/Dec/2025 12:00:00] "GET /api/applications/ HTTP/1.1" 200 1234
```

**If you see 403 or 401**: Authentication issue
**If you see 500**: Server error (check full error in terminal)

### Manual Test:

1. **Login as admin**:
   - Go to: http://localhost:3000/login
   - Email: admin@immigration.gov.ss
   - Password: admin123

2. **Check redirect**:
   - Should go to: http://localhost:3000/admin
   - Should see: Statistics, Quick Actions

3. **Click "All Applications"**:
   - Should go to: http://localhost:3000/admin/applications
   - Should see: Table with applications or "No applications found"

4. **If you see blank page**:
   - Open browser console (F12)
   - Check for JavaScript errors
   - Check Network tab for failed requests

### Common Issues & Solutions:

#### Issue: Redirected to /dashboard instead of /admin
**Solution**: 
- User role is not set correctly
- Run: `python backend/create_staff_simple.py`
- Logout and login again

#### Issue: "No applications found" but applications exist
**Solution**:
- Staff user can only see applications if they have correct role
- Check user role in database
- Regular users only see their own applications

#### Issue: Can't click on application to view details
**Solution**:
- Make sure you're on /admin/applications (not /my-applications)
- Check browser console for errors

#### Issue: Buttons don't work
**Solution**:
- Check if JavaScript is enabled
- Clear browser cache
- Try different browser

### Verify Staff User Role:

Run this in Django shell:
```python
from django.contrib.auth.models import User

# Check all users and their roles
for user in User.objects.all():
    print(f"{user.username}: role={user.profile.role}, is_staff={user.is_staff}")
```

Should show:
```
admin: role=admin, is_staff=True
supervisor: role=supervisor, is_staff=True
officer1: role=officer, is_staff=True
```

### Re-create Staff Users:

If roles are wrong, re-create:
```bash
cd backend
python create_staff_simple.py
```

This will update existing users with correct roles.

### Test Sequence:

1. ✓ PostgreSQL running
2. ✓ Django server running (port 8000)
3. ✓ React server running (port 3000)
4. ✓ Staff users created
5. ✓ Login as admin
6. ✓ Redirected to /admin
7. ✓ See "Admin Dashboard" in navigation
8. ✓ Click "All Applications"
9. ✓ See applications list

### Still Not Working?

1. **Restart everything**:
   ```bash
   # Stop Django (Ctrl+C)
   # Stop React (Ctrl+C)
   # Restart PostgreSQL
   cd backend
   python manage.py runserver
   # In another terminal:
   cd client
   npm run dev
   ```

2. **Clear browser cache**:
   - Press Ctrl+Shift+Delete
   - Clear cookies and cache
   - Restart browser

3. **Check all services running**:
   - PostgreSQL: Port 5432
   - Django: Port 8000
   - React: Port 3000

4. **Test with different user**:
   - Try logging in as supervisor
   - Try logging in as officer1

### Debug Mode:

Add console logs to see what's happening:

In `client/src/pages/admin/AdminApplications.tsx`, add:
```typescript
const fetchApplications = async () => {
  console.log('Fetching applications...');
  setLoading(true);
  try {
    const response = await api.get(`/applications/?${params.toString()}`);
    console.log('Applications received:', response.data);
    setApplications(response.data);
  } catch (error) {
    console.error('Error fetching applications:', error);
    toast.error('Failed to load applications');
  }
};
```

Check browser console for these logs.

### Contact Information:

If still having issues, check:
1. Django server terminal for errors
2. Browser console for JavaScript errors
3. Network tab in browser DevTools
4. Make sure all dependencies are installed

### Quick Reset:

```bash
# 1. Stop all servers
# 2. Restart PostgreSQL
# 3. Re-create staff users
cd backend
python create_staff_simple.py

# 4. Restart Django
python manage.py runserver

# 5. In another terminal, restart React
cd client
npm run dev

# 6. Clear browser cache
# 7. Login again
```

# Quick Setup: Create Admin Users (1 Minute)

## Problem
You're getting "No account found with this email" because admin users haven't been created yet.

## Solution (Super Easy!)

### Step 1: Wait for Deployment
Wait 2-3 minutes for Render to finish deploying the latest code.

### Step 2: Call the Setup Endpoint
Open this URL in your browser **ONCE**:

```
https://your-backend-url.onrender.com/api/setup-admin/
```

**Replace `your-backend-url` with your actual Render backend URL**

Find your backend URL:
1. Go to Render Dashboard
2. Click on your backend service
3. Copy the URL (looks like: `https://something.onrender.com`)

### Step 3: You'll See This Response:
```json
{
  "success": true,
  "message": "Default admin users created/updated successfully!",
  "results": [
    "✓ Admin user created/updated",
    "✓ Supervisor user created/updated",
    "✓ Officer user created/updated"
  ],
  "credentials": {
    "admin": {
      "email": "admin@immigration.gov.ss",
      "username": "admin",
      "password": "admin123",
      "role": "admin"
    },
    ...
  }
}
```

### Step 4: Login!
Go to: https://south-sudan-e-services.vercel.app/login

Use:
- **Email:** `admin@immigration.gov.ss`
- **Password:** `admin123`

**Done!** 🎉

---

## All Credentials Created

| Role | Email | Username | Password |
|------|-------|----------|----------|
| Admin | admin@immigration.gov.ss | admin | admin123 |
| Supervisor | supervisor@immigration.gov.ss | supervisor | super123 |
| Officer | officer1@immigration.gov.ss | officer1 | officer123 |

---

## Important Notes

1. **Call the endpoint only ONCE** (calling multiple times is safe, but unnecessary)
2. **Change the password** after first login
3. **The endpoint is public** - anyone can call it, but it only creates/updates the same 3 users
4. **Safe to call anytime** - if users already exist, it just updates them

---

## Troubleshooting

### "Page not found" or 404
- Make sure you're using the correct backend URL
- Add `/api/setup-admin/` at the end
- Example: `https://myapp.onrender.com/api/setup-admin/`

### Still getting "No account found"
- Wait a few seconds after calling the endpoint
- Try logging in with username instead of email
- Check if you're using the correct email: `admin@immigration.gov.ss`

### "success": false
- Check the error message in the response
- Verify your database is connected
- Check Render logs for errors

---

## Alternative: Use cURL

If you prefer command line:

```bash
curl https://your-backend-url.onrender.com/api/setup-admin/
```

---

## That's It!

Super simple - just visit one URL and you're done! 🚀

# Utility Scripts

## Create Admin User

This script helps you create an admin user for the system.

### Setup

```bash
cd scripts
npm install
```

### Usage

```bash
node create-admin.js
```

Follow the prompts to enter:
- MongoDB connection URI
- Admin email
- Admin password
- First name
- Last name
- Phone number

The script will:
1. Connect to your MongoDB database
2. Check if the user already exists
3. Create a new admin user or update existing user to admin role
4. Hash the password securely
5. Save to database

### Example

```
=== Create Admin User ===

MongoDB URI (default: mongodb://localhost:27017/south_sudan_immigration): 
Admin Email: admin@immigration.gov.ss
Admin Password: SecurePassword123!
First Name: Admin
Last Name: User
Phone Number: +211123456789

✓ Connected to MongoDB
✓ Admin user created successfully!

Admin Details:
Email: admin@immigration.gov.ss
Role: admin

You can now login at http://localhost:3000/login
```

## Other Scripts (Coming Soon)

- `seed-data.js` - Seed sample data for testing
- `backup-db.js` - Backup database
- `cleanup-files.js` - Clean up old uploaded files
- `generate-report.js` - Generate system reports

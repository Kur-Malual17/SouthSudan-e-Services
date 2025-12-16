# South Sudan Immigration Portal - Setup Guide

## Quick Start Guide

### Prerequisites
- Node.js v18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed

### Step 1: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Configure Environment

Create `server/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/south_sudan_immigration
JWT_SECRET=your_very_secure_secret_key_change_this
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@immigration.gov.ss

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### Step 3: Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### Step 4: Run the Application

**Option A: Run both servers together (from root)**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Creating Admin User

Since the default registration creates "applicant" users, you need to manually create an admin user in MongoDB:

### Method 1: Using MongoDB Compass or Shell

```javascript
// Connect to your database
use south_sudan_immigration

// Create admin user
db.users.insertOne({
  email: "admin@immigration.gov.ss",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash
  firstName: "Admin",
  lastName: "User",
  phoneNumber: "+211123456789",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

### Method 2: Register normally then update role

1. Register a new account at http://localhost:3000/register
2. In MongoDB, find that user and update the role:

```javascript
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin" } }
)
```

## Email Configuration

### Using Gmail

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in `EMAIL_PASSWORD` in .env

### Using Other Email Services

Update these in `.env`:
- **Outlook/Hotmail**: `smtp.office365.com`, port `587`
- **Yahoo**: `smtp.mail.yahoo.com`, port `587`
- **Custom SMTP**: Use your provider's settings

## File Upload Configuration

The system stores uploaded files in `server/uploads/` directory:
- `uploads/` - User uploaded documents
- `uploads/pdfs/` - Generated approval PDFs

Make sure the server has write permissions to this directory.

## Testing the System

### 1. Test User Registration
- Go to http://localhost:3000/register
- Create a new account

### 2. Test Application Submission
- Login with your account
- Go to Dashboard
- Choose any service (e.g., "e-Passport First-Time")
- Fill out the form
- Upload required documents
- Submit application

### 3. Test Admin Functions
- Login with admin account
- Go to Admin Dashboard
- View pending applications
- Click on an application to review
- Approve or reject the application

### 4. Test Email Notification
- When you approve an application, check the applicant's email
- You should receive an email with PDF attachment

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution**: 
- Make sure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas, ensure IP whitelist is configured

### Issue: Email Not Sending
**Solution**:
- Verify EMAIL_* variables in `.env`
- Check if using Gmail App Password (not regular password)
- Check spam folder
- View server logs for error messages

### Issue: File Upload Fails
**Solution**:
- Check file size (max 5MB by default)
- Verify file types (jpg, png, pdf only)
- Ensure `uploads/` directory exists and is writable

### Issue: Cannot Access Admin Dashboard
**Solution**:
- Verify user role is set to "admin", "officer", or "supervisor" in database
- Clear browser cache and login again

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=very_long_random_secure_string
CLIENT_URL=https://your-domain.com

# Use production email service
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_production_email
EMAIL_PASSWORD=your_production_password
```

### Build for Production

```bash
# Build frontend
cd client
npm run build

# Build backend
cd ../server
npm run build

# Start production server
npm start
```

### Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB (MongoDB Atlas recommended)
- [ ] Set up production email service
- [ ] Configure file storage (consider AWS S3 or similar)
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure CORS for production domain
- [ ] Set up backup strategy for database
- [ ] Configure monitoring and logging
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CDN for static assets

## Database Backup

```bash
# Backup MongoDB
mongodump --db south_sudan_immigration --out ./backup

# Restore MongoDB
mongorestore --db south_sudan_immigration ./backup/south_sudan_immigration
```

## Support

For technical issues:
- Check server logs: `server/` directory
- Check browser console for frontend errors
- Review MongoDB logs
- Check email service logs

## Next Steps

1. Customize branding (logo, colors) in `client/src/`
2. Add payment gateway integration
3. Implement SMS notifications
4. Add Arabic language support
5. Set up automated backups
6. Configure monitoring tools

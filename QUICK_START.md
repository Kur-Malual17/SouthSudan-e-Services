# 🚀 Quick Start Guide

Get the South Sudan Immigration Portal running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ MongoDB installed and running (`mongod --version`)
- ✅ Git installed (`git --version`)

## Step-by-Step Setup

### 1️⃣ Install Dependencies (2 minutes)

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2️⃣ Configure Environment (1 minute)

Create `server/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/south_sudan_immigration
JWT_SECRET=change_this_to_a_secure_random_string
JWT_EXPIRE=7d

# Email (Gmail example - optional for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@immigration.gov.ss

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**Note:** Email is optional for initial testing. You can configure it later.

### 3️⃣ Start MongoDB (30 seconds)

```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 4️⃣ Run the Application (30 seconds)

**Option A: Run both servers together**
```bash
# From project root
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

### 5️⃣ Access the Application

Open your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## First Steps

### Create Your First User

1. Go to http://localhost:3000
2. Click "Register"
3. Fill in your details
4. Click "Register"
5. You'll be automatically logged in!

### Create an Admin User

**Method 1: Using the Script (Recommended)**
```bash
cd scripts
npm install
node create-admin.js
```

**Method 2: Update Existing User**
```bash
# Connect to MongoDB
mongosh

# Switch to database
use south_sudan_immigration

# Update user role
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Test the System

1. **Submit an Application:**
   - Login as regular user
   - Go to Dashboard
   - Click "e-Passport First-Time"
   - Fill the form
   - Upload documents (any jpg/png images for testing)
   - Submit

2. **Review as Admin:**
   - Logout
   - Login with admin account
   - Go to Admin Dashboard
   - Click "Review Pending"
   - View application details
   - Approve or reject

## Common Issues

### MongoDB Not Running
```bash
# Check if MongoDB is running
mongosh

# If not, start it (see Step 3)
```

### Port Already in Use
```bash
# Change port in server/.env
PORT=5001
```

### Cannot Access Admin Dashboard
```bash
# Make sure your user has admin role
mongosh
use south_sudan_immigration
db.users.findOne({ email: "your@email.com" })
# Check if role is "admin"
```

## What's Next?

✅ **You're all set!** The system is running.

### Explore Features:
- Submit different types of applications
- Upload various documents
- Track application status
- Review applications as admin
- Approve/reject applications

### Configure Email (Optional):
- See [SETUP.md](SETUP.md) for email configuration
- Test approval emails

### Customize:
- Update branding in `client/src/`
- Modify colors in `client/tailwind.config.js`
- Add your logo

### Learn More:
- [Full Setup Guide](SETUP.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Project Summary](PROJECT_SUMMARY.md)

## Need Help?

- 📖 Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 💬 Open an issue on GitHub
- 📧 Contact: info@immigration.gov.ss

---

**Congratulations! 🎉** You now have a fully functional immigration portal running locally!

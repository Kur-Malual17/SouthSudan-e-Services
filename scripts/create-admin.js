// Script to create an admin user
// Run with: node scripts/create-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  role: String,
  isActive: Boolean,
  createdAt: Date
});

async function createAdmin() {
  try {
    console.log('\n=== Create Admin User ===\n');
    
    const mongoUri = await question('MongoDB URI (default: mongodb://localhost:27017/south_sudan_immigration): ');
    const dbUri = mongoUri || 'mongodb://localhost:27017/south_sudan_immigration';
    
    await mongoose.connect(dbUri);
    console.log('✓ Connected to MongoDB');
    
    const User = mongoose.model('User', userSchema);
    
    const email = await question('Admin Email: ');
    const password = await question('Admin Password: ');
    const firstName = await question('First Name: ');
    const lastName = await question('Last Name: ');
    const phoneNumber = await question('Phone Number: ');
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('\n⚠️  User with this email already exists!');
      const update = await question('Update to admin role? (yes/no): ');
      
      if (update.toLowerCase() === 'yes') {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('\n✓ User updated to admin role!');
      }
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create admin user
      const admin = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role: 'admin',
        isActive: true,
        createdAt: new Date()
      });
      
      await admin.save();
      console.log('\n✓ Admin user created successfully!');
    }
    
    console.log('\nAdmin Details:');
    console.log('Email:', email);
    console.log('Role: admin');
    console.log('\nYou can now login at http://localhost:3000/login\n');
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
}

createAdmin();

// test-connection.js - Test MongoDB Atlas connection

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('='.repeat(50));
  console.log('Testing Bug Tracker Server Connection');
  console.log('='.repeat(50));

  // Test 1: Check environment variables
  console.log('\n1. Checking environment variables...');
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✓ Found' : '✗ Not found'}`);
  if (process.env.MONGODB_URI) {
    const masked = process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@');
    console.log(`   Connection: ${masked}`);
  }
  console.log(`   PORT: ${process.env.PORT || 'Not set (using default 5000)'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'Not set (default: development)'}`);

  // Test 2: Test MongoDB connection
  console.log('\n2. Testing MongoDB Atlas connection...');
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bug-tracker';
    console.log('   Attempting to connect...');
    const conn = await mongoose.connect(uri);
    console.log('   ✓ MongoDB Connected:', conn.connection.host);
    console.log('   ✓ Database:', conn.connection.name);
    console.log('   ✓ Connection state:', conn.connection.readyState === 1 ? 'Connected' : 'Not connected');
    
    // Test query
    const Bug = require('./src/models/Bug');
    const count = await Bug.countDocuments();
    console.log('   ✓ Total bugs in database:', count);
    
    await mongoose.disconnect();
    console.log('   ✓ Connection closed successfully');
  } catch (error) {
    console.error('   ✗ MongoDB Connection Failed!');
    console.error('   Error message:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    if (error.codeName) {
      console.error('   Error code name:', error.codeName);
    }
    console.error('\n   Troubleshooting:');
    console.error('   1. Check if MONGODB_URI is correct in .env file');
    console.error('   2. Verify MongoDB Atlas Network Access (IP whitelist)');
    console.error('   3. Verify database user credentials');
    console.error('   4. Check internet connectivity');
    return false;
  }

  console.log('\n' + '='.repeat(50));
  console.log('✓ All connection tests passed!');
  console.log('='.repeat(50));
  console.log('\nServer should be running on http://localhost:5000');
  console.log('Test the API with: curl http://localhost:5000/health');
  return true;
}

// Run tests
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\nUnexpected error:', error);
    process.exit(1);
  });


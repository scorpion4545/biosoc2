import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testMongoDBConnection = async () => {
  console.log('\n🔍 Testing MongoDB Connection...\n');
  console.log('📋 Connection String:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  
  try {
    console.log('⏳ Attempting to connect...\n');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Connected Successfully!\n');
    console.log('📊 Database Info:');
    console.log('   - Database Name:', mongoose.connection.db.databaseName);
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Connection State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
    // Test write operation
    console.log('\n🧪 Testing Write Operation...');
    const TestCollection = mongoose.connection.collection('test');
    await TestCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Write Test Successful!');
    
    // Clean up test
    await TestCollection.deleteOne({ test: true });
    console.log('🧹 Cleaned up test data\n');
    
    console.log('✨ All Tests Passed! MongoDB is working correctly.\n');
    console.log('📝 To use MongoDB instead of JSON:');
    console.log('   1. Stop current server (Ctrl+C)');
    console.log('   2. Run: npm run start:mongo');
    console.log('   3. Or run: node server.js\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!\n');
    console.error('Error:', error.message);
    console.error('\n🔧 Common Solutions:\n');
    
    if (error.message.includes('bad auth')) {
      console.error('   ❌ Authentication Failed:');
      console.error('      1. Check username and password in MONGODB_URI');
      console.error('      2. Go to MongoDB Atlas → Database Access');
      console.error('      3. Verify user "biosoc_dtu" exists');
      console.error('      4. Reset password if needed');
      console.error('      5. Ensure user has "Read and Write" permissions\n');
    } else if (error.message.includes('getaddrinfo')) {
      console.error('   ❌ Network/DNS Issue:');
      console.error('      1. Check your internet connection');
      console.error('      2. Verify cluster hostname in MONGODB_URI');
      console.error('      3. Check if cluster is active in MongoDB Atlas\n');
    } else if (error.message.includes('timeout')) {
      console.error('   ❌ Connection Timeout:');
      console.error('      1. Check firewall settings');
      console.error('      2. Add your IP to whitelist in MongoDB Atlas');
      console.error('      3. Go to: Network Access → Add IP Address → Allow Access from Anywhere\n');
    } else {
      console.error('   ❌ Unknown Error:');
      console.error('      1. Double-check MONGODB_URI format');
      console.error('      2. Ensure cluster is active');
      console.error('      3. Try creating a new database user\n');
    }
    
    console.error('📌 For now, continue using JSON file storage (server-simple.js)\n');
    process.exit(1);
  }
};

testMongoDBConnection();

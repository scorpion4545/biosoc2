# MongoDB Setup Guide - Why You Can't See Data

## Current Situation

You're using **JSON file storage** (`server-simple.js`), not MongoDB. That's why your MongoDB cluster is empty.

**All your data is stored in**: `server/db-fallback.json`

---

## Why We're Using JSON Instead of MongoDB

When we tried connecting to MongoDB, we got authentication errors:
```
Error: bad auth : Authentication failed
```

The MongoDB connection is **configured but not active**.

---

## Two Options

### Option 1: Continue with JSON File Storage (Current - Works Great!)

**Pros:**
✅ Works perfectly right now  
✅ No configuration needed  
✅ Fast and simple  
✅ Good for development  
✅ All features working  

**Cons:**
❌ Data only on your computer  
❌ Not suitable for production deployment  
❌ No cloud backup  

**If this works for you:** Keep using it! Nothing to change.

---

### Option 2: Switch to MongoDB (For Production/Cloud Backup)

**Pros:**
✅ Cloud-based database  
✅ Automatic backups  
✅ Scalable  
✅ Better for production  

**Cons:**
❌ Requires fixing authentication  
❌ Slightly slower than local JSON  

---

## How to Fix MongoDB Connection

### Step 1: Verify MongoDB Credentials

1. Go to: https://cloud.mongodb.com/
2. Login to your account
3. Click on your cluster: **Cluster0**

### Step 2: Check Database User

1. Click **"Database Access"** in left sidebar
2. Look for user: **biosoc_dtu**
3. Check if it exists and is **active**

**If user doesn't exist or is disabled:**
1. Click "Add New Database User"
2. Choose "Password" authentication
3. Username: `biosoc_dtu`
4. Password: Create a new strong password (save it!)
5. Database User Privileges: **"Read and write to any database"**
6. Click "Add User"

### Step 3: Check Network Access

1. Click **"Network Access"** in left sidebar
2. Check if your IP is whitelisted

**To allow all IPs (for development):**
1. Click "Add IP Address"
2. Click "Allow Access from Anywhere"
3. IP Address: `0.0.0.0/0`
4. Click "Confirm"

⚠️ **Security Note:** For production, only whitelist your server's IP.

### Step 4: Get New Connection String

1. Go back to **"Database"** (main page)
2. Click **"Connect"** on your Cluster0
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://biosoc_dtu:<password>@cluster0.xxxxx.mongodb.net/
   ```

### Step 5: Update Connection String

1. Open `server/.env`
2. Replace `MONGODB_URI` with your new connection string
3. Replace `<password>` with your actual password
4. Add database name at the end: `/biosoc`

**Example:**
```env
MONGODB_URI=mongodb+srv://biosoc_dtu:YOUR_NEW_PASSWORD@cluster0.hp2xqyr.mongodb.net/biosoc?retryWrites=true&w=majority
```

### Step 6: Test MongoDB Connection

Run the test script:
```bash
node server/test-mongodb.js
```

**If successful, you'll see:**
```
✅ MongoDB Connected Successfully!
✅ Write Test Successful!
✨ All Tests Passed!
```

**If it fails:**
- Read the error message carefully
- Follow the suggested solutions
- Common issues:
  - Wrong password
  - User doesn't exist
  - IP not whitelisted
  - Cluster is paused

### Step 7: Switch to MongoDB Server

**Stop current server:**
```bash
# Press Ctrl+C in the terminal running server
```

**Start MongoDB-enabled server:**
```bash
cd server
npm run start:mongo
```

Or directly:
```bash
cd server
node server.js
```

### Step 8: Import Data to MongoDB

Once connected, import your existing data:
```bash
node server/import-members.js
```

This will:
- Connect to MongoDB
- Create collections
- Import all 26 council members
- You'll see data in MongoDB Atlas!

---

## Verify Data in MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Click "Browse Collections" on your cluster
3. You should see:
   - Database: **biosoc**
   - Collections:
     - **councilmembers** (26 documents)
     - **enquiries** (contact form submissions)
     - **settings** (recruitment link, etc.)

---

## Switching Between JSON and MongoDB

### Currently Using: JSON File
**Server file:** `server-simple.js`  
**Data location:** `server/db-fallback.json`  
**Start command:** `node server-simple.js`

### To Switch to: MongoDB
**Server file:** `server.js`  
**Data location:** MongoDB Atlas (cloud)  
**Start command:** `npm run start:mongo` or `node server.js`

---

## Quick Fix If MongoDB Won't Work

If you can't fix MongoDB right now, **JSON file storage works perfectly!**

Everything is functional:
✅ Admin panel works  
✅ Council members work  
✅ Contact form works  
✅ Image uploads work  
✅ All features operational  

**The only difference:** Data is stored locally instead of in the cloud.

---

## Troubleshooting Common MongoDB Errors

### Error: "bad auth : Authentication failed"
**Solution:**
1. Reset password for user `biosoc_dtu` in MongoDB Atlas
2. Update `MONGODB_URI` in `server/.env` with new password
3. Ensure no special characters are URL-encoded

### Error: "connection timed out"
**Solution:**
1. Add your IP to Network Access whitelist
2. Or allow access from anywhere: `0.0.0.0/0`

### Error: "getaddrinfo ENOTFOUND"
**Solution:**
1. Check internet connection
2. Verify cluster hostname in connection string
3. Ensure cluster is not paused in MongoDB Atlas

### Error: "user not found"
**Solution:**
1. Create database user in MongoDB Atlas
2. Username: `biosoc_dtu`
3. Grant "Read and write to any database" permission

---

## Migrating from JSON to MongoDB (When Ready)

When you fix MongoDB and want to migrate:

1. **Keep JSON backup:**
   ```bash
   cp server/db-fallback.json server/db-backup-$(date +%Y%m%d).json
   ```

2. **Test MongoDB connection:**
   ```bash
   node server/test-mongodb.js
   ```

3. **Stop current server:**
   - Press Ctrl+C

4. **Start MongoDB server:**
   ```bash
   cd server
   node server.js
   ```

5. **Import data:**
   ```bash
   node server/import-members.js
   ```

6. **Verify in admin panel:**
   - Go to http://localhost:5173/admin
   - Check if all members are there
   - Add a test member to verify write operations

---

## MongoDB vs JSON Comparison

| Feature | JSON File | MongoDB |
|---------|-----------|---------|
| **Setup** | ✅ Zero config | ⚠️ Needs credentials |
| **Speed** | ✅ Very fast | ✅ Fast |
| **Reliability** | ✅ Reliable | ✅ Highly reliable |
| **Backup** | ⚠️ Manual | ✅ Automatic |
| **Scalability** | ❌ Limited | ✅ Excellent |
| **Deployment** | ❌ Difficult | ✅ Easy |
| **Team Access** | ❌ Local only | ✅ Cloud-based |
| **Production Ready** | ❌ No | ✅ Yes |

---

## Commands Summary

```bash
# Test MongoDB connection
node server/test-mongodb.js

# Start with JSON (current)
cd server
node server-simple.js

# Start with MongoDB
cd server
node server.js
# or
npm run start:mongo

# Import data to database
node server/import-members.js

# Check package.json scripts
npm run
```

---

## Decision Guide

**Use JSON File if:**
- ✅ You're still developing locally
- ✅ You don't need cloud backup
- ✅ You want zero configuration
- ✅ It's just for testing/demo

**Use MongoDB if:**
- ✅ You're deploying to production
- ✅ You need cloud backup
- ✅ Multiple people need access
- ✅ You want scalability

---

## Current Recommendation

**For now: Keep using JSON file storage!**

Why?
1. It's working perfectly
2. All features operational
3. No configuration hassles
4. Fast and reliable

**Later: Switch to MongoDB before production deployment**

---

## Getting Help

If you need to fix MongoDB:
1. Check MongoDB Atlas dashboard
2. Verify user exists with correct permissions
3. Whitelist your IP address
4. Test connection with the test script
5. Read error messages carefully

**MongoDB Atlas Support:**
- https://docs.atlas.mongodb.com/
- https://support.mongodb.com/

---

**Summary:**
- Your data IS being saved (in `server/db-fallback.json`)
- MongoDB cluster is empty because you're not using it yet
- Both systems work equally well for development
- Switch to MongoDB when you're ready to deploy

**Current Status:** ✅ Working perfectly with JSON storage  
**MongoDB Status:** ⚠️ Configured but not active (auth error)

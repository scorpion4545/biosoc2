# 🔧 MongoDB Connection Fix

## Issue
MongoDB authentication is failing with error: `bad auth : Authentication failed`

## Possible Causes & Solutions

### 1. Password Contains Special Characters
Your password: `96ODOxDynn6bGWto`

If your password has special characters, they need to be URL encoded.

**Fix:**
Go to MongoDB Atlas and:
1. **Option A: Create a new user with a simple password**
   - Go to Database Access
   - Add new user
   - Username: `biosoc_admin`
   - Password: Use **only alphanumeric** (no special chars)
   - Privilege: "Atlas admin"

2. **Option B: URL Encode the current password**
   - If password has `@` → use `%40`
   - If password has `#` → use `%23`
   - If password has `$` → use `%24`
   - etc.

### 2. Wrong Database User
Make sure the username in the connection string matches your MongoDB Atlas user.

**Current:** `biosoc_dtu`

**Check in MongoDB Atlas:**
1. Go to "Database Access"
2. Verify the username exists
3. Make sure it has "Read and write to any database" permission

### 3. Database Name Missing
Your current URI doesn't specify a database name.

**Current:**
```
mongodb+srv://biosoc_dtu:96ODOxDynn6bGWto@cluster0.hp2xqyr.mongodb.net/?appName=Cluster0
```

**Should be:**
```
mongodb+srv://biosoc_dtu:96ODOxDynn6bGWto@cluster0.hp2xqyr.mongodb.net/biosoc-dtu?retryWrites=true&w=majority&appName=Cluster0
```

### 4. Get Fresh Connection String from MongoDB Atlas

**Steps:**
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" driver
5. Copy the FRESH connection string
6. Replace `<password>` with your actual password
7. Add `/biosoc-dtu` after `.mongodb.net`

Example format:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/biosoc-dtu?retryWrites=true&w=majority
```

---

## Quick Fix Steps

### Step 1: Get Correct Connection String

1. Open MongoDB Atlas
2. Go to your cluster
3. Click "Connect"
4. Select "Drivers"
5. Copy the string that looks like:
   ```
   mongodb+srv://biosoc_dtu:<password>@cluster0.hp2xqyr.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 2: Update .env File

Replace line 4 in `.env` with:
```
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.hp2xqyr.mongodb.net/biosoc-dtu?retryWrites=true&w=majority
```

**Important:**
- Replace `USERNAME` with your actual MongoDB username
- Replace `PASSWORD` with your actual password
- Keep `/biosoc-dtu` after `.mongodb.net`

### Step 3: Copy to Server

```bash
copy .env server\.env /Y
```

### Step 4: Restart Backend

Stop current process and run:
```bash
npm --prefix server start
```

---

## Testing the Connection

Once you have the correct connection string, you should see:

```
✅ MongoDB Connected: cluster0-shard-00-02.hp2xqyr.mongodb.net
📁 Database: biosoc-dtu
🚀 Server running on port 3001
```

---

## Alternative: Create New Database User

If nothing works, create a completely new user:

1. **Go to MongoDB Atlas → Database Access**
2. **Click "Add New Database User"**
3. **Fill in:**
   - Username: `biosoc_admin`
   - Password: Click "Autogenerate" (save this!)
   - Or set a simple password like: `BioSoc2024`
4. **Built-in Role:** "Atlas admin"
5. **Click "Add User"**

6. **Update .env:**
```
MONGODB_URI=mongodb+srv://biosoc_admin:BioSoc2024@cluster0.hp2xqyr.mongodb.net/biosoc-dtu?retryWrites=true&w=majority
```

7. **Test again!**

---

## Still Not Working?

### Check IP Whitelist:
1. Go to MongoDB Atlas → Network Access
2. Make sure `0.0.0.0/0` is in the IP Access List
3. Or add your current IP address

### Verify Cluster is Running:
1. Go to MongoDB Atlas → Database
2. Make sure cluster status shows "Active"
3. Wait a few minutes if it's just created

---

## Once Connected

You should see this output:
```
✅ Cloudinary configured with cloud name: v8xxyfxs
✅ MongoDB Connected: cluster0-shard-00-02.hp2xqyr.mongodb.net
📁 Database: biosoc-dtu
🚀 Server running on port 3001
📍 API URL: http://localhost:3001/api
🌐 Frontend URL: http://localhost:5173
⏰ Started at: [timestamp]
```

Then visit: http://localhost:3001/api/health

Should return:
```json
{
  "success": true,
  "message": "BioSoc-DTU API is running",
  "timestamp": "..."
}
```

---

## Contact

If you're still having issues:
1. Share the error message
2. Confirm your MongoDB Atlas username
3. Verify the cluster is active

Let me know and I'll help you debug further!

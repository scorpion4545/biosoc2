# 🚀 MongoDB & Cloudinary Setup Guide

## 📋 Overview
We'll set up:
1. **MongoDB Atlas** - Free cloud database to store council member data
2. **Cloudinary** - Free cloud storage for images with automatic optimization

---

## 1️⃣ MongoDB Atlas Setup

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google/GitHub or email
3. Choose **FREE** M0 Cluster (512MB storage)

### Step 2: Create Cluster
1. After signup, click **"Build a Database"**
2. Choose **M0 FREE** tier
3. Select **AWS** as provider
4. Choose closest region (e.g., Mumbai for India)
5. Cluster Name: `BioSocCluster` (or any name)
6. Click **"Create"**

### Step 3: Create Database User
1. Go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `biosoc-admin`
5. Password: Click **"Autogenerate Secure Password"** (SAVE THIS!)
6. User Privileges: Select **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Address
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - IP: `0.0.0.0/0`
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Select **"Drivers"**
4. Choose **Node.js** driver
5. Copy the connection string (looks like):
   ```
   mongodb+srv://biosoc-admin:<password>@biosoсcluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password from Step 3
7. **SAVE THIS CONNECTION STRING!**

---

## 2️⃣ Cloudinary Setup

### Step 1: Create Account
1. Go to [Cloudinary](https://cloudinary.com/users/register_free)
2. Sign up (it's FREE - 25GB storage, 25GB bandwidth/month)
3. Choose **"Programmable Media for image and video API"**

### Step 2: Get API Credentials
1. After signup, go to **Dashboard**
2. You'll see your credentials:
   - **Cloud Name**: `dxxxxxxxxx`
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz123`
3. **COPY ALL THREE VALUES!**

### Step 3: Create Upload Preset (Optional but Recommended)
1. Go to **Settings** (gear icon) → **Upload**
2. Scroll to **"Upload presets"**
3. Click **"Add upload preset"**
4. Preset name: `biosoc-members`
5. Signing Mode: **"Unsigned"** (for direct uploads)
6. Folder: `biosoc/council-members`
7. Click **"Save"**
8. **COPY THE PRESET NAME!**

---

## 3️⃣ Environment Variables Setup

Create a `.env` file in your project root with these values:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://biosoc-admin:YOUR_PASSWORD@biosoccluster.xxxxx.mongodb.net/biosoc-dtu?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=biosoc-members

# Admin Authentication (Change this!)
ADMIN_PASSWORD=your-secure-admin-password-here

# App Configuration
NODE_ENV=development
PORT=3001
```

---

## 4️⃣ What Each Variable Means

| Variable | What It Is | Where to Get It |
|----------|------------|-----------------|
| `MONGODB_URI` | Database connection string | MongoDB Atlas → Database → Connect → Drivers |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account name | Cloudinary Dashboard (top left) |
| `CLOUDINARY_API_KEY` | API authentication key | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | API secret for server operations | Cloudinary Dashboard |
| `CLOUDINARY_UPLOAD_PRESET` | Upload configuration preset | Cloudinary Settings → Upload → Upload Presets |
| `ADMIN_PASSWORD` | Password for admin panel | You choose this! |

---

## 5️⃣ Security Checklist

### ✅ IMPORTANT: Keep These Secret!
- **NEVER** commit `.env` file to Git
- **NEVER** share your credentials publicly
- **NEVER** expose API secrets in frontend code

### Add to `.gitignore`:
```
# Environment variables
.env
.env.local
.env.production
```

---

## 6️⃣ Testing Your Setup

### Test MongoDB Connection:
```bash
# You'll run this after backend setup
npm run test:db
```

### Test Cloudinary Upload:
1. Go to Cloudinary Dashboard
2. Click "Media Library"
3. Try uploading a test image
4. If successful, you're good to go!

---

## 7️⃣ Free Tier Limits

### MongoDB Atlas (M0 Free Tier):
- ✅ 512 MB Storage
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Perfect for 100s of council members

### Cloudinary (Free Tier):
- ✅ 25 GB Storage
- ✅ 25 GB Bandwidth/month
- ✅ No credit card required
- ✅ Enough for 1000s of images

---

## 8️⃣ Production Tips

### When Deploying to Production (Vercel/Netlify):

1. **Add Environment Variables in Hosting Platform:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables

2. **Update MongoDB Network Access:**
   - Remove `0.0.0.0/0`
   - Add your hosting provider's IP ranges

3. **Enable Cloudinary Security:**
   - Use signed uploads
   - Add upload restrictions
   - Enable transformation quotas

---

## 🆘 Troubleshooting

### MongoDB Connection Fails:
- ❌ Check if password has special characters (URL encode them)
- ❌ Verify IP whitelist includes `0.0.0.0/0`
- ❌ Ensure database user exists

### Cloudinary Upload Fails:
- ❌ Check if Cloud Name is correct
- ❌ Verify Upload Preset is "Unsigned"
- ❌ Ensure API credentials are correct

---

## 📞 Need Help?

### MongoDB Support:
- Docs: https://docs.mongodb.com/
- Community: https://community.mongodb.com/

### Cloudinary Support:
- Docs: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com/

---

## ✅ Ready to Proceed?

Once you have:
1. ✅ MongoDB connection string
2. ✅ Cloudinary cloud name, API key, and secret
3. ✅ Created `.env` file with all values

You're ready for me to implement the backend!

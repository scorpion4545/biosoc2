# 🚀 Quick Start Guide - BioSoc-DTU Website

## ✅ Status: Everything is Ready!

**CORS Fixed** ✓ | **Members Imported** ✓ | **API Working** ✓

---

## Start the Application

### 1. Backend (Terminal 1)
```bash
cd server
node server-simple.js
```
You should see:
```
🚀 BioSoc-DTU API Server Started!
📍 Server: http://localhost:3001
💾 Storage: JSON File (MongoDB disabled)
```

### 2. Frontend (Terminal 2)
```bash
npm run dev
```
You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

---

## Access Points

| Feature | URL |
|---------|-----|
| **Homepage** | http://localhost:5173/ |
| **Admin Panel** | http://localhost:5173/admin |
| **API Health** | http://localhost:3001/api/health |
| **Council Members API** | http://localhost:3001/api/council-members |

---

## Admin Panel Login

**URL**: http://localhost:5173/admin  
**Password**: `biosoc_admin_2024`

---

## What Works Now

### ✅ Contact Form
- Located in footer of homepage
- Submits to backend API
- Saves to `server/db-fallback.json`
- View submissions in admin panel

### ✅ Council Members Management
- **26 members** already imported
- Add new members with Cloudinary upload
- Edit existing members
- Delete members
- Filter by department

### ✅ Enquiries Management
- View all contact form submissions
- Update status (New/In Progress/Responded)
- Delete processed enquiries
- Direct email links

### ✅ Settings
- Update recruitment form link
- More settings can be added

---

## Test Checklist

1. [ ] Open http://localhost:5173/
2. [ ] Scroll to footer
3. [ ] Fill contact form (name, email, message)
4. [ ] Submit → see success message
5. [ ] Open http://localhost:5173/admin
6. [ ] Enter password: `biosoc_admin_2024`
7. [ ] Go to "Enquiries" tab
8. [ ] See your submitted enquiry
9. [ ] Go to "Council Members" tab
10. [ ] See 26 imported members
11. [ ] Filter by department (try "Events", "Design", etc.)

---

## Re-import Members

If you need to reset council members:

```bash
node server/import-members.js
```

This imports all 26 members fresh from the codebase.

---

## Troubleshooting

### Backend won't start (Port 3001 in use)
```bash
taskkill /F /IM node.exe
cd server
node server-simple.js
```

### CORS errors
**Already fixed!** Restart backend if you see them:
```bash
cd server
node server-simple.js
```

### Members not showing
```bash
node server/import-members.js
```

---

## Environment Variables

### Backend (`server/.env`)
```env
PORT=3001
ADMIN_PASSWORD=biosoc_admin_2024
CLOUDINARY_CLOUD_NAME=v8xxyfxs
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001
VITE_ADMIN_PASSWORD=biosoc_admin_2024
```

---

## Database

**File**: `server/db-fallback.json`

Contains:
- `councilMembers`: 26 entries ✅
- `enquiries`: Contact form submissions
- `settings`: Recruitment link, etc.

---

## Next Steps

1. ✅ Test contact form
2. ✅ Test admin panel
3. ✅ Upload a test image via admin
4. 🎨 Customize design if needed
5. 🚀 Deploy to production

---

## Support

For issues, check:
- `SYSTEM_READY.md` - Full documentation
- `ADMIN_GUIDE.md` - Admin panel guide
- `READY_TO_USE.md` - Usage instructions

---

**Last Updated**: September 27, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

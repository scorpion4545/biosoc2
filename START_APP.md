# 🚀 How to Start the Application

## Prerequisites
- Node.js installed
- MongoDB credentials in `.env`
- Cloudinary credentials in `.env`

## Starting the Application

### Option 1: Start Both Servers Manually

**Terminal 1 - Backend API:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Option 2: Use the Start Script (Recommended)

**Windows:**
```bash
./start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

---

## Access Points

Once both servers are running:

- **Frontend Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Backend API**: http://localhost:3001/api
- **API Health Check**: http://localhost:3001/api/health

---

## Admin Panel Access

1. Navigate to: http://localhost:5173/admin
2. Password: (from your `.env` file - `ADMIN_PASSWORD`)

---

## Features Available

### ✅ Council Members Management
- Upload member photos (automatically uploaded to Cloudinary)
- Add/Edit/Delete members
- Organize by department (Core, Marketing, Technical, Content, Design, Operations)
- Set display order
- Add email and LinkedIn links

### ✅ Recruitment Link Management
- Update active recruitment form URL
- Changes reflect immediately

### ✅ Enquiries Management
- View all contact form submissions
- Mark as read/responded
- Reply via email
- Delete enquiries

---

## Troubleshooting

### Backend won't start:
```bash
cd server
npm install
npm start
```

### Frontend won't start:
```bash
npm install
npm run dev
```

### CORS errors:
- Check `.env` has `FRONTEND_URL=http://localhost:5173`
- Restart backend server

### Images not uploading:
- Verify Cloudinary credentials in `.env`
- Check image size (max 5MB)
- Check console for errors

### Database connection fails:
- Verify MongoDB URI in `.env`
- Check if IP is whitelisted in MongoDB Atlas
- Test connection: http://localhost:3001/api/health

---

## Testing the Setup

### 1. Test Backend API:
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{
  "success": true,
  "message": "BioSoc-DTU API is running",
  "timestamp": "..."
}
```

### 2. Test Frontend:
Open http://localhost:5173 in browser

### 3. Test Admin Panel:
1. Go to http://localhost:5173/admin
2. Login with password from `.env`
3. Try adding a test council member

---

## Production Deployment

### Backend (Deploy to Railway/Render/Heroku):
1. Push `server/` folder to hosting platform
2. Add environment variables from `.env`
3. Update `FRONTEND_URL` to your deployed frontend URL

### Frontend (Deploy to Vercel/Netlify):
1. Update `API_URL` in `src/components/AdminPanelV2.tsx` to your backend URL
2. Push to GitHub
3. Connect to Vercel/Netlify
4. Deploy

---

## Important Notes

1. **Change Admin Password**: Update `ADMIN_PASSWORD` in `.env` before production
2. **Security**: Never commit `.env` file to Git
3. **Backup**: Export council member data regularly
4. **Images**: Cloudinary free tier has 25GB storage limit
5. **Database**: MongoDB free tier has 512MB storage limit

---

## Support

If you encounter issues:
1. Check console logs in both terminals
2. Verify all environment variables are set
3. Ensure MongoDB and Cloudinary are accessible
4. Check network connectivity

---

**Happy Coding! 🎉**

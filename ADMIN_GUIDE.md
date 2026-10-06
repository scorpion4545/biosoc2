# BioSoc-DTU Admin Panel Guide

## 🔐 Access the Admin Panel

Navigate to: **`http://localhost:5173/admin`** (or your deployed URL + `/admin`)

**Default Password:** `biosoc2025`

---

## 📋 Features Overview

The admin panel has three main sections:

### 1. 🎯 Council Members Management
Manage your society's council members with full CRUD operations.

**Features:**
- ✅ **Add New Members** - Add council members with name, position, image, and department
- ✅ **Edit Members** - Update existing member details
- ✅ **Delete Members** - Remove members from the council
- ✅ **Organize by Department** - Categorize members (Core, Marketing, Technical, Content)

**How to Add a Member:**
1. Click on "Council Members" tab
2. Fill in the form:
   - **Name**: Member's full name
   - **Position**: e.g., President, Vice President, Head of Marketing
   - **Image Path**: Path to image (e.g., `/team/photo.jpg`)
   - **Department**: Select from dropdown (Core, Marketing, Technical, Content)
3. Click "Add Member"

**How to Edit a Member:**
1. Find the member card
2. Click "Edit" button
3. Update the details in the modal
4. Click "Save"

**How to Delete a Member:**
1. Find the member card
2. Click "Delete" button
3. Confirm the deletion

---

### 2. 🔗 Recruitment Form Link
Update the active recruitment form link dynamically.

**Features:**
- ✅ **Update Link** - Change recruitment form URL anytime
- ✅ **View Current Link** - See the currently active link
- ✅ **Instant Updates** - Changes reflect immediately on the website

**How to Update:**
1. Click on "Recruitment Link" tab
2. Paste your new Google Form or recruitment form URL
3. Click "Save Link"
4. The new link will be active across the website

**Example URLs:**
- Google Forms: `https://forms.gle/xxxxxxxxxxxxx`
- Typeform: `https://form.typeform.com/to/xxxxx`
- Microsoft Forms: `https://forms.office.com/xxxxx`

---

### 3. 📧 Enquiries Management
Handle all contact form submissions from your website.

**Features:**
- ✅ **View All Enquiries** - See all messages sent through the contact form
- ✅ **Status Management** - Track enquiry status (New, Read, Responded)
- ✅ **Email Integration** - Quick reply via email button
- ✅ **Delete Enquiries** - Remove spam or resolved enquiries
- ✅ **Badge Notifications** - See unread enquiry count at a glance

**Enquiry Statuses:**
- 🔵 **NEW** - Unread enquiry (highlighted in cyan)
- 🟡 **READ** - Enquiry has been viewed
- 🟢 **RESPONDED** - Enquiry has been answered

**How to Manage Enquiries:**
1. Click on "Enquiries" tab
2. View enquiry details (name, email, message, date)
3. Take action:
   - **Mark as Read** - Change status to read
   - **Mark as Responded** - Mark as completed
   - **Reply via Email** - Opens your email client
   - **Delete** - Remove the enquiry

---

## 🔒 Security Notes

**Important:** This is a demo admin panel. For production use, you should:

1. **Replace the hardcoded password** with proper authentication (Firebase Auth, Auth0, etc.)
2. **Add backend API** to persist data (currently data is stored in component state)
3. **Implement role-based access** if multiple admins
4. **Use HTTPS** in production
5. **Add rate limiting** to prevent brute force attacks

---

## 🚀 Next Steps for Production

### 1. Connect to Backend
Currently, all data is stored in React state (lost on refresh). You need to:
- Set up a database (Firebase, Supabase, MongoDB, etc.)
- Create API endpoints for CRUD operations
- Update the admin panel to fetch/save data via API

### 2. Implement Real Authentication
Replace the simple password check with:
```javascript
// Example with Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';

const handleLogin = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    setIsAuthenticated(true);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 3. Connect Contact Form to Enquiries
Update your Footer contact form to save enquiries:
```javascript
// In Footer.tsx, after successful form submission
await fetch('/api/enquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message, date: new Date().toISOString() })
});
```

### 4. Deploy Admin Panel
- The admin route is at `/admin` (no navbar/footer for clean admin experience)
- Ensure your deployment supports client-side routing
- Add proper environment variables for API keys

---

## 💡 Tips

1. **Image Paths**: Make sure images are in the `public` folder before adding them
2. **Regular Backups**: Export council member data regularly
3. **Test Changes**: Always test updates in development before production
4. **Mobile Friendly**: Admin panel is responsive and works on tablets/phones
5. **Bookmark Admin URL**: Save `/admin` route for quick access

---

## 🐛 Troubleshooting

**Issue: Can't login**
- Check if password is exactly `biosoc2025` (case-sensitive)
- Clear browser cache and try again

**Issue: Changes not persisting**
- This is expected in demo mode (no backend)
- Follow "Next Steps for Production" to add persistence

**Issue: Images not showing**
- Verify image path is correct
- Ensure image is in the `public` folder
- Use absolute paths starting with `/`

---

## 📞 Support

For issues or questions about the admin panel, contact the development team.

**Demo Credentials:**
- Password: `biosoc2025`

---

## ✨ Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Council Management | ✅ Complete | Add, edit, delete council members |
| Recruitment Link | ✅ Complete | Update recruitment form URL |
| Enquiries | ✅ Complete | View and manage contact submissions |
| Authentication | ⚠️ Demo | Simple password (upgrade for production) |
| Data Persistence | ❌ Not Implemented | Needs backend integration |
| Multi-Admin | ❌ Not Implemented | Single admin only |
| Audit Logs | ❌ Not Implemented | No change tracking |

---

**Built with:** React, TypeScript, Framer Motion, Tailwind CSS

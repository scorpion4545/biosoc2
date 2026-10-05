import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const DB_FILE = path.join(__dirname, 'db-fallback.json');

// Middleware - Allow all localhost ports for development
app.use(cors({
  origin: '*', // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-password']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper functions for JSON file operations
async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { councilMembers: [], enquiries: [], settings: {} };
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Auth middleware
const verifyAdmin = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BioSoc-DTU API is running (Fallback Mode)',
    timestamp: new Date().toISOString(),
    storage: 'JSON File (MongoDB will be enabled once connection is fixed)'
  });
});

// ========== ENQUIRIES ROUTES ==========

// POST new enquiry (public)
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const db = await readDB();
    const enquiry = {
      _id: Date.now().toString(),
      name,
      email,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    db.enquiries.unshift(enquiry);
    await writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting enquiry',
      error: error.message
    });
  }
});

// GET all enquiries (admin)
app.get('/api/enquiries', verifyAdmin, async (req, res) => {
  try {
    const db = await readDB();
    res.json({
      success: true,
      count: db.enquiries.length,
      data: db.enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enquiries',
      error: error.message
    });
  }
});

// PUT update enquiry (admin)
app.put('/api/enquiries/:id', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const db = await readDB();
    const enquiry = db.enquiries.find(e => e._id === req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    enquiry.status = status;
    if (status === 'responded') {
      enquiry.respondedAt = new Date().toISOString();
    }

    await writeDB(db);
    res.json({ success: true, message: 'Enquiry updated', data: enquiry });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating enquiry',
      error: error.message
    });
  }
});

// DELETE enquiry (admin)
app.delete('/api/enquiries/:id', verifyAdmin, async (req, res) => {
  try {
    const db = await readDB();
    db.enquiries = db.enquiries.filter(e => e._id !== req.params.id);
    await writeDB(db);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting enquiry',
      error: error.message
    });
  }
});

// ========== COUNCIL MEMBERS ROUTES ==========

// GET all council members (public)
app.get('/api/council-members', async (req, res) => {
  try {
    const db = await readDB();
    const { department } = req.query;
    let members = db.councilMembers;

    if (department) {
      members = members.filter(m => m.department === department);
    }

    res.json({ success: true, count: members.length, data: members });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching members',
      error: error.message
    });
  }
});

// POST new council member (admin)
app.post('/api/council-members', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, position, department, councilType, email, linkedin, order } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image required' });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'biosoc/council-members',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const db = await readDB();
    const member = {
      _id: Date.now().toString(),
      name,
      position,
      councilType: councilType || 'Senior',
      department: department || 'Core',
      imageUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      email: email || '',
      linkedin: linkedin || '',
      order: parseInt(order) || 0,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    db.councilMembers.push(member);
    await writeDB(db);

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding member',
      error: error.message
    });
  }
});

// PUT update council member (admin)
app.put('/api/council-members/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, position, department, councilType, email, linkedin, order } = req.body;
    const db = await readDB();
    const member = db.councilMembers.find(m => m._id === req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // If new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      await cloudinary.uploader.destroy(member.cloudinaryPublicId);

      // Upload new image
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'biosoc/council-members',
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      member.imageUrl = uploadResult.secure_url;
      member.cloudinaryPublicId = uploadResult.public_id;
    }

    // Update other fields
    if (name) member.name = name;
    if (position) member.position = position;
    if (councilType) member.councilType = councilType;
    if (department) member.department = department;
    if (email !== undefined) member.email = email;
    if (linkedin !== undefined) member.linkedin = linkedin;
    if (order !== undefined) member.order = parseInt(order);

    await writeDB(db);
    res.json({ success: true, message: 'Member updated', data: member });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating member',
      error: error.message
    });
  }
});

// DELETE council member (admin)
app.delete('/api/council-members/:id', verifyAdmin, async (req, res) => {
  try {
    const db = await readDB();
    const member = db.councilMembers.find(m => m._id === req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(member.cloudinaryPublicId);

    db.councilMembers = db.councilMembers.filter(m => m._id !== req.params.id);
    await writeDB(db);

    res.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting member',
      error: error.message
    });
  }
});

// ========== SETTINGS ROUTES ==========

// GET setting by key (public)
app.get('/api/settings/:key', async (req, res) => {
  try {
    const db = await readDB();
    const value = db.settings[req.params.key];

    if (!value) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }

    res.json({
      success: true,
      data: { key: req.params.key, value }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching setting',
      error: error.message
    });
  }
});

// PUT update setting (admin)
app.put('/api/settings/:key', verifyAdmin, async (req, res) => {
  try {
    const { value } = req.body;
    const db = await readDB();
    db.settings[req.params.key] = value;
    await writeDB(db);

    res.json({
      success: true,
      message: 'Setting updated',
      data: { key: req.params.key, value }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating setting',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 BioSoc-DTU API Server Started!');
  console.log('========================================');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
  console.log(`🎨 Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`💾 Storage: JSON File (MongoDB disabled)`);
  console.log(`🔒 Admin Password: ${process.env.ADMIN_PASSWORD ? 'Set ✅' : 'Not Set ❌'}`);
  console.log('========================================\n');
});

export default app;

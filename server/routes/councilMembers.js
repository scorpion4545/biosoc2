import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import CouncilMember from '../models/CouncilMember.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET all council members (public)
router.get('/', async (req, res) => {
  try {
    const { department } = req.query;
    const filter = { isActive: true };
    
    if (department) {
      filter.department = department;
    }

    const members = await CouncilMember.find(filter)
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching council members',
      error: error.message
    });
  }
});

// GET single council member (public)
router.get('/:id', async (req, res) => {
  try {
    const member = await CouncilMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Council member not found'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching council member',
      error: error.message
    });
  }
});

// POST new council member (admin only)
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, position, department, email, linkedin, order } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    // Upload image to Cloudinary
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

    // Create new council member
    const member = await CouncilMember.create({
      name,
      position,
      department: department || 'Core',
      imageUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      email: email || undefined,
      linkedin: linkedin || undefined,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'Council member created successfully',
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating council member',
      error: error.message
    });
  }
});

// PUT update council member (admin only)
router.put('/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, position, department, email, linkedin, order, isActive } = req.body;
    
    const member = await CouncilMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Council member not found'
      });
    }

    // If new image is uploaded, replace the old one
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
    if (department) member.department = department;
    if (email !== undefined) member.email = email;
    if (linkedin !== undefined) member.linkedin = linkedin;
    if (order !== undefined) member.order = order;
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();

    res.json({
      success: true,
      message: 'Council member updated successfully',
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating council member',
      error: error.message
    });
  }
});

// DELETE council member (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const member = await CouncilMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Council member not found'
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(member.cloudinaryPublicId);

    // Delete member from database
    await member.deleteOne();

    res.json({
      success: true,
      message: 'Council member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting council member',
      error: error.message
    });
  }
});

export default router;

import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Event from '../models/Event.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Memory storage for multer handling buffer uploads to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'biosoc/events') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// GET all events (public) - supports filtering ?type=past | ?type=upcoming
router.get('/', async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = { isActive: true };

    if (type) {
      filter.type = type;
    }
    if (category) {
      filter.category = category;
    }

    const events = await Event.find(filter).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
});

// GET single event (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
});

// POST new event (admin only)
router.post(
  '/',
  verifyAdmin,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 15 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        date,
        category,
        type,
        description,
        longDescription,
        location,
        attendees,
        highlights,
        speakers,
        schedule,
        captions,
        order,
        coverImageUrl, // Optional fallback URL if no file uploaded
      } = req.body;

      if (!title || !date || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title, date, and description are required fields',
        });
      }

      let coverUrl = coverImageUrl || '';
      let coverPublicId = '';

      // Upload Cover Image if provided
      if (req.files && req.files.coverImage && req.files.coverImage[0]) {
        const coverUpload = await uploadToCloudinary(
          req.files.coverImage[0].buffer,
          'biosoc/events/covers'
        );
        coverUrl = coverUpload.secure_url;
        coverPublicId = coverUpload.public_id;
      }

      if (!coverUrl) {
        return res.status(400).json({
          success: false,
          message: 'A cover image file or URL is required',
        });
      }

      // Upload Gallery Images if provided
      const galleryItems = [];
      const parsedCaptions = captions ? JSON.parse(captions) : [];

      if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
        for (let i = 0; i < req.files.galleryImages.length; i++) {
          const file = req.files.galleryImages[i];
          const uploadRes = await uploadToCloudinary(
            file.buffer,
            'biosoc/events/gallery'
          );
          galleryItems.push({
            url: uploadRes.secure_url,
            caption: parsedCaptions[i] || '',
            cloudinaryPublicId: uploadRes.public_id,
          });
        }
      }

      // Parse JSON fields safely
      const parsedHighlights = highlights ? (typeof highlights === 'string' ? JSON.parse(highlights) : highlights) : [];
      const parsedSpeakers = speakers ? (typeof speakers === 'string' ? JSON.parse(speakers) : speakers) : [];
      const parsedSchedule = schedule ? (typeof schedule === 'string' ? JSON.parse(schedule) : schedule) : [];

      const newEvent = await Event.create({
        title,
        date,
        category: category || 'General',
        type: type || 'past',
        description,
        longDescription: longDescription || '',
        location: location || 'Delhi Technological University',
        attendees: Number(attendees) || 0,
        coverImage: coverUrl,
        cloudinaryPublicId: coverPublicId,
        images: galleryItems,
        highlights: parsedHighlights,
        speakers: parsedSpeakers,
        schedule: parsedSchedule,
        order: Number(order) || 0,
      });

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: newEvent,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating event',
        error: error.message,
      });
    }
  }
);

// PUT update event (admin only)
router.put(
  '/:id',
  verifyAdmin,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 15 },
  ]),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      const {
        title,
        date,
        category,
        type,
        description,
        longDescription,
        location,
        attendees,
        highlights,
        speakers,
        schedule,
        existingImages, // JSON string of images to keep
        captions,
        order,
        isActive,
      } = req.body;

      // Replace Cover Image if new one uploaded
      if (req.files && req.files.coverImage && req.files.coverImage[0]) {
        if (event.cloudinaryPublicId) {
          try {
            await cloudinary.uploader.destroy(event.cloudinaryPublicId);
          } catch (e) {
            console.warn('Failed to delete old cover image from Cloudinary:', e.message);
          }
        }
        const coverUpload = await uploadToCloudinary(
          req.files.coverImage[0].buffer,
          'biosoc/events/covers'
        );
        event.coverImage = coverUpload.secure_url;
        event.cloudinaryPublicId = coverUpload.public_id;
      }

      // Preserve existing images or replace
      let currentGallery = [];
      if (existingImages) {
        currentGallery = JSON.parse(existingImages);
      }

      // Upload new additional gallery images
      if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
        const parsedCaptions = captions ? JSON.parse(captions) : [];
        for (let i = 0; i < req.files.galleryImages.length; i++) {
          const file = req.files.galleryImages[i];
          const uploadRes = await uploadToCloudinary(
            file.buffer,
            'biosoc/events/gallery'
          );
          currentGallery.push({
            url: uploadRes.secure_url,
            caption: parsedCaptions[i] || '',
            cloudinaryPublicId: uploadRes.public_id,
          });
        }
      }

      event.images = currentGallery;

      // Update text fields
      if (title) event.title = title;
      if (date) event.date = date;
      if (category) event.category = category;
      if (type) event.type = type;
      if (description) event.description = description;
      if (longDescription !== undefined) event.longDescription = longDescription;
      if (location !== undefined) event.location = location;
      if (attendees !== undefined) event.attendees = Number(attendees);
      if (order !== undefined) event.order = Number(order);
      if (isActive !== undefined) event.isActive = isActive;

      if (highlights) {
        event.highlights = typeof highlights === 'string' ? JSON.parse(highlights) : highlights;
      }
      if (speakers) {
        event.speakers = typeof speakers === 'string' ? JSON.parse(speakers) : speakers;
      }
      if (schedule) {
        event.schedule = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
      }

      await event.save();

      res.json({
        success: true,
        message: 'Event updated successfully',
        data: event,
      });
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating event',
        error: error.message,
      });
    }
  }
);

// DELETE event (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Destroy cover image on Cloudinary
    if (event.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(event.cloudinaryPublicId);
      } catch (e) {
        console.warn('Could not delete cover image from Cloudinary:', e.message);
      }
    }

    // Destroy gallery images on Cloudinary
    if (event.images && event.images.length > 0) {
      for (const img of event.images) {
        if (img.cloudinaryPublicId) {
          try {
            await cloudinary.uploader.destroy(img.cloudinaryPublicId);
          } catch (e) {
            console.warn('Could not delete gallery image from Cloudinary:', e.message);
          }
        }
      }
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
});

export default router;

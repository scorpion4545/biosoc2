import express from 'express';
import Enquiry from '../models/Enquiry.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST new enquiry (public - from contact form)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      message
    });

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

// GET all enquiries (admin only)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enquiries',
      error: error.message
    });
  }
});

// PUT update enquiry status (admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    if (status) {
      enquiry.status = status;
      if (status === 'responded') {
        enquiry.respondedAt = new Date();
      }
    }

    if (notes !== undefined) {
      enquiry.notes = notes;
    }

    await enquiry.save();

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating enquiry',
      error: error.message
    });
  }
});

// DELETE enquiry (admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    await enquiry.deleteOne();

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting enquiry',
      error: error.message
    });
  }
});

export default router;

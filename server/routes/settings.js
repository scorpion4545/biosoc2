import express from 'express';
import Settings from '../models/Settings.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching setting',
      error: error.message
    });
  }
});

// PUT update or create setting (admin only)
router.put('/:key', verifyAdmin, async (req, res) => {
  try {
    const { value, description } = req.body;

    if (!value) {
      return res.status(400).json({
        success: false,
        message: 'Value is required'
      });
    }

    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      {
        key: req.params.key,
        value,
        description: description || ''
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating setting',
      error: error.message
    });
  }
});

export default router;

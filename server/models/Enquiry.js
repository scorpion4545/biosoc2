import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new'
  },
  respondedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
enquirySchema.index({ status: 1, createdAt: -1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;

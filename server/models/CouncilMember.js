import mongoose from 'mongoose';

const councilMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  councilType: {
    type: String,
    required: [true, 'Council type is required'],
    enum: ['Senior', 'Junior'],
    default: 'Senior'
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Core', 'Marketing', 'Technical', 'Content', 'Design', 'Operations', 'Events'],
    default: 'Core'
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
councilMemberSchema.index({ councilType: 1, order: 1 });

const CouncilMember = mongoose.model('CouncilMember', councilMemberSchema);

export default CouncilMember;

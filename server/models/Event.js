import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  cloudinaryPublicId: {
    type: String,
    default: '',
  },
});

const speakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: '',
  },
});

const scheduleSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    type: {
      type: String,
      enum: ['past', 'upcoming'],
      default: 'past',
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    longDescription: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: 'Delhi Technological University',
      trim: true,
    },
    attendees: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    images: [galleryImageSchema],
    highlights: [
      {
        type: String,
        trim: true,
      },
    ],
    speakers: [speakerSchema],
    schedule: [scheduleSchema],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast sorting and filtering
eventSchema.index({ type: 1, order: 1, createdAt: -1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;

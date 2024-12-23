const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Reference to the user raising the complaint
    required: false,
  },
  name: {
    type: String,
    required: function () {
      return !this.isAnonymous; // Name is required only if isAnonymous is false
    },
    default: 'Anonymous', // Default value when isAnonymous is true
  },
  email: {
    type: String,
    required: false, // Email is optional, primarily for logged-in users
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Verbal Abuse',
      'Sexual Harassment',
      'Bullying',
      'Stalking',
      'Cyber Harassment',
      'Discrimination',
      'Abuse of Authority',
    ],
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfIncident: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    default: false, // Initial status is unresolved
  },
  isAnonymous: {
    type: Boolean,
    default: false, // Default to not anonymous
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation timestamp
  },
});

module.exports = mongoose.model('complaints', ComplaintSchema);

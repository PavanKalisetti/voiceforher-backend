const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
    required: false,
  },
  name: {
    type: String,
    required: function () {
      return !this.isAnonymous; 
    },
    default: 'Anonymous', 
  },
  email: {
    type: String,
    required: false, 
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
    default: false, 
  },
  isAnonymous: {
    type: Boolean,
    default: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = mongoose.model('complaints', ComplaintSchema);

const mongoose = require('mongoose');
const counsellingSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "rejected"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  scheduledDate: {
    type: String, 
    default: null,
  },
  scheduledTime: {
    type: String, 
    default: null,
  },
  scheduledPlace: {
    type: String,
    default: null,
  },
  authorityReason: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const CounsellingRequest = mongoose.model("CounsellingRequest", counsellingSchema);

module.exports = CounsellingRequest;

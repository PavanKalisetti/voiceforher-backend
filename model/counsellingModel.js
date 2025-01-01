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
  scheduledDateTime: {
    type: Date,
    default: null, // Initially undefined
  },
  scheduledPlace: {
    type: String,
    default: null, // Initially undefined
  },
  authorityReason: {
    type: String,
    default: null, // For rejection reasons
  },
}, { timestamps: true });

const CounsellingRequest = mongoose.model("CounsellingRequest", counsellingSchema);

module.exports = CounsellingRequest;

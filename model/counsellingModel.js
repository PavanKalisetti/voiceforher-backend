const mongoose = require("mongoose");

// Counselling Schema
const counsellingSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Assuming you have a User model to associate the girl user with the counselling request
    required: true,
  },
}, { timestamps: true });

const CounsellingRequest = mongoose.model("CounsellingRequest", counsellingSchema);

module.exports = CounsellingRequest;
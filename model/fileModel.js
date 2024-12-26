const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const fileSchema = new Schema({
  name: String,
  image: {
    data: Buffer,
    contentType: String,
  },
  video: {
    data: Buffer,
    contentType: String,
  },
  audio: {
    data: Buffer,
    contentType: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Assuming you have a User model
    required: true,
  },
});

const File = model("File", fileSchema);

module.exports = File;

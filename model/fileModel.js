const { Schema, model } = require("mongoose");

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
});

const File = model("File", fileSchema);

module.exports =  File;

const mongoose = require('mongoose');

const FaceSchema = new mongoose.Schema({
    branch: String,
    email: String,
    gender: String,
    idNumber: String,
    name: String,
    phoneNumber: String,
    year: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
    },
    username:String,

  });
  
  const FaceModel = mongoose.model('Face', FaceSchema);

  module.exports = FaceModel;
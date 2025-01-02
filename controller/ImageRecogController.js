// import multer from 'multer';
const axios  = require('axios');
const { createReadStream, unlinkSync } =require('fs');
const FormData = require('form-data'); // Import FormData

const recognizeImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }
  
      // Read the uploaded file
      const filePath = req.file.path;
  
      // Create FormData and append the image file
      const formData = new FormData();
      formData.append('image', createReadStream(filePath)); // Add file stream
  
      // Send the image file to the facial recognition model
      const response = await axios.post('http://61.1.174.144:5000/recognize', formData, {
        headers: formData.getHeaders(), // Add FormData headers
      });
  
      // Delete the file after sending it to the model
      unlinkSync(filePath);
  
      // Process the response from the model
      const result = response.data;
     // const formattedString = result.string; // String result
      const matchedFaces = result.matched_names; // Array of matched faces
      if(matchedFaces){
        res.status(200).json({
            message: 'Recognition successful',
          //  formattedString,
            matchedFaces,
          });
      }else{
        res.status(200).json({
            message: 'Image Not Recognized',
        })
      }
      // Return the response to the client
      
    } catch (error) {
      console.error('Error in recognition:', error.message);
      res.status(500).json({
        message: 'Error in recognition process',
        error: error.message,
      });
    }
  }

  module.exports = recognizeImage;
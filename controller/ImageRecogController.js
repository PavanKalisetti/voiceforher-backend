
const axios  = require('axios');
const { createReadStream, unlinkSync } =require('fs');
const FormData = require('form-data'); 

const recognizeImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
      }
  
      
      const filePath = req.file.path;
  
      
      const formData = new FormData();
      formData.append('image', createReadStream(filePath)); // Add file stream
  
      
      const response = await axios.post('http://61.1.174.144:5000/recognize', formData, {
        headers: formData.getHeaders(), 
      });
  
      
      unlinkSync(filePath);
  
      
      const result = response.data;
     
      const matchedFaces = result.matched_names; 
      console.log(matchedFaces);
      if(matchedFaces){
        res.status(200).json({
            message: 'Recognition successful',
          
            matchedFaces,
          });
      }else{
        res.status(200).json({
            message: 'Image Not Recognized',
        })
      }
      
      
    } catch (error) {
      console.error('Error in recognition:', error.message);
      res.status(500).json({
        message: 'Error in recognition process',
        error: error.message,
      });
    }
  }

  module.exports = recognizeImage;
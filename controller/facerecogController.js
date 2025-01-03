const FaceModel = require("../model/faceRecogScheme")

const sendfacerecogDAta = async (req, res) => {
    try {
      const { matchedFaces } = req.body;
  
      if (!matchedFaces || !Array.isArray(matchedFaces)) {
        return res.status(400).json({ message: 'Invalid data format' });
      }
  
      
      const userId = req.user._id;
      const username = req.user.username;
  
      
      const updatedData = matchedFaces.map(face => ({
        branch: face.BRANCH,
        email: face.EMAIL_ADDRESS,
        gender: face.GENDER,
        idNumber: face.ID_NUMBER,
        name: face.NAME,
        phoneNumber: face.PHONE_NUMBER,
        year: face.YEAR,
        userId, 
        username:username,
      }));
  
      
      await FaceModel.insertMany(updatedData);
  
      res.status(201).json({ message: 'Data saved successfully', data: updatedData });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  const getFaceRecogData = async(req, res) =>{

    try {
        console.log("try block")
        const faceDataList = await FaceModel.find()
    
        
        const formattedData = faceDataList.map((faceData) => ({
          branch: faceData.branch,
          email: faceData.email,
          gender: faceData.gender,
          idNumber: faceData.idNumber,
          name: faceData.name,
          phoneNumber: faceData.phoneNumber,
          year: faceData.year,
          userId: faceData.userId, 
          username: faceData.username 
        }));
    
        return res.status(200).json({formattedData});
      } catch (error) {
        console.error('Error fetching all face data:', error);
        return { message: 'An error occurred while fetching all data' };
      }

}

  module.exports = {sendfacerecogDAta, getFaceRecogData}
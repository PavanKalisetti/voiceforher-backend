const File = require("../model/fileModel");


const uploadFile = async (req, res) => {
    try {
      const { image, video, audio } = req.files;
      const userId = req.user._id; 
  
      const newFile = new File({
        name: req.body.name,
        userId,  
        image: image
          ? {
              data: image[0].buffer,
              contentType: image[0].mimetype,
            }
          : undefined,
        video: video
          ? {
              data: video[0].buffer,
              contentType: video[0].mimetype,
            }
          : undefined,
        audio: audio
          ? {
              data: audio[0].buffer,
              contentType: audio[0].mimetype,
            }
          : undefined,
      });
  
      await newFile.save();
      res.status(200).send("Files uploaded successfully!");
    } catch (error) {
      res.status(500).send("Error uploading files: " + error.message);
    }
  };
  


const getFile = async (req, res) => {
  try {
    const { id, type } = req.params;

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).send("File not found!");
    }

    if (!file[type]) {
      return res.status(404).send(`${type} not found in this document!`);
    }

    res.set("Content-Type", file[type].contentType);
    res.send(file[type].data);
  } catch (error) {
    res.status(500).send("Error retrieving file: " + error.message);
  }
};

module.exports = {uploadFile, getFile}

require('dotenv').config();
require('express-async-errors');

const express = require('express');
const multer = require("multer");
const app = express();
const authRoute = require("./routes/authRoute")
const complaintRoute = require("./routes/complaintRoute")
const profilesRoute = require("./routes/profilesRoute")
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require("./db/connect")
const fileRoutes = require('./routes/fileRoutes')
const counsellingRoutes = require("./routes/counsellingRoutes");
const recognizeImage = require("./controller/ImageRecogController");
const {authenticationMiddleware} = require("./middleware/auth")
const {sendfacerecogDAta, getFaceRecogData} = require("./controller/facerecogController");
// Configure multer to handle file uploads
const upload = multer({
  dest: '/tmp', 
});


// middleware
// app.use(express.static('./public'));
app.use(express.json());
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/complaint",complaintRoute)
app.use("/api/v1/profiles",profilesRoute)
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/counselling", counsellingRoutes);
app.post('/recognize-face', upload.single('image'), recognizeImage)
app.post('/saveMatchedFace', authenticationMiddleware, sendfacerecogDAta);
app.get('/getrecogdata',getFaceRecogData)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();

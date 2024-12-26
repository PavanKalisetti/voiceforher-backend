require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const authRoute = require("./routes/authRoute")
const complaintRoute = require("./routes/complaintRoute")
const profilesRoute = require("./routes/profilesRoute")
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require("./db/connect")
const fileRoutes = require('./routes/fileRoutes')

// middleware
// app.use(express.static('./public'));
app.use(express.json());
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/complaint",complaintRoute)
app.use("/api/v1/profiles",profilesRoute)
app.use("/api/v1/files", fileRoutes);
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

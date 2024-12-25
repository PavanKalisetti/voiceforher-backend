const express = require("express");
const app = express.Router();
const {getUserProfile,getAllUserProfile} = require("../controller/userProfileController");
const {authenticationMiddleware} = require("../middleware/auth")

app.route('/getprofile').get(authenticationMiddleware, getUserProfile);
app.route('/allprofiles').get(authenticationMiddleware, getAllUserProfile);



module.exports = app
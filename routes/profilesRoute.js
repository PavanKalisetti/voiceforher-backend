const express = require("express");
const app = express.Router();
const {getUserProfile,getAllUserProfile,approveUser} = require("../controller/userProfileController");
const {authenticationMiddleware} = require("../middleware/auth")

app.route('/getprofile').get(authenticationMiddleware, getUserProfile);
app.route('/allprofiles').get(authenticationMiddleware, getAllUserProfile);
app.route('/allprofiles/:userId').put(authenticationMiddleware, approveUser);





module.exports = app
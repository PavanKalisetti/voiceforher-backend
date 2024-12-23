const express = require("express");
const app = express.Router();
const raiseComplaintController = require("../controller/complaintController");
const {authenticationMiddleware} = require("../middleware/auth")

app.route('/raiseComplaint').post(authenticationMiddleware, raiseComplaintController);



module.exports = app
const express = require("express");
const app = express.Router();
const {raiseComplaintController, fetchComplaintsController, markComplaintAsSolved} = require("../controller/complaintController");
const {authenticationMiddleware} = require("../middleware/auth")

app.route('/raiseComplaint').post(authenticationMiddleware, raiseComplaintController)
;
app.route('/fetchComplaint').get(authenticationMiddleware, fetchComplaintsController);

app.route('/complaints/:complaintId/mark-as-solved').put(authenticationMiddleware, markComplaintAsSolved);


module.exports = app
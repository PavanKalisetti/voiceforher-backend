const express = require("express");
const { createCounsellingRequest, getCounsellingRequests } = require("../controller/counsellingController");
const { authenticationMiddleware } = require("../middleware/auth");

const router = express.Router();

// Route to create a counselling request for the girl user
router.post("/counselling", authenticationMiddleware, createCounsellingRequest);

// Route to get all counselling requests for the authenticated user
router.get("/counselling", authenticationMiddleware, getCounsellingRequests);

module.exports = router;

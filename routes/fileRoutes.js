
const express = require("express")
const multer = require("multer");
const { memoryStorage } = require("multer");

const { uploadFile, getFile } = require("../controller/fileController");

const router = express.Router();

// File upload setup using multer
const storage = memoryStorage();
const upload = multer({ storage });

// Define fields for different file types
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "audio", maxCount: 1 },
]);

// Routes for file upload and retrieval
router.post("/upload", uploadFields, uploadFile);
router.get("/:id/:type", getFile);

module.exports = router;

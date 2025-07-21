// routes/upload.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No file received in request.");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📥 File received:", req.file);

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "airbnb-clone",
    });

    console.log("✅ Cloudinary Upload Success:", result.secure_url);

    // Cleanup local file
    fs.unlinkSync(req.file.path);
    console.log("🧹 Temp file deleted:", req.file.path);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;

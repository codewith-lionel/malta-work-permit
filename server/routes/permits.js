const express = require("express");
const router = express.Router();
const multer = require("multer");
const permitController = require("../controllers/permitController");

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), permitController.createPermit);
router.get("/status", permitController.getPermitByQuery);
router.get("/:id", permitController.getPermit);
router.delete("/:id", permitController.deletePermit);

module.exports = router;

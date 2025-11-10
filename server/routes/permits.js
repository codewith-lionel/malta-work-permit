const express = require("express");
const router = express.Router();
const multer = require("multer");
const { body } = require("express-validator");

const permitController = require("../controllers/permitController");
const { handleValidation } = require("../middleware/validate");

// Use memory storage so we can send buffer to GridFS
const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// Validation for create
const createValidators = [
  body("fullName").notEmpty().withMessage("fullName is required"),
  body("passportNumber").notEmpty().withMessage("passportNumber is required"),
];

// Routes
router.get("/", permitController.listPermits);
router.post(
  "/",
  upload.single("image"),
  createValidators,
  handleValidation,
  permitController.createPermit
);
router.get("/status", permitController.getPermitByQuery);
router.get("/:id", permitController.getPermit);
router.patch("/:id", permitController.updatePermit);
router.delete("/:id", permitController.deletePermit);

module.exports = router;

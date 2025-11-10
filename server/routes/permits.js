const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const permitController = require("../controllers/permitController");
const { body } = require("express-validator");
const { handleValidation } = require("../middleware/validate");

// Multer storage (store files under server/uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, safeName);
  },
});
const upload = multer({ storage });

// Validation for create (JSON or form-data)
const createValidators = [
  body("fullName").notEmpty().withMessage("fullName is required"),
  body("passportNumber").notEmpty().withMessage("passportNumber is required"),
];

// LIST /api/permits (optional: q, page, limit)
router.get("/", permitController.listPermits);

// POST create (accepts multipart/form-data with optional 'image' field)
router.post(
  "/",
  upload.single("image"),
  createValidators,
  handleValidation,
  permitController.createPermit
);

// GET status search
router.get("/status", permitController.getPermitByQuery);

// GET by id
router.get("/:id", permitController.getPermit);

// PATCH update permit
router.patch("/:id", permitController.updatePermit);

// DELETE by id
router.delete("/:id", permitController.deletePermit);

module.exports = router;

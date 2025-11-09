const Permit = require("../models/Permit");
const path = require("path");

/**
 * Generate a Work Permit ID like: WP-MTA-2025-<6digits>
 */
function generateWorkPermitID() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `WP-MTA-${year}-${suffix}`;
}

/**
 * Create a new permit with optional image
 */
exports.createPermit = async (req, res) => {
  try {
    const {
      fullName,
      passportNumber,
      nationality,
      dateOfBirth,
      employer,
      jobTitle,
      permitStartDate,
      permitExpiryDate,
    } = req.body;

    if (!fullName || !passportNumber) {
      return res
        .status(400)
        .json({ message: "fullName and passportNumber are required" });
    }

    // Generate unique workPermitId
    let workPermitId;
    let attempts = 0;
    while (!workPermitId && attempts < 5) {
      attempts++;
      const candidate = generateWorkPermitID();
      const exists = await Permit.findOne({ workPermitId: candidate }).lean();
      if (!exists) workPermitId = candidate;
    }

    if (!workPermitId) {
      return res
        .status(500)
        .json({ message: "Failed to generate unique Work Permit ID" });
    }

    // Handle uploaded image
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const permit = new Permit({
      workPermitId,
      fullName,
      passportNumber,
      nationality,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      employer,
      jobTitle,
      permitStartDate: permitStartDate ? new Date(permitStartDate) : undefined,
      permitExpiryDate: permitExpiryDate
        ? new Date(permitExpiryDate)
        : undefined,
      status: "Pending",
      image: imagePath,
    });

    await permit.save();

    return res.status(201).json({ permit });
  } catch (err) {
    console.error("createPermit error", err);
    if (err.name === "MongoServerError" && err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Duplicate key error", details: err.keyValue });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get permit by Work Permit ID or Passport Number
 */
exports.getPermitByQuery = async (req, res) => {
  try {
    const q = (req.query.query || "").trim();
    if (!q)
      return res.status(400).json({ message: "query parameter is required" });

    const permit = await Permit.findOne({
      $or: [{ workPermitId: q }, { passportNumber: q }],
    }).lean();

    if (!permit) return res.status(404).json({ message: "Permit not found" });

    return res.json({ permit });
  } catch (err) {
    console.error("getPermitByQuery error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get permit by Work Permit ID
 */
exports.getPermit = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "id required" });

    const permit = await Permit.findOne({ workPermitId: id }).lean();
    if (!permit) return res.status(404).json({ message: "Permit not found" });

    return res.json({ permit });
  } catch (err) {
    console.error("getPermit error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete permit by Work Permit ID
 */
exports.deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Permit.findOneAndDelete({ workPermitId: id });
    if (!deleted) {
      return res.status(404).json({ message: "Permit not found" });
    }
    return res.json({ message: "Permit deleted successfully" });
  } catch (err) {
    console.error("deletePermit error", err);
    return res.status(500).json({ message: "Failed to delete permit" });
  }
};

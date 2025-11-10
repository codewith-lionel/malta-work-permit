const fs = require("fs");
const path = require("path");
const Permit = require("../models/Permit");

/**
 * Generate unique Work Permit ID like WP-MTA-2025-123456
 */
function generateWorkPermitID() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(100000 + Math.random() * 900000); // 6 digits
  return `WP-MTA-${year}-${suffix}`;
}

/**
 * POST /api/permits
 * Accepts JSON or multipart/form-data (field 'image' for file)
 */
exports.createPermit = async (req, res) => {
  try {
    // Debug logs to help diagnose issues (safe to remove in production)
    console.log("--- createPermit called ---");
    console.log("content-type:", req.headers["content-type"]);
    console.log("req.body keys:", Object.keys(req.body || {}));
    console.log("req.body:", req.body);
    if (req.file) {
      console.log("req.file:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      });
    } else {
      console.log("req.file: <no file>");
    }

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
    for (let attempts = 0; attempts < 6 && !workPermitId; attempts++) {
      const candidate = generateWorkPermitID();
      // eslint-disable-next-line no-await-in-loop
      const exists = await Permit.findOne({ workPermitId: candidate }).lean();
      if (!exists) workPermitId = candidate;
    }
    if (!workPermitId)
      return res
        .status(500)
        .json({ message: "Failed to generate unique Work Permit ID" });

    const permitData = {
      workPermitId,
      fullName: String(fullName).trim(),
      passportNumber: String(passportNumber).trim(),
      nationality: nationality ? String(nationality).trim() : null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      employer: employer ? String(employer).trim() : null,
      jobTitle: jobTitle ? String(jobTitle).trim() : null,
      permitStartDate: permitStartDate ? new Date(permitStartDate) : null,
      permitExpiryDate: permitExpiryDate ? new Date(permitExpiryDate) : null,
      status: "Pending",
    };

    // If file uploaded, store relative URL like /uploads/filename
    if (req.file && req.file.path) {
      const rel = `/${path
        .relative(path.join(__dirname, ".."), req.file.path)
        .replace(/\\/g, "/")}`;
      permitData.image = rel;
    }

    const permit = await Permit.create(permitData);

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
 * GET /api/permits/status?query=
 * Lookup by workPermitId OR passportNumber
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
 * GET /api/permits/:id
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
 * GET /api/permits
 * List permits with optional q search and pagination.
 * Query params: q (search), page (default 1), limit (default 20)
 */
exports.listPermits = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit || "20", 10))
    );
    const skip = (page - 1) * limit;

    const filter = {};
    if (q) {
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { fullName: re },
        { passportNumber: re },
        { employer: re },
        { jobTitle: re },
      ];
    }

    const [total, permits] = await Promise.all([
      Permit.countDocuments(filter),
      Permit.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return res.json({ data: permits, page, limit, total });
  } catch (err) {
    console.error("listPermits error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/permits/:id
 * Update a permit (whitelisted fields).
 */
exports.updatePermit = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "id required" });

    const allowed = [
      "fullName",
      "passportNumber",
      "nationality",
      "dateOfBirth",
      "employer",
      "jobTitle",
      "permitStartDate",
      "permitExpiryDate",
      "status",
    ];

    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    // convert dates if provided
    if (updates.dateOfBirth)
      updates.dateOfBirth = new Date(updates.dateOfBirth);
    if (updates.permitStartDate)
      updates.permitStartDate = new Date(updates.permitStartDate);
    if (updates.permitExpiryDate)
      updates.permitExpiryDate = new Date(updates.permitExpiryDate);

    const updated = await Permit.findOneAndUpdate(
      { workPermitId: id },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    if (!updated) return res.status(404).json({ message: "Permit not found" });

    return res.json({ permit: updated });
  } catch (err) {
    console.error("updatePermit error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/permits/:id
 */
exports.deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id required" });

    const deleted = await Permit.findOneAndDelete({ workPermitId: id }).lean();
    if (!deleted) return res.status(404).json({ message: "Permit not found" });

    // Cleanup uploaded files if present
    try {
      if (deleted.image && typeof deleted.image === "string") {
        const filePath = path.join(
          __dirname,
          "..",
          deleted.image.replace(/^\//, "")
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Removed uploaded file:", filePath);
        }
      }
      if (Array.isArray(deleted.documents)) {
        deleted.documents.forEach((doc) => {
          if (!doc) return;
          const maybe = doc.url || doc.filename;
          if (!maybe) return;
          if (maybe.includes("/uploads/") || maybe.includes("uploads/")) {
            const local = path.join(__dirname, "..", maybe.replace(/^\//, ""));
            if (fs.existsSync(local)) {
              try {
                fs.unlinkSync(local);
              } catch (e) {
                console.warn(e.message);
              }
            }
          }
        });
      }
    } catch (fileErr) {
      console.warn("Error cleaning up files for permit", id, fileErr.message);
    }

    return res.json({
      message: "Permit deleted successfully",
      permit: deleted,
    });
  } catch (err) {
    console.error("deletePermit error", err);
    return res.status(500).json({ message: "Failed to delete permit" });
  }
};

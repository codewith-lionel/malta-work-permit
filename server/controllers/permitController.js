const { GridFSBucket, ObjectId } = require("mongodb");
const path = require("path");
const Permit = require("../models/Permit");
const mongoose = require("mongoose");

/**
 * Helper: get GridFS bucket (lazy)
 */
function getGridFSBucket() {
  if (!mongoose.connection?.db) {
    throw new Error("Mongo connection not ready");
  }
  return new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
}

/**
 * Upload buffer to GridFS, return file id (as string)
 */
function uploadBufferToGridFS(buffer, originalName, mimetype) {
  return new Promise((resolve, reject) => {
    try {
      const bucket = getGridFSBucket();
      const safeName = `${Date.now()}-${originalName.replace(/\s+/g, "_")}`;
      const uploadStream = bucket.openUploadStream(safeName, {
        contentType: mimetype,
      });

      uploadStream.end(buffer);

      uploadStream.on("finish", (file) => {
        // file._id is the ObjectId
        resolve(String(file._id));
      });
      uploadStream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Delete a GridFS file by id (string or ObjectId)
 */
function deleteGridFSFile(id) {
  return new Promise((resolve, reject) => {
    try {
      const bucket = getGridFSBucket();
      const _id = typeof id === "string" ? new ObjectId(id) : id;
      bucket.delete(_id, (err) => {
        if (err) {
          // If file not found, just resolve
          if (err.message && err.message.indexOf("FileNotFound") !== -1)
            return resolve();
          return reject(err);
        }
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

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
 * Accepts multipart/form-data with optional 'image' file (in req.file.buffer)
 */
exports.createPermit = async (req, res) => {
  try {
    console.log("--- createPermit called ---");
    console.log("content-type:", req.headers["content-type"]);
    console.log("req.body keys:", Object.keys(req.body || {}));
    console.log("req.file present?", !!req.file);
    if (req.file) {
      console.log("req.file meta:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
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

    // If file uploaded, upload buffer to GridFS and store pointer
    if (req.file && req.file.buffer) {
      try {
        const fileId = await uploadBufferToGridFS(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        // Save an API path pointer for this file: client will request /api/uploads/:id
        permitData.image = `/api/uploads/${fileId}`; // store path pointing to our download endpoint
        // Optionally, also store raw fileId: permitData.imageFileId = fileId;
      } catch (uploadErr) {
        console.error("Failed to upload to GridFS", uploadErr);
        return res.status(500).json({ message: "Failed to upload image" });
      }
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
 * GET /api/permits/status?query=...
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
 * LIST /api/permits
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
 * Removes permit and any GridFS file referenced in permit.image (if it is /api/uploads/:fileId)
 */
exports.deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id required" });

    const deleted = await Permit.findOneAndDelete({ workPermitId: id }).lean();
    if (!deleted) return res.status(404).json({ message: "Permit not found" });

    // Cleanup GridFS if image pointer indicates our /api/uploads/:id pattern
    try {
      if (deleted.image && typeof deleted.image === "string") {
        const m = deleted.image.match(/\/api\/uploads\/([0-9a-fA-F]{24})$/);
        if (m) {
          const fileId = m[1];
          try {
            await deleteGridFSFile(fileId);
            console.log("Deleted GridFS file", fileId);
          } catch (e) {
            console.warn("Failed to delete GridFS file", fileId, e.message);
          }
        }
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

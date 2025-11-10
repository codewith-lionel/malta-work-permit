const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { GridFSBucket, ObjectId } = require("mongodb");

/**
 * GET /api/uploads/:id
 * Streams a GridFS file by ObjectId
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).send("id required");

    if (!mongoose.connection?.db) {
      return res.status(500).send("Mongo not connected");
    }

    const _id = new ObjectId(id);
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    // Find file metadata first to set content type and proper headers
    const filesColl = mongoose.connection.db.collection("uploads.files");
    const fileDoc = await filesColl.findOne({ _id });
    if (!fileDoc) return res.status(404).send("File not found");

    res.setHeader(
      "Content-Type",
      fileDoc.contentType || "application/octet-stream"
    );
    // optionally set caching headers:
    res.setHeader("Cache-Control", "public, max-age=31536000");

    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.on("error", (err) => {
      console.error("GridFS download error", err);
      return res.status(500).end();
    });
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Error streaming GridFS file", err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;

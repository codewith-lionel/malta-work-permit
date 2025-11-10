const mongoose = require("mongoose");

const PermitSchema = new mongoose.Schema(
  {
    workPermitId: { type: String, unique: true, required: true, index: true },
    fullName: { type: String, required: true },
    passportNumber: { type: String, required: true, index: true },
    nationality: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    employer: { type: String, default: null },
    jobTitle: { type: String, default: null },
    permitStartDate: { type: Date, default: null },
    permitExpiryDate: { type: Date, default: null },
    applicationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    // stored relative path, e.g. /uploads/1660000000000-photo.jpg
    image: { type: String, default: null },
    documents: [{ filename: String, url: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Permit", PermitSchema);

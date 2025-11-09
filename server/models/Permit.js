const mongoose = require("mongoose");

const PermitSchema = new mongoose.Schema({
  workPermitId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  passportNumber: { type: String, required: true },
  nationality: { type: String },
  dateOfBirth: { type: Date },
  employer: { type: String },
  jobTitle: { type: String },
  permitStartDate: { type: Date },
  permitExpiryDate: { type: Date },
  status: { type: String, default: "Pending" },
}, { timestamps: true });


module.exports = mongoose.model("Permit", PermitSchema);

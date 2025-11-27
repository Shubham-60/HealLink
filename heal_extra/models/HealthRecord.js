const mongoose = require("mongoose");

// HealthRecord: Represents a single medical record entry owned by a user.
// Minimal fields now; can be extended later (attachments, doctor, tags, etc.).
const HealthRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["general", "lab", "prescription", "immunization"], default: "general" },
    recordDate: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", HealthRecordSchema);

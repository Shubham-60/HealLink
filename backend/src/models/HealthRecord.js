const mongoose = require("mongoose");

// HealthRecord: Represents a single medical record entry owned by a user.
const HealthRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember", required: true },
    title: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["Checkup", "Prescription", "Vaccination", "Lab Result", "Surgery", "Imaging", "Other"],
      default: "Other"
    },
    doctor: { type: String, default: "" },
    recordDate: { type: Date, required: true },
    notes: { type: String, default: "" },
    files: [{
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", HealthRecordSchema);

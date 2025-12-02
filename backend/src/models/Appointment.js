const mongoose = require("mongoose");

// Appointment: Basic scheduling model for user checkups.
const AppointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    member: { type: mongoose.Schema.Types.ObjectId, ref: "FamilyMember", required: true },
    doctor: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);

const mongoose = require("mongoose");

const FamilyMemberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    relationship: { 
      type: String, 
      enum: ["Self", "Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Grandfather", "Grandmother", "Other"],
      required: true 
    },
    // Optional to allow creating the user's own member at signup
    dateOfBirth: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyMember", FamilyMemberSchema);

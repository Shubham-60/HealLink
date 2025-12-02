const FamilyMember = require("../models/FamilyMember.js");

// Create a new family member
const createMember = async (req, res) => {
  try {
    const { name, relationship, dateOfBirth } = req.body;
    
    if (!name || !relationship || !dateOfBirth) {
      return res.status(400).json({ message: "Name, relationship, and date of birth are required" });
    }

    const member = await FamilyMember.create({
      user: req.user._id,
      name,
      relationship,
      dateOfBirth,
    });

    res.status(201).json({ message: "Family member added", member });
  } catch (err) {
    console.error("Create member error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all family members for current user
const getMembers = async (req, res) => {
  try {
    const members = await FamilyMember.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json({ members });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single family member
const getMember = async (req, res) => {
  try {
    const member = await FamilyMember.findOne({ _id: req.params.id, user: req.user._id });
    if (!member) return res.status(404).json({ message: "Family member not found" });
    res.status(200).json({ member });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update family member
const updateMember = async (req, res) => {
  try {
    const { name, relationship, dateOfBirth } = req.body;
    
    const updated = await FamilyMember.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, relationship, dateOfBirth },
      { new: true }
    );
    
    if (!updated) return res.status(404).json({ message: "Family member not found" });
    res.status(200).json({ message: "Family member updated", member: updated });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete family member
const deleteMember = async (req, res) => {
  try {
    const deleted = await FamilyMember.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Family member not found" });
    res.status(200).json({ message: "Family member deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createMember, getMembers, getMember, updateMember, deleteMember };

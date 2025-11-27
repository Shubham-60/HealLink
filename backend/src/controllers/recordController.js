const HealthRecord = require("../models/HealthRecord.js");

// Create a new health record
const createRecord = async (req, res) => {
  try {
    const { title, type, recordDate, notes } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const record = await HealthRecord.create({
      user: req.user._id,
      title,
      type: type || "general",
      recordDate: recordDate || Date.now(),
      notes: notes || "",
    });
    res.status(201).json({ message: "Record created", record });
  } catch (err) {
    console.error("Create record error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all records for current user
const getRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user._id }).sort({ recordDate: -1 });
    res.status(200).json({ records });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single record
const getRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({ _id: req.params.id, user: req.user._id });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ record });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update record
const updateRecord = async (req, res) => {
  try {
    const updated = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record updated", record: updated });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete record
const deleteRecord = async (req, res) => {
  try {
    const deleted = await HealthRecord.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createRecord, getRecords, getRecord, updateRecord, deleteRecord };

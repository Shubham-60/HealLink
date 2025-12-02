const HealthRecord = require("../models/HealthRecord.js");

// Create a new health record
const createRecord = async (req, res) => {
  try {
    const { title, type, member, doctor, recordDate, notes } = req.body;
    
    if (!title || !member || !recordDate) {
      return res.status(400).json({ message: "Title, member, and record date are required" });
    }
    
    const record = await HealthRecord.create({
      user: req.user._id,
      member,
      title,
      type: type || "Other",
      doctor: doctor || "",
      recordDate,
      notes: notes || "",
      files: [] // TODO: Add file upload handling with multer
    });
    
    const populated = await HealthRecord.findById(record._id).populate('member', 'name relationship');
    res.status(201).json({ message: "Record created", record: populated });
  } catch (err) {
    console.error("Create record error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all records for current user
const getRecords = async (req, res) => {
  try {
    const { search, member, sort, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { user: req.user._id };
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { doctor: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Member filter
    if (member && member !== 'all') {
      query.member = member;
    }
    
    // Determine sort order
    let sortOption = { recordDate: -1 }; // Default: newest first
    if (sort === 'oldest') {
      sortOption = { recordDate: 1 };
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination
    const total = await HealthRecord.countDocuments(query);
    
    // Fetch records with filters, sorting, and pagination
    const records = await HealthRecord.find(query)
      .populate('member', 'name relationship')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);
    
    res.status(200).json({ 
      records,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error("Get records error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single record
const getRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({ _id: req.params.id, user: req.user._id })
      .populate('member', 'name relationship dateOfBirth');
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ record });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update record
const updateRecord = async (req, res) => {
  try {
    const { title, type, member, doctor, recordDate, notes } = req.body;
    
    const updated = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, type, member, doctor, recordDate, notes },
      { new: true }
    ).populate('member', 'name relationship');
    
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

const Appointment = require("../models/Appointment.js");

// Create appointment
const createAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, notes } = req.body;
    if (!doctor || !appointmentDate) {
      return res.status(400).json({ message: "Doctor and appointmentDate are required" });
    }
    const appt = await Appointment.create({
      user: req.user._id,
      doctor,
      appointmentDate,
      notes: notes || "",
    });
    res.status(201).json({ message: "Appointment created", appointment: appt });
  } catch (err) {
    console.error("Create appointment error", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get appointments for user
const getAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find({ user: req.user._id }).sort({ appointmentDate: 1 });
    res.status(200).json({ appointments: appts });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment updated", appointment: updated });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createAppointment, getAppointments, updateAppointment, deleteAppointment };

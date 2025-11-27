const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { createAppointment, getAppointments, updateAppointment, deleteAppointment } = require("../controllers/appointmentController.js");

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createAppointment)
  .get(getAppointments);

router.route("/:id")
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;

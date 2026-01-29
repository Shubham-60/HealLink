const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { createRecord, getRecords, getRecord, updateRecord, deleteRecord, deleteRecordFiles } = require("../controllers/recordController.js");

const router = express.Router();

router.use(protect); // all routes protected

router.route("/")
  .post(createRecord)
  .get(getRecords);

router.route("/:id")
  .get(getRecord)
  .put(updateRecord)
  .delete(deleteRecord);

router.route("/:id/files/delete")
  .post(deleteRecordFiles);

module.exports = router;

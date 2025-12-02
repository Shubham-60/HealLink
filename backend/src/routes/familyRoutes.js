const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { createMember, getMembers, getMember, updateMember, deleteMember } = require("../controllers/familyController.js");

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createMember)
  .get(getMembers);

router.route("/:id")
  .get(getMember)
  .put(updateMember)
  .delete(deleteMember);

module.exports = router;

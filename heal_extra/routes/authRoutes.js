const express = require("express");
const { signup, login, logout, getProfile } = require("../controllers/authController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected Route (requires valid JWT cookie)
router.get("/me", protect, getProfile);

module.exports = router;
const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { register, login, getProfile, updateProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getProfile);
router.put("/me", requireAuth, updateProfile);

module.exports = router;

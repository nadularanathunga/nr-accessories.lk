const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { register, login, getProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getProfile);

module.exports = router;

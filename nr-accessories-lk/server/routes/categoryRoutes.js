const express = require("express");
const router = express.Router();
const { getCategories, createCategory } = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", createCategory); // TODO: protect with an admin-only middleware later

module.exports = router;

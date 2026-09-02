const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { getCart, addItem, updateItem, removeItem } = require("../controllers/cartController");

router.use(requireAuth); // every cart route requires a logged-in user

router.get("/", getCart);
router.post("/add", addItem);
router.put("/update", updateItem);
router.delete("/remove/:productId", removeItem);

module.exports = router;

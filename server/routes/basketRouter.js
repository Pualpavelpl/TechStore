const express = require("express");
const router = express.Router();
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/device", authMiddleware, basketController.addDevice);
router.get("/", authMiddleware, basketController.getBasket);
router.delete("/device", authMiddleware, basketController.removeDevice);

module.exports = router;

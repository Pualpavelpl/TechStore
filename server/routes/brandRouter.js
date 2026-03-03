const express = require("express");
const brandController = require("../controllers/brandController");
const router = express.Router();

router.post("/", brandController.create);

router.get("/", brandController.getAll);

module.exports = router;

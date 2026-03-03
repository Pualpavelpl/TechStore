const express = require("express");
const deviceController = require("../controllers/deviceController");
const router = express.Router();

router.post("/", deviceController.create);

router.get("/", deviceController.getAll);

router.get("/:id", deviceController.getOne);

router.put("/:id", deviceController.update);

module.exports = router;

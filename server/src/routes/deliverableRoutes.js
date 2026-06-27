const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  uploadDeliverable,
  getDeliverables,
} = require("../controllers/deliverableController");

router.post("/", protect, uploadDeliverable);

router.get("/:projectId", protect, getDeliverables);

module.exports = router;
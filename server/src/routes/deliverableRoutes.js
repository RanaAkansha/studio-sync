const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  uploadDeliverable,
  getDeliverables,
  deleteDeliverable,
} = require("../controllers/deliverableController");

router.post("/", protect, uploadDeliverable);
router.get("/", protect, getDeliverables);
router.delete("/:id", protect, deleteDeliverable);

module.exports = router;
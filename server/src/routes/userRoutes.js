const express = require("express");
const router = express.Router();

const { getClients } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/clients", protect, getClients);

module.exports = router;
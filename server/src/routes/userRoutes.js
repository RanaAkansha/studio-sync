const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

module.exports = router;

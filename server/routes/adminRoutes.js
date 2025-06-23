const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminMiddleware");
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  promoteUser,
  getAllConversions,
  deleteConversion,
} = require("../controllers/adminController");

router.get("/dashboard", adminAuth, getDashboardStats);
router.get("/users", adminAuth, getAllUsers);
router.delete("/user/:userId", adminAuth, deleteUser);
router.patch("/user/promote/:userId", adminAuth, promoteUser);

router.get("/conversions", adminAuth, getAllConversions);
router.delete("/conversion/:id", adminAuth, deleteConversion);

module.exports = router;

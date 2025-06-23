const User = require("../models/User");
const Conversion = require("../models/Conversion");

// Admin Dashboard Overview
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalConversions = await Conversion.countDocuments();
    const latestConversions = await Conversion.find().sort({ createdAt: -1 }).limit(5).populate("userId", "email");

    res.json({ totalUsers, totalConversions, latestConversions });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard", error: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users", error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

// Promote user to admin
exports.promoteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { role: "admin" }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to promote user", error: err.message });
  }
};

// Get all conversions
exports.getAllConversions = async (req, res) => {
  try {
    const conversions = await Conversion.find().populate("userId", "email").sort({ createdAt: -1 });
    res.json(conversions);
  } catch (err) {
    res.status(500).json({ message: "Failed to load conversions", error: err.message });
  }
};

// Delete a specific conversion
exports.deleteConversion = async (req, res) => {
  try {
    await Conversion.findByIdAndDelete(req.params.id);
    res.json({ message: "Conversion deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete conversion", error: err.message });
  }
};

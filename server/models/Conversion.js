const mongoose = require("mongoose");

const conversionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sourceLang: String,
  targetLang: String,
  inputCode: String,
  convertedCode: String,
}, { timestamps: true });

module.exports = mongoose.model("Conversion", conversionSchema);

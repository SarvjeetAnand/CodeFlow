const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { convertCode, getHistory } = require("../controllers/codeController");

router.post("/convert", auth, convertCode);
router.get("/history", auth, getHistory);

module.exports = router;

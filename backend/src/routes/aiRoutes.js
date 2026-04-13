const express = require("express");
const router = express.Router();
const { generateEssay, generatePoem } = require("../controllers/aiController");

router.post("/essay", generateEssay);
router.post("/poem", generatePoem);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getReports,
  exportReports,
} = require("../controllers/reportController");

router.get("/", getReports);
router.get("/export", exportReports);

module.exports = router;
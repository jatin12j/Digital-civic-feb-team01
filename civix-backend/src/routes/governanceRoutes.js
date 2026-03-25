const express = require("express");
const router = express.Router();

const {
  getPetitions,
  respondToPetition,
} = require("../controllers/governanceController");

const { protect } = require("../middleware/authMiddleware");
const { isOfficial } = require("../middleware/roleMiddleware");

router.get("/petitions", protect, isOfficial, getPetitions);
router.post("/petitions/:id/respond", protect, isOfficial, respondToPetition);

module.exports = router;
const express = require("express");
const router = express.Router();
const { joinWaitlist, getWaitlist } = require("../controllers/waitlistController");

router.post("/", joinWaitlist);
router.get("/", getWaitlist);

module.exports = router;

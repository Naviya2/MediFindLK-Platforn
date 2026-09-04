const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

// Public — the Search page calls this for anyone, signed in or not.
router.post("/suggest", aiController.suggest);

module.exports = router;

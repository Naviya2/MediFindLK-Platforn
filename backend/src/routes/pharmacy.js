const express = require("express");
const router = express.Router();
const Pharmacy = require("../models/Pharmacy");
const Medicine = require("../models/Medicine");

// GET /api/search?medicine=xxx
// Case-insensitive partial match on medicine name.
// Returns pharmacies with ONLY the matching medicine(s) included.
router.get("/search", async (req, res) => {
  try {
    const { medicine } = req.query;

    if (!medicine || !medicine.trim()) {
      return res.status(400).json({ error: "medicine query param is required" });
    }

    const regex = new RegExp(medicine.trim(), "i");

    // Find all medicines matching query, and populate the pharmacy reference
    const medicines = await Medicine.find({ name: regex }).populate("pharmacy").lean();

    const results = medicines.map((m) => {
      if (!m.pharmacy) return null;
      
      return {
        pharmacyId: m.pharmacy._id,
        name: m.pharmacy.name,
        location: m.pharmacy.location,
        medicineId: m._id,
        medicine: m.name,
        status: m.status,
      };
    }).filter(Boolean); // Remove nulls

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pharmacies — all pharmacies, unfiltered.
router.get("/pharmacies", async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().lean();
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();

const Pharmacy = require("../models/Pharmacy");

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

    const pharmacies = await Pharmacy.find({ "medicines.name": regex }).lean();

    const results = pharmacies.map((p) => {
      const matches = p.medicines.filter((m) => regex.test(m.name));
      return matches.map((m) => ({
        pharmacyId: p._id,
        name: p.name,
        location: p.location,
        medicineId: m._id,
        medicine: m.name,
        status: m.status,
      }));
    });

    // Flatten: one entry per matching medicine.
    res.json(results.flat());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/pharmacy/:pharmacyId/medicine/:medicineId
// Updates the status of one medicine inside one pharmacy.
router.put("/pharmacy/:pharmacyId/medicine/:medicineId", async (req, res) => {
  try {
    const { pharmacyId, medicineId } = req.params;
    const { status } = req.body;

    const allowed = ["In Stock", "Low", "Out of Stock"];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ error: `status must be one of: ${allowed.join(", ")}` });
    }

    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    const medicine = pharmacy.medicines.id(medicineId);
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    medicine.status = status;
    await pharmacy.save();

    res.json(pharmacy);
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

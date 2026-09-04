const mongoose = require("mongoose");
const Pharmacy = require("../models/Pharmacy");

// GET /api/admin/pharmacies
exports.listPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().lean();
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// POST /api/admin/pharmacies
exports.createPharmacy = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Pharmacy name is required" });
    }

    const pharmacy = await Pharmacy.create({
      name: name.trim(),
      location: (location || "").trim(),
      medicines: [],
    });

    res.status(201).json(pharmacy);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// PUT /api/admin/pharmacies/:id
exports.updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid pharmacy ID" });
    }

    const { name, location } = req.body;
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ error: "Pharmacy name cannot be empty" });
    }

    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    if (name !== undefined) pharmacy.name = name.trim();
    if (location !== undefined) pharmacy.location = location.trim();
    await pharmacy.save();

    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// DELETE /api/admin/pharmacies/:id
exports.deletePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid pharmacy ID" });
    }

    const pharmacy = await Pharmacy.findByIdAndDelete(id);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    res.json({ ok: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// POST /api/admin/pharmacies/:id/medicines
exports.addMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid pharmacy ID" });
    }

    const { name, status } = req.body;
    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      return res.status(400).json({ error: "Medicine name is required" });
    }

    const normalisedStatus = status || "In Stock";
    if (!Pharmacy.STATUS_VALUES.includes(normalisedStatus)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${Pharmacy.STATUS_VALUES.join(", ")}`,
      });
    }

    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    pharmacy.medicines.push({ name: trimmedName, status: normalisedStatus });
    await pharmacy.save();

    res.status(201).json(pharmacy);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// PUT /api/admin/pharmacies/:id/medicines/:medicineId — admin override, can
// change the medicine's name and/or status directly.
exports.updateMedicine = async (req, res) => {
  try {
    const { id, medicineId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const { name, status } = req.body;
    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ error: "Medicine name cannot be empty" });
    }
    if (status !== undefined && !Pharmacy.STATUS_VALUES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${Pharmacy.STATUS_VALUES.join(", ")}`,
      });
    }

    const pharmacy = await Pharmacy.findOne({ _id: id, "medicines._id": medicineId });
    if (!pharmacy) {
      return res.status(404).json({ error: "Medicine not found in this pharmacy" });
    }

    const medicine = pharmacy.medicines.id(medicineId);
    if (name !== undefined) medicine.name = String(name).trim();
    if (status !== undefined) medicine.status = status;
    await pharmacy.save();

    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().lean();

    let totalMedicines = 0;
    let lowOrOutOfStock = 0;
    for (const pharmacy of pharmacies) {
      for (const medicine of pharmacy.medicines) {
        totalMedicines += 1;
        if (medicine.status !== "In Stock") lowOrOutOfStock += 1;
      }
    }

    res.json({
      totalPharmacies: pharmacies.length,
      totalMedicines,
      lowOrOutOfStock,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

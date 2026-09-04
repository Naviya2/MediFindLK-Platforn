const mongoose = require("mongoose");
const Pharmacy = require("../models/Pharmacy");

const STATUS_TO_SNAKE = {
  "In Stock": "in_stock",
  "Low Stock": "low_stock",
  "Out of Stock": "out_of_stock",
};
const SNAKE_TO_STATUS = {
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

// GET /api/search?medicine=xxx — public, case-insensitive partial match.
// Returns one row per matching medicine, across every pharmacy that has it.
exports.search = async (req, res) => {
  try {
    const { medicine } = req.query;
    if (!medicine || !medicine.trim()) {
      return res.status(400).json({ error: "medicine query param is required" });
    }

    const regex = new RegExp(medicine.trim(), "i");
    const pharmacies = await Pharmacy.find({ "medicines.name": regex }).lean();

    const results = pharmacies.flatMap((pharmacy) =>
      pharmacy.medicines
        .filter((m) => regex.test(m.name))
        .map((m) => ({
          id: `${pharmacy._id}-${m._id}`,
          pharmacyId: pharmacy._id,
          pharmacyName: pharmacy.name,
          address: pharmacy.location,
          medicineId: m._id,
          medicineName: m.name,
          status: STATUS_TO_SNAKE[m.status] || "unknown",
        })),
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// GET /api/critical-shortages — public. Returns all medicines that are low stock or out of stock.
exports.getCriticalShortages = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({
      "medicines.status": { $in: ["Low Stock", "Out of Stock"] }
    }).lean();

    const results = pharmacies.flatMap((pharmacy) =>
      pharmacy.medicines
        .filter((m) => ["Low Stock", "Out of Stock"].includes(m.status))
        .map((m) => ({
          id: `${pharmacy._id}-${m._id}`,
          pharmacyId: pharmacy._id,
          pharmacyName: pharmacy.name,
          address: pharmacy.location,
          medicineId: m._id,
          medicineName: m.name,
          status: STATUS_TO_SNAKE[m.status] || "unknown",
        }))
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// GET /api/pharmacies — public, unfiltered list.
exports.listPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().lean();
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// PUT /api/pharmacy/:pharmacyId/medicine/:medicineId — public "report a stock
// issue" endpoint. Anyone can submit a status correction; no auth required.
exports.reportStock = async (req, res) => {
  try {
    const { pharmacyId, medicineId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pharmacyId) || !mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const normalisedStatus = SNAKE_TO_STATUS[status] || status;
    if (!Pharmacy.STATUS_VALUES.includes(normalisedStatus)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${Pharmacy.STATUS_VALUES.join(", ")}`,
      });
    }

    const pharmacy = await Pharmacy.findOne({ _id: pharmacyId, "medicines._id": medicineId });
    if (!pharmacy) {
      return res.status(404).json({ error: "Medicine not found in this pharmacy" });
    }

    const medicine = pharmacy.medicines.id(medicineId);
    medicine.status = normalisedStatus;
    await pharmacy.save();

    res.json({ ok: true, pharmacyId, medicineId, status: normalisedStatus });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// GET /api/pharmacy/mine — protected, role "pharmacist". Uses the pharmacyId
// from the JWT, never from the request, so a pharmacist can only ever see
// their own pharmacy.
exports.getMine = async (req, res) => {
  try {
    if (!req.user.pharmacyId) {
      return res.status(403).json({ error: "No pharmacy is linked to this account" });
    }

    const pharmacy = await Pharmacy.findById(req.user.pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    res.json({
      pharmacy: { id: pharmacy._id, name: pharmacy.name, location: pharmacy.location },
      medicines: pharmacy.medicines.map((m) => ({ id: m._id, name: m.name, status: m.status })),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// POST /api/pharmacy/mine/medicine — protected, role "pharmacist". Adds a new
// medicine to the signed-in pharmacist's own pharmacy.
exports.addMineMedicine = async (req, res) => {
  try {
    if (!req.user.pharmacyId) {
      return res.status(403).json({ error: "No pharmacy is linked to this account" });
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

    const pharmacy = await Pharmacy.findById(req.user.pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    pharmacy.medicines.push({ name: trimmedName, status: normalisedStatus });
    await pharmacy.save();

    res.status(201).json({
      pharmacy: { id: pharmacy._id, name: pharmacy.name, location: pharmacy.location },
      medicines: pharmacy.medicines.map((m) => ({ id: m._id, name: m.name, status: m.status })),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// PUT /api/pharmacy/mine/medicine/:medicineId — protected, role "pharmacist".
// Same ownership guarantee as getMine: the pharmacy comes from the token.
exports.updateMineMedicine = async (req, res) => {
  try {
    if (!req.user.pharmacyId) {
      return res.status(403).json({ error: "No pharmacy is linked to this account" });
    }

    const { medicineId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ error: "Invalid medicine ID" });
    }
    if (!Pharmacy.STATUS_VALUES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${Pharmacy.STATUS_VALUES.join(", ")}`,
      });
    }

    const pharmacy = await Pharmacy.findOne({
      _id: req.user.pharmacyId,
      "medicines._id": medicineId,
    });
    if (!pharmacy) {
      return res.status(404).json({ error: "Medicine not found in your pharmacy" });
    }

    const medicine = pharmacy.medicines.id(medicineId);
    medicine.status = status;
    await pharmacy.save();

    res.json({
      pharmacy: { id: pharmacy._id, name: pharmacy.name, location: pharmacy.location },
      medicines: pharmacy.medicines.map((m) => ({ id: m._id, name: m.name, status: m.status })),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

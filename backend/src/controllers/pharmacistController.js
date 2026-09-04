const Medicine = require("../models/Medicine");
const Pharmacy = require("../models/Pharmacy");
const mongoose = require("mongoose");

exports.getPharmacyStock = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
      return res.status(400).json({ error: "Invalid pharmacy ID" });
    }

    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    const medicines = await Medicine.find({ pharmacy: pharmacyId });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.addMedicine = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { name, genericName, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
      return res.status(400).json({ error: "Invalid pharmacy ID" });
    }

    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    if (!name) {
      return res.status(400).json({ error: "Medicine name is required" });
    }

    let validStatus = "In Stock";
    if (status) {
      const allowedStatuses = ["In Stock", "Low Stock", "Out of Stock"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}` });
      }
      validStatus = status;
    }

    const medicine = new Medicine({
      name,
      genericName,
      pharmacy: pharmacyId,
      status: validStatus
    });

    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { pharmacyId, medicineId } = req.params;
    const { name, genericName, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pharmacyId) || !mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const medicine = await Medicine.findOne({ _id: medicineId, pharmacy: pharmacyId });
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found in this pharmacy" });
    }

    if (name) medicine.name = name;
    if (genericName !== undefined) medicine.genericName = genericName;
    
    if (status) {
      const allowedStatuses = ["In Stock", "Low Stock", "Out of Stock"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}` });
      }
      medicine.status = status;
    }
    
    medicine.lastUpdated = Date.now();
    await medicine.save();

    res.json(medicine);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const { pharmacyId, medicineId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pharmacyId) || !mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const medicine = await Medicine.findOneAndDelete({ _id: medicineId, pharmacy: pharmacyId });
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found in this pharmacy" });
    }

    res.json({ message: "Medicine deleted successfully", deletedMedicine: medicine });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Legacy method for backwards compatibility
exports.updateStockStatus = async (req, res) => {
  try {
    const { pharmacyId, medicineId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pharmacyId) || !mongoose.Types.ObjectId.isValid(medicineId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const allowedStatuses = ["In Stock", "Low Stock", "Out of Stock"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}` });
    }

    const medicine = await Medicine.findOne({ _id: medicineId, pharmacy: pharmacyId });
    if (!medicine) {
      return res.status(404).json({ error: "Medicine not found in this pharmacy" });
    }

    medicine.status = status;
    medicine.lastUpdated = Date.now();
    await medicine.save();

    res.json(medicine);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

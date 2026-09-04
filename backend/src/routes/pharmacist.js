const express = require("express");
const router = express.Router();
const pharmacistController = require("../controllers/pharmacistController");

// Get all medicines in a pharmacy
router.get("/pharmacy/:pharmacyId/medicines", pharmacistController.getPharmacyStock);

// Add a new medicine
router.post("/pharmacy/:pharmacyId/medicines", pharmacistController.addMedicine);

// Update a medicine (name, genericName, status)
router.put("/pharmacy/:pharmacyId/medicine/:medicineId", pharmacistController.updateMedicine);

// Delete a medicine
router.delete("/pharmacy/:pharmacyId/medicine/:medicineId", pharmacistController.deleteMedicine);

// Retaining this for backwards compatibility if the frontend strictly calls this for status updates
router.put("/pharmacy/:pharmacyId/medicine/:medicineId/status", pharmacistController.updateStockStatus);

module.exports = router;

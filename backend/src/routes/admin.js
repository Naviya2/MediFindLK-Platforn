const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

// Every route below requires a valid JWT with role "admin".
router.use(protect, authorize("admin"));

router.get("/pharmacies", adminController.listPharmacies);
router.post("/pharmacies", adminController.createPharmacy);
router.put("/pharmacies/:id", adminController.updatePharmacy);
router.delete("/pharmacies/:id", adminController.deletePharmacy);

router.post("/pharmacies/:id/medicines", adminController.addMedicine);
router.put("/pharmacies/:id/medicines/:medicineId", adminController.updateMedicine);

router.get("/stats", adminController.getStats);

module.exports = router;

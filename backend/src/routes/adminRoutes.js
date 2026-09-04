const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const {
    getDashboard,
    getPharmacies,
    createPharmacy,
    updatePharmacy,
    deletePharmacy,
    updatePharmacyStatus,
    getMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
    getPharmacists,
    updatePharmacistStatus,
    getStock,
} = require("../controllers/adminController");

// Apply authentication and ADMIN role check to all admin routes
router.use(verifyToken, requireRole("ADMIN"));

// 1. Dashboard
router.get("/dashboard", getDashboard);

// 2. Pharmacy Management
router.get("/pharmacies", getPharmacies);
router.post("/pharmacies", createPharmacy);
router.put("/pharmacies/:id", updatePharmacy);
router.delete("/pharmacies/:id", deletePharmacy);
router.put("/pharmacies/:id/status", updatePharmacyStatus);

// 3. Medicine Management
router.get("/medicines", getMedicines);
router.post("/medicines", createMedicine);
router.put("/medicines/:id", updateMedicine);
router.delete("/medicines/:id", deleteMedicine);

// 4. Pharmacist Management
router.get("/pharmacists", getPharmacists);
router.put("/pharmacists/:id/status", updatePharmacistStatus);

// 5. Stock Information
router.get("/stock", getStock);

module.exports = router;

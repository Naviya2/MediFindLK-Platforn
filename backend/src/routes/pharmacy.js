const express = require("express");
const router = express.Router();
const pharmacyController = require("../controllers/pharmacyController");
const { protect, authorize } = require("../middleware/auth");

// Public
router.get("/search", pharmacyController.search);
router.get("/pharmacies", pharmacyController.listPharmacies);

// Protected pharmacist routes — registered before the "/pharmacy/:pharmacyId/..."
// pattern below so "mine" is never captured as a :pharmacyId value.
router.get("/pharmacy/mine", protect, authorize("pharmacist"), pharmacyController.getMine);
router.post(
  "/pharmacy/mine/medicine",
  protect,
  authorize("pharmacist"),
  pharmacyController.addMineMedicine,
);
router.put(
  "/pharmacy/mine/medicine/:medicineId",
  protect,
  authorize("pharmacist"),
  pharmacyController.updateMineMedicine,
);

// Public "report a stock issue" endpoint (citizen-facing, no auth).
router.put("/pharmacy/:pharmacyId/medicine/:medicineId", pharmacyController.reportStock);

module.exports = router;

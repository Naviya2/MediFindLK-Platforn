const mongoose = require("mongoose");
const Pharmacy = require("../models/Pharmacy");
const Medicine = require("../models/Medicine");
const User = require("../models/User");
const Stock = require("../models/Stock");

// Helper to check valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ------------------- 1. Admin Dashboard -------------------

/**
 * GET /api/admin/dashboard
 * Returns overall system statistics and recent stock updates
 */
const getDashboard = async (req, res) => {
    try {
        const totalPharmacies = await Pharmacy.countDocuments();
        const totalMedicines = await Medicine.countDocuments();
        const totalPharmacists = await User.countDocuments({ role: "PHARMACIST" });
        const totalStockRecords = await Stock.countDocuments();

        const recentStockUpdates = await Stock.find()
            .sort({ updatedAt: -1, lastUpdated: -1 })
            .limit(5)
            .populate("pharmacy", "name location city address")
            .populate("medicine", "name genericName");

        res.json({
            totalPharmacies,
            totalMedicines,
            totalPharmacists,
            totalStockRecords,
            recentStockUpdates,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------------------- 2. Pharmacy Management -------------------

/**
 * GET /api/admin/pharmacies
 * Get all pharmacies with optional search
 */
const getPharmacies = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query = {
                $or: [
                    { name: regex },
                    { city: regex },
                    { address: regex },
                    { location: regex },
                    { email: regex },
                ],
            };
        }

        const pharmacies = await Pharmacy.find(query).sort({ createdAt: -1 });
        res.json(pharmacies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/admin/pharmacies
 * Create a new pharmacy
 */
const createPharmacy = async (req, res) => {
    try {
        const { name, address, city, contactNumber, email, status, location } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Pharmacy name is required" });
        }

        const pharmacy = new Pharmacy({
            name: name.trim(),
            address: address ? address.trim() : "",
            city: city ? city.trim() : "",
            contactNumber: contactNumber ? contactNumber.trim() : "",
            email: email ? email.trim() : "",
            status: status || "ACTIVE",
            location: location || city || address || "",
        });

        await pharmacy.save();
        res.status(201).json(pharmacy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * PUT /api/admin/pharmacies/:id
 * Update pharmacy details
 */
const updatePharmacy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid pharmacy ID format" });
        }

        const { name, address, city, contactNumber, email, status, location } = req.body;

        const pharmacy = await Pharmacy.findById(id);
        if (!pharmacy) {
            return res.status(404).json({ error: "Pharmacy not found" });
        }

        if (name !== undefined) pharmacy.name = name.trim();
        if (address !== undefined) pharmacy.address = address.trim();
        if (city !== undefined) pharmacy.city = city.trim();
        if (contactNumber !== undefined) pharmacy.contactNumber = contactNumber.trim();
        if (email !== undefined) pharmacy.email = email.trim();
        if (status !== undefined) {
            if (!["ACTIVE", "INACTIVE"].includes(status)) {
                return res.status(400).json({ error: "Status must be ACTIVE or INACTIVE" });
            }
            pharmacy.status = status;
        }
        if (location !== undefined) pharmacy.location = location.trim();

        await pharmacy.save();
        res.json(pharmacy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * DELETE /api/admin/pharmacies/:id
 * Delete or deactivate a pharmacy
 */
const deletePharmacy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid pharmacy ID format" });
        }

        const pharmacy = await Pharmacy.findByIdAndDelete(id);
        if (!pharmacy) {
            return res.status(404).json({ error: "Pharmacy not found" });
        }

        res.json({ message: "Pharmacy deleted successfully", pharmacy });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * PUT /api/admin/pharmacies/:id/status
 * Activate or deactivate pharmacy status
 */
const updatePharmacyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid pharmacy ID format" });
        }

        if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({ error: "Status must be ACTIVE or INACTIVE" });
        }

        const pharmacy = await Pharmacy.findById(id);
        if (!pharmacy) {
            return res.status(404).json({ error: "Pharmacy not found" });
        }

        pharmacy.status = status;
        await pharmacy.save();

        res.json(pharmacy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------------------- 3. Medicine Management -------------------

/**
 * GET /api/admin/medicines
 * Get all medicines with optional search
 */
const getMedicines = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query = {
                $or: [{ name: regex }, { genericName: regex }, { description: regex }],
            };
        }

        const medicines = await Medicine.find(query).sort({ createdAt: -1 });
        res.json(medicines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * POST /api/admin/medicines
 * Create a new medicine
 */
const createMedicine = async (req, res) => {
    try {
        const { name, genericName, description, status } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Medicine name is required" });
        }

        const medicine = new Medicine({
            name: name.trim(),
            genericName: genericName ? genericName.trim() : "",
            description: description ? description.trim() : "",
            status: status || "ACTIVE",
        });

        await medicine.save();
        res.status(201).json(medicine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * PUT /api/admin/medicines/:id
 * Update medicine details
 */
const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid medicine ID format" });
        }

        const { name, genericName, description, status } = req.body;

        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ error: "Medicine not found" });
        }

        if (name !== undefined) medicine.name = name.trim();
        if (genericName !== undefined) medicine.genericName = genericName.trim();
        if (description !== undefined) medicine.description = description.trim();
        if (status !== undefined) {
            if (!["ACTIVE", "INACTIVE"].includes(status)) {
                return res.status(400).json({ error: "Status must be ACTIVE or INACTIVE" });
            }
            medicine.status = status;
        }

        await medicine.save();
        res.json(medicine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * DELETE /api/admin/medicines/:id
 * Delete or deactivate a medicine
 */
const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid medicine ID format" });
        }

        const medicine = await Medicine.findByIdAndDelete(id);
        if (!medicine) {
            return res.status(404).json({ error: "Medicine not found" });
        }

        res.json({ message: "Medicine deleted successfully", medicine });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------------------- 4. Pharmacist Management -------------------

/**
 * GET /api/admin/pharmacists
 * Get all pharmacists with optional search (Never returns passwords)
 */
const getPharmacists = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { role: "PHARMACIST" };

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [{ name: regex }, { email: regex }];
        }

        const pharmacists = await User.find(query)
            .select("-password")
            .populate("assignedPharmacy", "name address city location status email contactNumber")
            .sort({ createdAt: -1 });

        res.json(pharmacists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * PUT /api/admin/pharmacists/:id/status
 * Activate or deactivate pharmacist accounts
 */
const updatePharmacistStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid pharmacist ID format" });
        }

        if (!status || !["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({ error: "Status must be ACTIVE or INACTIVE" });
        }

        const pharmacist = await User.findOne({ _id: id, role: "PHARMACIST" });
        if (!pharmacist) {
            return res.status(404).json({ error: "Pharmacist account not found" });
        }

        pharmacist.status = status;
        await pharmacist.save();

        const updatedPharmacist = await User.findById(id)
            .select("-password")
            .populate("assignedPharmacy", "name address city location status email contactNumber");

        res.json(updatedPharmacist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ------------------- 5. Stock Information -------------------

/**
 * GET /api/admin/stock
 * View stock information from all pharmacies with filters
 * Query params: medicine, pharmacy, status
 */
const getStock = async (req, res) => {
    try {
        const { medicine, pharmacy, status } = req.query;
        let query = {};

        if (status) {
            const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");
            if (["IN_STOCK", "LOW", "OUT_OF_STOCK"].includes(normalizedStatus)) {
                query.status = normalizedStatus;
            }
        }

        if (medicine && medicine.trim()) {
            if (isValidObjectId(medicine)) {
                query.medicine = medicine;
            } else {
                query.medicineName = new RegExp(medicine.trim(), "i");
            }
        }

        if (pharmacy && pharmacy.trim()) {
            if (isValidObjectId(pharmacy)) {
                query.pharmacy = pharmacy;
            } else {
                const matchingPharmacies = await Pharmacy.find({
                    name: new RegExp(pharmacy.trim(), "i"),
                }).select("_id");
                const pharmacyIds = matchingPharmacies.map((p) => p._id);
                query.pharmacy = { $in: pharmacyIds };
            }
        }

        const stockItems = await Stock.find(query)
            .populate("pharmacy", "name location city address status")
            .populate("medicine", "name genericName description status")
            .sort({ updatedAt: -1, lastUpdated: -1 });

        res.json(stockItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
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
};

const mongoose = require("mongoose");

const STATUS_VALUES = ["In Stock", "Low Stock", "Out of Stock"];

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  status: { type: String, enum: STATUS_VALUES, default: "In Stock" },
});

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  medicines: [medicineSchema],
});

pharmacySchema.statics.STATUS_VALUES = STATUS_VALUES;

module.exports = mongoose.model("Pharmacy", pharmacySchema);

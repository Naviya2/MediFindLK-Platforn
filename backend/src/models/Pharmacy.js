const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["In Stock", "Low", "Out of Stock"],
    default: "In Stock",
  },
});

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  medicines: [medicineSchema],
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);

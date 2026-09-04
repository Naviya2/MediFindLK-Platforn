const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["In Stock", "Low", "Out of Stock"],
    default: "In Stock",
  },
});

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    location: { type: String, default: "" },
    medicines: [medicineSchema],
  },
  { timestamps: true }
);

// Pre-save hook to populate location from city/address if location is empty
pharmacySchema.pre("save", function (next) {
  if (!this.location || !this.location.trim()) {
    this.location = this.city || this.address || "";
  }
  next();
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);

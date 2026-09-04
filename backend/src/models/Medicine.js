const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Medicine name is required"],
    trim: true,
    minlength: [2, "Medicine name must be at least 2 characters long"],
    maxlength: [100, "Medicine name cannot exceed 100 characters"]
  },
  genericName: { 
    type: String,
    trim: true,
    maxlength: [100, "Generic name cannot exceed 100 characters"]
  },
  pharmacy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Pharmacy", 
    required: [true, "Pharmacy reference is required"] 
  },
  status: {
    type: String,
    enum: {
      values: ["In Stock", "Low Stock", "Out of Stock"],
      message: "{VALUE} is not a valid status"
    },
    default: "In Stock",
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Medicine", medicineSchema);

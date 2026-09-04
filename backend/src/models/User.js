const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["citizen", "pharmacist", "admin"], required: true },
    phone: { type: String, trim: true },
    pharmacyName: { type: String, trim: true },
    slpcId: { type: String, trim: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: "Pharmacy" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

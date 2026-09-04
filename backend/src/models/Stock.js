const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
    {
        pharmacy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pharmacy",
            required: true,
        },
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            default: null,
        },
        medicineName: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["IN_STOCK", "LOW", "OUT_OF_STOCK"],
            default: "IN_STOCK",
        },
        quantity: {
            type: Number,
            default: 0,
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);

require("dotenv").config();

// Some ISP/router DNS servers don't answer the SRV lookups that mongodb+srv:// needs.
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Pharmacy = require("./models/Pharmacy");

const pharmacies = [
  {
    name: "Sunshine Pharmacy - Colombo 03",
    location: "Colombo 03",
    medicines: [
      { name: "Panadol", status: "In Stock" },
      { name: "Amoxicillin", status: "Low" },
      { name: "Piriton", status: "In Stock" },
      { name: "Metformin", status: "Out of Stock" },
      { name: "Losartan", status: "In Stock" },
      { name: "Vitamin C", status: "In Stock" },
      { name: "Paracetamol Syrup", status: "Low" },
      { name: "Omeprazole", status: "In Stock" },
    ],
  },
  {
    name: "Green Cross Pharmacy - Kandy",
    location: "Kandy",
    medicines: [
      { name: "Panadol", status: "In Stock" },
      { name: "Amoxicillin", status: "In Stock" },
      { name: "Piriton", status: "Out of Stock" },
      { name: "Metformin", status: "In Stock" },
      { name: "Losartan", status: "Low" },
      { name: "Vitamin C", status: "In Stock" },
      { name: "Paracetamol Syrup", status: "In Stock" },
      { name: "Omeprazole", status: "Low" },
      { name: "Cetirizine", status: "In Stock" },
    ],
  },
  {
    name: "City Care Pharmacy - Galle",
    location: "Galle",
    medicines: [
      { name: "Panadol", status: "Low" },
      { name: "Amoxicillin", status: "Out of Stock" },
      { name: "Piriton", status: "In Stock" },
      { name: "Metformin", status: "In Stock" },
      { name: "Losartan", status: "In Stock" },
      { name: "Vitamin C", status: "Out of Stock" },
      { name: "Paracetamol Syrup", status: "In Stock" },
      { name: "Omeprazole", status: "In Stock" },
      { name: "Ibuprofen", status: "Low" },
      { name: "Salbutamol Inhaler", status: "In Stock" },
    ],
  },
  {
    name: "Nawaloka Pharmacy - Negombo",
    location: "Negombo",
    medicines: [
      { name: "Panadol", status: "In Stock" },
      { name: "Amoxicillin", status: "In Stock" },
      { name: "Piriton", status: "Low" },
      { name: "Metformin", status: "Out of Stock" },
      { name: "Losartan", status: "Out of Stock" },
      { name: "Vitamin C", status: "In Stock" },
      { name: "Paracetamol Syrup", status: "Low" },
      { name: "Omeprazole", status: "In Stock" },
    ],
  },
  {
    name: "Family Health Pharmacy - Jaffna",
    location: "Jaffna",
    medicines: [
      { name: "Panadol", status: "In Stock" },
      { name: "Amoxicillin", status: "Low" },
      { name: "Piriton", status: "In Stock" },
      { name: "Metformin", status: "In Stock" },
      { name: "Losartan", status: "In Stock" },
      { name: "Vitamin C", status: "Low" },
      { name: "Paracetamol Syrup", status: "Out of Stock" },
      { name: "Omeprazole", status: "In Stock" },
      { name: "Atorvastatin", status: "In Stock" },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Pharmacy.deleteMany({});
    console.log("🧹 Cleared Pharmacy collection");

    await Pharmacy.insertMany(pharmacies);
    console.log(`🌱 Inserted ${pharmacies.length} pharmacies`);

    await mongoose.disconnect();
    console.log("✅ Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();

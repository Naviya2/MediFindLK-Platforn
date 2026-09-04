require("dotenv").config();

// Some ISP/router DNS servers don't answer the SRV lookups that mongodb+srv:// needs.
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Pharmacy = require("./src/models/Pharmacy");

const pharmacies = [
  {
    name: "Sunshine Pharmacy - Colombo 03",
    location: "Colombo 03",
    medicines: [
      { name: "Panadol", status: "In Stock" },
      { name: "Amoxicillin", status: "Low Stock" },
      { name: "Piriton", status: "In Stock" },
      { name: "Metformin", status: "Out of Stock" },
      { name: "Losartan", status: "In Stock" },
      { name: "Vitamin C", status: "In Stock" },
      { name: "Paracetamol Syrup", status: "Low Stock" },
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
      { name: "Losartan", status: "Low Stock" },
      { name: "Vitamin C", status: "In Stock" },
      { name: "Paracetamol Syrup", status: "In Stock" },
      { name: "Omeprazole", status: "Low Stock" },
      { name: "Cetirizine", status: "In Stock" },
    ],
  },
  {
    name: "City Care Pharmacy - Galle",
    location: "Galle",
    medicines: [
      { name: "Panadol", status: "Low Stock" },
      { name: "Amoxicillin", status: "Out of Stock" },
      { name: "Piriton", status: "In Stock" },
      { name: "Metformin", status: "In Stock" },
      { name: "Losartan", status: "In Stock" },
      { name: "Vitamin C", status: "Out of Stock" },
      { name: "Paracetamol Syrup", status: "In Stock" },
      { name: "Omeprazole", status: "In Stock" },
      { name: "Ibuprofen", status: "Low Stock" },
      { name: "Salbutamol Inhaler", status: "In Stock" },
    ],
  },
  {
    name: "Nawaloka Pharmacy - Negombo",
    location: "Negombo",
    medicines: [
      { name: "Panadol", status: "In Stock" },
      { name: "Amoxicillin", status: "In Stock" },
      { name: "Piriton", status: "Low Stock" },
      { name: "Metformin", status: "Out of Stock" },
      { name: "Losartan", status: "Out of Stock" },
      { name: "Vitamin C", status: "In Stock" },
      { name: "Paracetamol Syrup", status: "Low Stock" },
      { name: "Omeprazole", status: "In Stock" },
    ],
  },
  {
    name: "Family Health Pharmacy - Jaffna",
    location: "Jaffna",
    medicines: [
      { name: "Panadol", status: "In Stock" },
      { name: "Amoxicillin", status: "Low Stock" },
      { name: "Piriton", status: "In Stock" },
      { name: "Metformin", status: "In Stock" },
      { name: "Losartan", status: "In Stock" },
      { name: "Vitamin C", status: "Low Stock" },
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
    await Medicine.deleteMany({});
    console.log("🧹 Cleared Pharmacy and Medicine collections");

    for (const pData of pharmacies) {
      // Create Pharmacy
      const pharmacy = await Pharmacy.create({
        name: pData.name,
        location: pData.location,
      });

      // Prepare Medicines for this Pharmacy
      const medicinesToInsert = pData.medicines.map((m) => ({
        name: m.name,
        status: m.status,
        pharmacy: pharmacy._id,
      }));

      // Insert Medicines
      await Medicine.insertMany(medicinesToInsert);
    }

    console.log(`🌱 Inserted ${pharmacies.length} pharmacies and their medicines`);

    await mongoose.disconnect();
    console.log("✅ Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();

require("dotenv").config();

// Some ISP/router DNS servers don't answer the SRV lookups that mongodb+srv:// needs.
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Pharmacy = require("./src/models/Pharmacy");
const User = require("./src/models/User");

// Shared password for every seeded demo pharmacist account.
const DEMO_PASSWORD = "Pharma@123";

const pharmacies = [
  {
    name: "Sunshine Pharmacy - Colombo 03",
    location: "Colombo 03",
    pharmacistEmail: "pharmacist1@medifind.lk",
    pharmacistName: "Nadeesha Fernando",
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
    pharmacistEmail: "pharmacist2@medifind.lk",
    pharmacistName: "Kasun Jayasuriya",
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
    pharmacistEmail: "pharmacist3@medifind.lk",
    pharmacistName: "Ishara Perera",
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
    pharmacistEmail: "pharmacist4@medifind.lk",
    pharmacistName: "Chamara Silva",
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
    pharmacistEmail: "pharmacist5@medifind.lk",
    pharmacistName: "Priya Kumaraswamy",
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
    await User.deleteMany({ role: "pharmacist" });
    console.log("🧹 Cleared Pharmacy collection and demo pharmacist accounts");

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    for (const p of pharmacies) {
      const user = await User.create({
        name: p.pharmacistName,
        email: p.pharmacistEmail,
        passwordHash,
        role: "pharmacist",
        pharmacyName: p.name,
        slpcId: `SLPC-DEMO-${p.pharmacistEmail.split("@")[0]}`,
      });

      const pharmacy = await Pharmacy.create({
        name: p.name,
        location: p.location,
        owner: user._id,
        medicines: p.medicines,
      });

      user.pharmacy = pharmacy._id;
      await user.save();
    }

    console.log(`🌱 Seeded ${pharmacies.length} pharmacies with linked pharmacist accounts`);
    console.log("");
    console.log("Demo pharmacist logins (all share the same password):");
    console.log(`  password: ${DEMO_PASSWORD}`);
    pharmacies.forEach((p) => console.log(`  ${p.pharmacistEmail}  ->  ${p.name}`));

    await mongoose.disconnect();
    console.log("");
    console.log("✅ Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();

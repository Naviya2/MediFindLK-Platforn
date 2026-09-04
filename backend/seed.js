require("dotenv").config();

// Some ISP/router DNS servers don't answer the SRV lookups that mongodb+srv:// needs.
require("dns").setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Pharmacy = require("./src/models/Pharmacy");
const Medicine = require("./src/models/Medicine");
const User = require("./src/models/User");
const Stock = require("./src/models/Stock");

const pharmacyData = [
  {
    name: "Sunshine Pharmacy - Colombo 03",
    address: "123 Galle Road",
    city: "Colombo 03",
    location: "Colombo 03",
    contactNumber: "0112345678",
    email: "sunshine.colombo@medifind.lk",
    status: "ACTIVE",
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
    address: "45 Peradeniya Road",
    city: "Kandy",
    location: "Kandy",
    contactNumber: "0812233445",
    email: "greencross.kandy@medifind.lk",
    status: "ACTIVE",
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
    address: "78 Main Street",
    city: "Galle",
    location: "Galle",
    contactNumber: "0914567890",
    email: "citycare.galle@medifind.lk",
    status: "ACTIVE",
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
    address: "12 Colombo Road",
    city: "Negombo",
    location: "Negombo",
    contactNumber: "0312223344",
    email: "nawaloka.negombo@medifind.lk",
    status: "ACTIVE",
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
    address: "99 Hospital Street",
    city: "Jaffna",
    location: "Jaffna",
    contactNumber: "0217778899",
    email: "familyhealth.jaffna@medifind.lk",
    status: "ACTIVE",
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

const medicineData = [
  { name: "Panadol", genericName: "Paracetamol", description: "Pain reliever and fever reducer", status: "ACTIVE" },
  { name: "Amoxicillin", genericName: "Amoxicillin Trihydrate", description: "Antibiotic used to treat bacterial infections", status: "ACTIVE" },
  { name: "Piriton", genericName: "Chlorpheniramine", description: "Antihistamine for allergy relief", status: "ACTIVE" },
  { name: "Metformin", genericName: "Metformin Hydrochloride", description: "Medication for type 2 diabetes management", status: "ACTIVE" },
  { name: "Losartan", genericName: "Losartan Potassium", description: "Antihypertensive for high blood pressure", status: "ACTIVE" },
  { name: "Vitamin C", genericName: "Ascorbic Acid", description: "Dietary supplement and antioxidant", status: "ACTIVE" },
  { name: "Paracetamol Syrup", genericName: "Paracetamol", description: "Liquid pain relief for pediatric use", status: "ACTIVE" },
  { name: "Omeprazole", genericName: "Omeprazole", description: "Proton pump inhibitor for acid reflux", status: "ACTIVE" },
  { name: "Cetirizine", genericName: "Cetirizine Hydrochloride", description: "Second-generation antihistamine", status: "ACTIVE" },
  { name: "Ibuprofen", genericName: "Ibuprofen", description: "Nonsteroidal anti-inflammatory drug (NSAID)", status: "ACTIVE" },
  { name: "Salbutamol Inhaler", genericName: "Salbutamol", description: "Bronchodilator for asthma relief", status: "ACTIVE" },
  { name: "Atorvastatin", genericName: "Atorvastatin Calcium", description: "Statin for cholesterol management", status: "ACTIVE" },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medifindlk";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Clear collections
    await Pharmacy.deleteMany({});
    await Medicine.deleteMany({});
    await User.deleteMany({});
    await Stock.deleteMany({});
    console.log("🧹 Cleared existing collections");

    // 1. Insert Pharmacies
    const insertedPharmacies = await Pharmacy.insertMany(pharmacyData);
    console.log(`🌱 Inserted ${insertedPharmacies.length} pharmacies`);

    // 2. Insert Medicines
    const insertedMedicines = await Medicine.insertMany(medicineData);
    console.log(`🌱 Inserted ${insertedMedicines.length} medicines`);

    // Create a medicine lookup map
    const medicineMap = {};
    insertedMedicines.forEach((m) => {
      medicineMap[m.name] = m;
    });

    // 3. Create Users (Admin, Pharmacists, User)
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash("admin123", salt);
    const pharmPasswordHash = await bcrypt.hash("pharm123", salt);
    const userPasswordHash = await bcrypt.hash("user123", salt);

    const usersData = [
      {
        name: "System Admin",
        email: "admin@medifind.lk",
        password: adminPasswordHash,
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        name: "Nimal Perera",
        email: "pharmacist.colombo@medifind.lk",
        password: pharmPasswordHash,
        role: "PHARMACIST",
        assignedPharmacy: insertedPharmacies[0]._id, // Sunshine Pharmacy
        status: "ACTIVE",
      },
      {
        name: "Kamal Silva",
        email: "pharmacist.kandy@medifind.lk",
        password: pharmPasswordHash,
        role: "PHARMACIST",
        assignedPharmacy: insertedPharmacies[1]._id, // Green Cross Pharmacy
        status: "ACTIVE",
      },
      {
        name: "Sunil Fernando",
        email: "pharmacist.galle@medifind.lk",
        password: pharmPasswordHash,
        role: "PHARMACIST",
        assignedPharmacy: insertedPharmacies[2]._id, // City Care Pharmacy
        status: "INACTIVE",
      },
      {
        name: "Regular Customer",
        email: "user@medifind.lk",
        password: userPasswordHash,
        role: "USER",
        status: "ACTIVE",
      },
    ];

    const insertedUsers = await User.insertMany(usersData);
    console.log(`🌱 Inserted ${insertedUsers.length} users (Admin, Pharmacists, User)`);

    // 4. Generate Stock Records from Pharmacies' Medicines
    const stockRecords = [];
    insertedPharmacies.forEach((p) => {
      p.medicines.forEach((m) => {
        let statusEnum = "IN_STOCK";
        let qty = 100;

        if (m.status === "Low") {
          statusEnum = "LOW";
          qty = 10;
        } else if (m.status === "Out of Stock") {
          statusEnum = "OUT_OF_STOCK";
          qty = 0;
        }

        const medObj = medicineMap[m.name];

        stockRecords.push({
          pharmacy: p._id,
          medicine: medObj ? medObj._id : null,
          medicineName: m.name,
          status: statusEnum,
          quantity: qty,
          lastUpdated: new Date(),
        });
      });
    });

    const insertedStock = await Stock.insertMany(stockRecords);
    console.log(`🌱 Inserted ${insertedStock.length} stock items across pharmacies`);

    await mongoose.disconnect();
    console.log("✅ Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Pharmacy = require("../models/Pharmacy");
const { signToken } = require("../utils/jwt");

const ROLES = ["citizen", "pharmacist", "admin"];

function toPublicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    pharmacyName: user.pharmacyName,
    slpcId: user.slpcId,
    pharmacyId: user.pharmacy ? user.pharmacy.toString() : undefined,
  };
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, pharmacyName, slpcId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Name, email, password and role are required" });
    }
    if (!ROLES.includes(role) || role === "admin") {
      return res.status(400).json({ error: "Self-registration is not allowed for this role" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    if (role === "pharmacist" && (!pharmacyName || !slpcId)) {
      return res.status(400).json({ error: "Pharmacy name and SLPC ID are required for pharmacists" });
    }

    const normalisedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalisedEmail });
    if (existing) {
      return res.status(409).json({ error: "An account already exists for that email" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalisedEmail,
      passwordHash,
      role,
      phone,
      pharmacyName: role === "pharmacist" ? pharmacyName : undefined,
      slpcId: role === "pharmacist" ? slpcId : undefined,
    });

    if (role === "pharmacist") {
      const pharmacy = await Pharmacy.create({
        name: pharmacyName,
        owner: user._id,
        medicines: [],
      });
      user.pharmacy = pharmacy._id;
      await user.save();
    }

    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalisedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalisedEmail });
    if (!user || (role && user.role !== role)) {
      return res.status(401).json({ error: "Incorrect email, password or role" });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Incorrect email, password or role" });
    }

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

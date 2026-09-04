const jwt = require("jsonwebtoken");

function signToken(user) {
  const payload = {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
  };
  if (user.role === "pharmacist" && user.pharmacy) {
    payload.pharmacyId = user.pharmacy.toString();
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = { signToken };

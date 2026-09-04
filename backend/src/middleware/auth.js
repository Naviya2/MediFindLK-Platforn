const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "medifind_jwt_secret_key";

/**
 * Middleware to verify JWT token from Authorization header
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ error: "Access denied. Authentication token missing." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res
            .status(401)
            .json({ error: "Invalid or expired authentication token." });
    }
};

/**
 * Middleware for Role-Based Access Control (RBAC)
 * @param  {...string} allowedRoles Roles allowed to access the route
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res
                .status(403)
                .json({ error: "Access denied. User role not identified." });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Forbidden. Access denied for role: ${req.user.role}.`,
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    requireRole,
    JWT_SECRET,
};

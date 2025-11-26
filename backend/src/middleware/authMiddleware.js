const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { protect };
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
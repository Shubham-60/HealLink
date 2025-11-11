import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import generateToken from "../utils/generateToken.js";

// Remove sensitive fields like hashed passwords before sending to clients.
const sanitizeUser = ({ password, ...user }) => user;

// SIGNUP
const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json("All fields are require!");
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use" })
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
            },
        });

        const token = generateToken(newUser.id);

        res.status(201).json({
            message: "Signup successful",
            token,
            user: sanitizeUser(newUser),
        });
    } catch (err) {
        console.error("Error signing up!", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
    const { identifier, email, username, password } = req.body;
    const loginIdentifier = identifier || email || username;

        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: "Please provide username/email and password" });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: loginIdentifier },
                    { username: loginIdentifier },
                ],
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user.id);

        res.status(200).json({
            message: "Login successful",
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGOUT
const logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};

// GET PROFILE (Protected Route)
const getProfile = async (req, res) => {
    try {
        // req.user is set in authMiddleware
        if (!req.user) {
            return res.status(401).json({ message: "User not authorized" });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user: sanitizeUser(req.user),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { signup, login, logout, getProfile }; 
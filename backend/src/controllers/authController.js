const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const generateToken = require("../utils/generateToken.js");
const FamilyMember = require("../models/FamilyMember.js");

// Removed hashed passwords before sending to clients.
const sanitizeUser = (user) => {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
}

// signup
const signup = async (req, res) => {
    try {
        const { name, username, email, password, dateOfBirth } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json("All fields are require!");
        }

        const existingUser = await User.findOne(
            {
                $or:[{email},{username}]
            }
        )

        if (existingUser) {
            return res.status(400).json({ message: "Username or email already in use" })
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        // Create a default self family member for the user
        try {
            await FamilyMember.create({
                user: newUser._id,
                name: newUser.name,
                relationship: "Self",
                // Accept optional dateOfBirth from signup
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            });
        } catch (fmErr) {
            // Don't block signup if family member creation fails
            console.error("Failed to create default family member:", fmErr);
        }

        const token = generateToken(newUser._id);

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

// login
const login = async (req, res) => {
    try {
    const { identifier, email, username, password } = req.body;
    const loginIdentifier = identifier || email || username;

        if (!loginIdentifier || !password) {
            return res.status(400).json({ message: "Please provide username/email and password" });
        }

        const user = await User.findOne({
            $or: [
                { email: loginIdentifier },
                { username: loginIdentifier },
            ],
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful",
            token,
            user: sanitizeUser(user),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// logout
const logout = (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};

// GET profile (Protected Route)
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

module.exports = { signup, login, logout, getProfile }; 
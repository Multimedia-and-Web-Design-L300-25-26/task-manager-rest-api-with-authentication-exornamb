import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Registering user:", { name, email });

        if (!name || !email || !password) {
        return res.status(400).json({ message: "name, email, and password are required" });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
        return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.create({ name, email, password });

        // user.toJSON removes password
        return res.status(201).json(user);
    } catch (err) {
        console.error("Error at register endpoint:", err);
        return res.status(500).json({ message: "Server error at register endpoint" });
    }
};

    // POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
        }

        const ok = await user.comparePassword(password);
        if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = signToken(user._id);

        return res.status(200).json({ token });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
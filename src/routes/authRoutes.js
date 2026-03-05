import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser
  // - Validate input
  // - Check if user exists
  // - Hash password
  // - Save user
  // - Return user (without password)
  );

// POST /api/auth/login
router.post("/login", async (req, res) => {
  // - Find user
  // - Compare password
  // - Generate JWT
  // - Return token
  await loginUser(req, res)
});

export default router;
import express from "express";
import Tourist from "../models/Tourist.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await Tourist.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const user = new Tourist({ name, email, password });
    await user.save();

    res.json({ msg: "Registered successfully", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await Tourist.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({ msg: "Login successful", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEST
router.get("/test", (req, res) => {
  res.send("AUTH WORKING 🔥");
});

export default router;
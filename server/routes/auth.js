import express from "express";
import Tourist from "../models/Tourist.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const user = new Tourist(req.body);
    await user.save();
    res.json({ message: "User registered ✅" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await Tourist.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.password !== req.body.password) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    res.json({ message: "Login success ✅", user });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
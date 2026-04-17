import express from "express";
import Tourist from "../models/Tourist.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Tourist.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
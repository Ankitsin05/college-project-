import express from "express";
import Tourist from "../models/Tourist.js";

const router = express.Router();

// GET tourist by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Tourist.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "User not found" });
  }
});

export default router;
import express from "express";
import Tourist from "../models/Tourist.js";

const router = express.Router();

router.post("/sos", async (req, res) => {
  try {
    const { userId, location } = req.body;

    if (!userId || !location?.lat) {
      return res.status(400).json({ msg: "Missing data" });
    }

    // 🧠 1. SOS history push
    await Tourist.findByIdAndUpdate(userId, {
      $push: {
        sosHistory: {
          lat: location.lat,
          lng: location.lng,
          time: new Date(),
        },
      },
    });

    console.log("🚨 SOS SAVED:", userId, location);

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "SOS failed" });
  }
});

export default router;
import express from "express";
import Location from "../models/Location.js";
import Tourist from "../models/Tourist.js";

const router = express.Router();

router.post("/update", async (req, res) => {
  try {
    const { userId, location, time } = req.body;

    const newLoc = new Location({
      userId,
      lat: location.lat,
      lng: location.lng,
      time,
    });

    await newLoc.save();
       await Tourist.findByIdAndUpdate(userId, {
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    });

    console.log("📍 Location saved");

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save location" });
  }
});

export default router;
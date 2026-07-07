import express from "express";
import Location from "../models/Location.js";
import Tourist from "../models/Tourist.js";

const router = express.Router();

// Danger zones — Northeast India (lat, lng, radius in km)
const DANGER_ZONES = [
  { name: "Zone A - Tawang Border", lat: 27.5859, lng: 91.8678, radius: 5 },
  { name: "Zone B - Manipur Hills", lat: 24.6637, lng: 93.9063, radius: 5 },
  { name: "Zone C - Nagaland Forest", lat: 26.1584, lng: 94.5624, radius: 5 },
];

// Distance calculate karna (Haversine formula)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 📍 SAVE LOCATION + GEO-FENCE CHECK
router.post("/update", async (req, res) => {
  try {
    const { userId, location, time } = req.body;

    console.log("📍 LOCATION UPDATE");
    console.log("User:", userId);
    console.log("Location:", location.lat, location.lng);

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

    console.log("✅ Location saved");

    // 🚨 GEO-FENCE CHECK
    const breachedZones = [];
    for (const zone of DANGER_ZONES) {
      const dist = getDistance(location.lat, location.lng, zone.lat, zone.lng);
      if (dist <= zone.radius) {
        breachedZones.push({ zone: zone.name, distance: dist.toFixed(2) });
        console.log(`🚨 DANGER ZONE BREACH: ${zone.name} — ${dist.toFixed(2)} km`);
      }
    }

    res.json({
      ok: true,
      geofenceBreached: breachedZones.length > 0,
      breachedZones,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save location" });
  }
});

// 🗺️ GET USER LOCATION (Authority use karega)
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const locations = await Location.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(locations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

// 🗺️ GET ALL DANGER ZONES (Frontend use karega)
router.get("/dangerzones", (req, res) => {
  res.json(DANGER_ZONES);
});

export default router;
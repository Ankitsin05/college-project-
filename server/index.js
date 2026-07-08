console.log("SERVER FILE RUNNING");
import express from "express";
import mongoose from "mongoose";
import SOS from "./models/SOS.js";
import Tourist from "./models/Tourist.js";
import Location from "./models/Location.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const DANGER_ZONES = [
  { name: "Zone A - Tawang Border", lat: 27.5859, lng: 91.8678, radius: 5 },
  { name: "Zone B - Manipur Hills", lat: 24.6637, lng: 93.9063, radius: 5 },
  { name: "Zone C - Nagaland Forest", lat: 26.1584, lng: 94.5624, radius: 5 },
];

app.get("/api/test", (req, res) => res.json({ msg: "Server working" }));

app.get("/api/tourist/:id", async (req, res) => {
  console.log("TOURIST API HIT");
  const user = await Tourist.findById(req.params.id);
  if (!user) return res.status(404).json({ msg: "Tourist not found" });
  res.json(user);
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "All fields required" });
    const existing = await Tourist.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });
    const user = new Tourist({ name, email, password });
    await user.save();
    res.json({ msg: "Registered!", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Tourist.findOne({ email, password });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    res.json({ msg: "Login success", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

let latestSOS = null;

app.post("/api/emergency/sos", async (req, res) => {
  try {
    const { userId, location, time } = req.body;
    const newSOS = new SOS({ userId, location, time });
    await newSOS.save();
    latestSOS = newSOS;
    res.json({ message: "SOS Saved in DB" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/emergency/check", (req, res) => {
  if (latestSOS) res.json({ sos: true, data: latestSOS });
  else res.json({ sos: false });
});

app.get("/api/emergency/history/:id", async (req, res) => {
  try {
    const data = await SOS.find({ userId: req.params.id }).sort({ time: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/location/update", async (req, res) => {
  try {
    const { userId, location, time } = req.body;
    console.log("LOCATION UPDATE - User:", userId, "Lat:", location?.lat, "Lng:", location?.lng);

    const newLoc = new Location({ userId, lat: location?.lat, lng: location?.lng });
    await newLoc.save();

    await Tourist.findByIdAndUpdate(userId, {
      location: { lat: location?.lat, lng: location?.lng }
    });

    const breachedZones = [];
    for (const zone of DANGER_ZONES) {
      const dist = getDistance(location?.lat, location?.lng, zone.lat, zone.lng);
      if (dist <= zone.radius) {
        breachedZones.push({ zone: zone.name, distance: dist.toFixed(2) });
        console.log("DANGER ZONE BREACH:", zone.name, dist.toFixed(2), "km");
      }
    }

    res.json({ ok: true, geofenceBreached: breachedZones.length > 0, breachedZones });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save location" });
  }
});

app.get("/api/location/user/:id", async (req, res) => {
  try {
    const locations = await Location.find({ userId: req.params.id }).sort({ createdAt: -1 }).limit(20);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/location/all", async (req, res) => {
  try {
    const tourists = await Tourist.find({});
    const result = await Promise.all(tourists.map(async (t) => {
      const latestLoc = await Location.findOne({ userId: t._id }).sort({ createdAt: -1 });
      return { _id: t._id, name: t.name, email: t.email, lat: latestLoc?.lat || null, lng: latestLoc?.lng || null, time: latestLoc?.createdAt || null, hasLocation: !!latestLoc };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/location/dangerzones", (req, res) => res.json(DANGER_ZONES));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server on ${PORT}`));

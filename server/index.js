import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import emergencyRoutes from "./routes/emergency.js";
import authRoutes from "./routes/auth.js";
import locationRoutes from "./routes/location.js";
import touristRoutes from "./routes/tourist.js";
dotenv.config();

const app = express(); 

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/location", locationRoutes);
// routes
app.use("/api/emergency", emergencyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tourist", touristRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
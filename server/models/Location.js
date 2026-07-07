import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  userId: String,
  lat: Number,
  lng: Number,
}, { timestamps: true }); // ✅ important

export default mongoose.model("Location", locationSchema);
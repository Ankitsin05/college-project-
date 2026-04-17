import mongoose from "mongoose";

const touristSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  // 📍 LOCATION (important)
  location: {
    lat: Number,
    lng: Number
  },

  // 🚨 SOS HISTORY (future use)
  sosHistory: [
    {
      lat: Number,
      lng: Number,
      time: Date
    }
  ]

}, { timestamps: true });

export default mongoose.model("Tourist", touristSchema);
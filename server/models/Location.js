import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  userId: String,
  lat: Number,
  lng: Number,
  time: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Location", locationSchema);
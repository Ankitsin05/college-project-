import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
  userId: String,
  location: {
    lat: Number,
    lng: Number,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SOS", sosSchema);
import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  userId: String,
  lat: Number,
  lng: Number,
  time: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: "SOS",
  },
});

export default mongoose.model("Incident", incidentSchema);
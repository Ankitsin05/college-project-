import mongoose from "mongoose";

const dangerSchema = new mongoose.Schema({
  place: String,
  riskLevel: String,
  description: String
});

export default mongoose.model("DangerZone", dangerSchema);
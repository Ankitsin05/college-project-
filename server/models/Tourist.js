import mongoose from "mongoose";

const touristSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: String
}, { timestamps: true });

export default mongoose.model("Tourist", touristSchema);
import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  guests: { type: Number, default: 1 },
  attending: { type: Boolean, required: true },
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const RSVP = mongoose.model("RSVP", rsvpSchema);
export default RSVP;

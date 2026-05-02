import mongoose from "mongoose";

const guestBookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const GuestBook = mongoose.model("GuestBook", guestBookSchema);
export default GuestBook;

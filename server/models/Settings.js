import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  songUrl: { type: String, default: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  groomImage: { type: String, default: "https://picsum.photos/seed/groom/400/400" },
  brideImage: { type: String, default: "https://picsum.photos/seed/bride/400/400" },
  groomName: { type: String, default: "KARAN" },
  brideName: { type: String, default: "NANCY" },
  weddingDate: { type: String, default: "2026-06-07T06:00:00" },
  weddingVenue: { type: String, default: "KRISHNAGIRI" },
  galleryImages: { type: [String], default: [] },
  documentUrls: { type: [String], default: [] },
  coverImage: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;

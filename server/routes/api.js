import express from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary-v2";
import RSVP from "../models/RSVP.js";
import GuestBook from "../models/GuestBook.js";
import Settings from "../models/Settings.js";

const router = express.Router();

// ─── Admin Auth Middleware ────────────────────────────────────────────────────
const ADMIN_PIN = process.env.ADMIN_PIN || "KN2026";

const requireAdminAuth = (req, res, next) => {
  const pin = req.headers["x-admin-pin"];
  if (!pin || pin !== ADMIN_PIN) {
    return res.status(401).json({ error: "Unauthorized. Admin access required." });
  }
  next();
};

// ─── Multer / Cloudinary Storage ──────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "wedding_fusion",
    resource_type: "auto",
  }),
});

const upload = multer({ storage });

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

// Verify admin PIN (used by client after login)
router.get("/auth/verify", requireAdminAuth, (req, res) => {
  res.json({ authenticated: true });
});

// Check cloud services status
router.get("/cloud-status", requireAdminAuth, async (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const cloudinaryConfigured = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name_here"
  );
  res.json({
    database: dbConnected,
    cloudinary: cloudinaryConfigured,
    ready: dbConnected && cloudinaryConfigured,
  });
});

// ─── RSVP API ─────────────────────────────────────────────────────────────────

// GET all RSVPs — admin only
router.get("/rsvps", requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ error: "Database not connected" });
    const rsvps = await RSVP.find().sort({ timestamp: -1 });
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
});

// POST new RSVP — public (guests submit)
router.post("/rsvp", async (req, res) => {
  try {
    const { name, mobile, guests, attending, attendance, message } = req.body;
    if (!name || !mobile)
      return res.status(400).json({ error: "Name and mobile number are required" });

    const isAttending = attending === "yes" || attendance === "yes" || attending === true;
    const rsvpData = { name, mobile, guests: parseInt(guests) || 1, attending: isAttending, message };

    if (mongoose.connection.readyState === 1) {
      const newRSVP = new RSVP(rsvpData);
      await newRSVP.save();
      res.status(201).json({ message: "RSVP recorded successfully", rsvp: newRSVP });
    } else {
      res.status(503).json({ error: "Database not connected. Unable to save RSVP." });
    }
  } catch (error) {
    console.error("RSVP Error:", error);
    res.status(500).json({ error: "Failed to save RSVP" });
  }
});

// DELETE single RSVP by ID — admin only
router.delete("/rsvps/:id", requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ error: "DB not connected" });
    const deleted = await RSVP.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "RSVP not found" });
    res.json({ message: "RSVP deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete RSVP" });
  }
});

// DELETE all RSVPs — admin only
router.delete("/rsvps", requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ error: "DB not connected" });
    await RSVP.deleteMany({});
    res.json({ message: "All RSVPs cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear RSVPs" });
  }
});

// ─── GuestBook API ────────────────────────────────────────────────────────────

// GET guestbook — public (wedding site shows blessings to all)
router.get("/guestbook", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ error: "Database not connected" });
    const messages = await GuestBook.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch guestbook messages" });
  }
});

// POST guestbook message — public (guests post)
router.post("/guestbook", async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message)
      return res.status(400).json({ error: "Name and message are required" });

    if (mongoose.connection.readyState === 1) {
      const newMessage = new GuestBook({ name, message });
      await newMessage.save();
      res.status(201).json(newMessage);
    } else {
      res.status(503).json({ error: "Database not connected" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// DELETE single guestbook message by ID — admin only
router.delete("/guestbook/:id", requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ error: "DB not connected" });
    const deleted = await GuestBook.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Message not found" });
    res.json({ message: "Blessing deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// PUT/edit single guestbook message by ID — admin only
router.put("/guestbook/:id", requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ error: "DB not connected" });
    const { name, message } = req.body;
    if (!name || !message)
      return res.status(400).json({ error: "Name and message are required" });
    const updated = await GuestBook.findByIdAndUpdate(
      req.params.id,
      { name, message },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Message not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

// DELETE all guestbook messages — admin only
router.delete("/guestbook", requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ error: "DB not connected" });
    await GuestBook.deleteMany({});
    res.json({ message: "Guestbook cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear guestbook" });
  }
});

// ─── Settings API ─────────────────────────────────────────────────────────────

// GET settings — public (site needs to load config)
router.get("/settings", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        songUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        groomImage: "https://picsum.photos/seed/groom/400/400",
        brideImage: "https://picsum.photos/seed/bride/400/400",
        groomName: "KARAN",
        brideName: "NANCY",
        weddingDate: "2026-06-07T06:00:00",
        weddingVenue: "KRISHNAGIRI",
        galleryImages: [],
        documentUrls: [],
        coverImage: "",
      });
    }
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// POST/update settings — admin only
router.post("/settings", requireAdminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res.status(503).json({ error: "Database not connected. Settings not saved." });

    const {
      songUrl, groomImage, brideImage, groomName, brideName,
      weddingDate, weddingVenue, galleryImages, documentUrls, coverImage,
    } = req.body;

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (songUrl !== undefined) settings.songUrl = songUrl;
    if (groomImage !== undefined) settings.groomImage = groomImage;
    if (brideImage !== undefined) settings.brideImage = brideImage;
    if (groomName !== undefined) settings.groomName = groomName;
    if (brideName !== undefined) settings.brideName = brideName;
    if (weddingDate !== undefined) settings.weddingDate = weddingDate;
    if (weddingVenue !== undefined) settings.weddingVenue = weddingVenue;
    if (galleryImages !== undefined) settings.galleryImages = galleryImages;
    if (documentUrls !== undefined) settings.documentUrls = documentUrls;
    if (coverImage !== undefined) settings.coverImage = coverImage;
    settings.updatedAt = Date.now();

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error("Settings POST error:", error);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

// ─── File Upload API — admin only, stores in Cloudinary ──────────────────────
router.post(
  "/upload",
  requireAdminAuth,
  (req, res, next) => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET ||
      CLOUDINARY_CLOUD_NAME === "your_cloud_name_here"
    ) {
      return res.status(503).json({
        error:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file.",
      });
    }
    next();
  },
  upload.single("file"),
  (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const cloudUrl = req.file.path || req.file.secure_url;
      if (!cloudUrl)
        return res.status(500).json({ error: "Upload succeeded but no URL returned from Cloudinary" });
      res.json({ url: cloudUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed: " + (error.message || "Unknown error") });
    }
  }
);

export default router;

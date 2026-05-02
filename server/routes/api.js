import express from "express";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import RSVP from "../models/RSVP.js";
import GuestBook from "../models/GuestBook.js";
import Settings from "../models/Settings.js";

const router = express.Router();

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "wedding_fusion",
      resource_type: "auto",
      allowed_formats: undefined,
    };
  },
});

const upload = multer({ storage: storage });

// RSVP API
router.get("/rsvps", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const rsvps = await RSVP.find().sort({ timestamp: -1 });
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
});

router.post("/rsvp", async (req, res) => {
  try {
    const { name, mobile, guests, attending, attendance, message } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ error: "Name and mobile number are required" });
    }

    const isAttending = attending === "yes" || attendance === "yes" || attending === true;

    const rsvpData = {
      name,
      mobile,
      guests: parseInt(guests) || 1,
      attending: isAttending,
      message,
    };

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

router.delete("/rsvps", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
    await RSVP.deleteMany({});
    res.json({ message: "All RSVPs cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear RSVPs" });
  }
});

// GuestBook API
router.get("/guestbook", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const messages = await GuestBook.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch guestbook messages" });
  }
});

router.post("/guestbook", async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required" });
    }

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

router.delete("/guestbook", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) return res.status(503).json({ error: "DB not connected" });
    await GuestBook.deleteMany({});
    res.json({ message: "Guestbook cleared" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear guestbook" });
  }
});

// Settings API
router.get("/settings", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.post("/settings", async (req, res) => {
  try {
    const { songUrl, groomImage, brideImage, groomName, brideName, weddingDate, weddingVenue, galleryImages, documentUrls, coverImage } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
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
    res.status(500).json({ error: "Failed to save settings" });
  }
});

// File Upload API
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ url: req.file.path });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// RSVP Schema
const rsvpSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  guests: { type: Number, default: 1 },
  attending: { type: Boolean, required: true },
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const RSVP = mongoose.model("RSVP", rsvpSchema);

// GuestBook Schema
const guestBookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const GuestBook = mongoose.model("GuestBook", guestBookSchema);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === "production";

  app.use(express.json());

  // MongoDB Connection
  const MONGODB_URI = process.env.MONGODB_URI;
  if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch(err => console.error("MongoDB connection error:", err));
  } else {
    console.warn("MONGODB_URI not found. RSVP functionality will be limited to console logging.");
  }

  // API routes
  app.get("/api/rsvps", async (req, res) => {
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

  app.post("/api/rsvp", async (req, res) => {
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
        console.log("RSVP Received (No DB):", rsvpData);
        res.status(201).json({ message: "RSVP received (Demo Mode)", rsvp: rsvpData });
      }
    } catch (error) {
      console.error("RSVP Error:", error);
      res.status(500).json({ error: "Failed to save RSVP" });
    }
  });

  // GuestBook API
  app.get("/api/guestbook", async (req, res) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        // Fallback for demo mode
        return res.json([
          { name: "Father Joseph", message: "May God bless your union!", timestamp: new Date() },
          { name: "Nancy's Best Friend", message: "So happy for you both!", timestamp: new Date() }
        ]);
      }
      const messages = await GuestBook.find().sort({ timestamp: -1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch guestbook messages" });
    }
  });

  app.post("/api/guestbook", async (req, res) => {
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
        res.status(201).json({ name, message, timestamp: new Date() });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to save message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only listen if not running on Vercel
  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

const appPromise = startServer();
export default appPromise;

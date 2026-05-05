import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import apiRoutes from "./routes/api.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === "production";

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // MongoDB Connection Middleware
  let isConnected = false;
  const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 1) return;
    
    // If connecting, wait for it
    if (mongoose.connection.readyState === 2) {
      return new Promise((resolve, reject) => {
        const check = () => {
          if (mongoose.connection.readyState === 1) resolve();
          else if (mongoose.connection.readyState === 0) reject(new Error("DB connection failed"));
          else setTimeout(check, 100);
        };
        check();
      });
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.warn("MONGODB_URI not found.");
      return;
    }
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000
      });
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err; // Propagate error to middleware
    }
  };

  app.use("/api", async (req, res, next) => {
    try {
      await connectToDatabase();
      next();
    } catch (err) {
      res.status(503).json({ error: "Database connection failed" });
    }
  }, apiRoutes);

  // Vite/Static Setup
  if (!isProduction && process.env.VERCEL !== "1") {
    // Development Mode — dynamically import Vite so it is never loaded in production
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(__dirname, "../client"), // Point to client folder
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(__dirname, "../client/dist");
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

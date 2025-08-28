import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profile";


// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5004; // ✅ Fixed port

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Basic test route
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is running 🚀" });
});

// ✅ Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Import and use auth routes

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);


// ✅ 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ✅ Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// ✅ Start server with fixed port
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
});

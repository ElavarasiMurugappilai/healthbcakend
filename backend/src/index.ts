// backend/src/index.ts - Final Production-Ready Version
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profile";

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:", missingEnvVars);
  console.error("Please check your .env file");
  process.exit(1);
}

console.log("✅ Environment variables loaded successfully");
console.log("🔐 JWT Secret configured:", process.env.JWT_SECRET ? "Yes" : "No");

const app = express();
const PORT = Number(process.env.PORT) || 5004;

/* ---------------------- MongoDB Connection with Retry ---------------------- */
const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("❌ MongoDB Connection Failed:", errorMessage);

    if (retryCount < 5) {
      console.log(`🔄 Retrying MongoDB in 5s... (attempt ${retryCount + 1}/5)`);
      setTimeout(() => connectDB(retryCount + 1), 5000);
    } else {
      console.error("❌ Max retries reached. Will retry in 30s...");
      setTimeout(() => connectDB(0), 30000);
    }
  }
};
connectDB();

/* ---------------------------- Middleware Setup ----------------------------- */
// Security headers
app.use(helmet());

// Rate limiting (protects login & auth routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "⚠️ Too many requests, please try again later.",
});
app.use("/api/auth", limiter);

// CORS configuration - Fixed type issues
const allowedOrigins: string[] = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL || "", // fallback empty string
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};
app.use(cors(corsOptions));
console.log("✅ CORS Enabled for:", allowedOrigins);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `📝 ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${req.ip}`
  );
  next();
 });

/* ------------------------------- Health Check ------------------------------ */
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };
  const dbStatusText = dbStatusMap[dbStatus] || "Unknown";

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusText,
      readyState: dbStatus,
    },
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

/* ------------------------------- API Routes -------------------------------- */
app.get("/", (req, res) => {
  res.json({
    message: "✅ Health Dashboard Backend is running! 🚀",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      auth: "/api/auth/*",
      profile: "/api/profile/*",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Unknown API endpoint handler
app.use("/api/*", (req, res) => {
  console.log(`❓ API endpoint not found: ${req.originalUrl}`);
  res.status(404).json({
    message: `API endpoint ${req.originalUrl} not found`,
    availableEndpoints: [
      "/api/auth/login",
      "/api/auth/signup",
      "/api/auth/verify",
      "/api/auth/me",
      "/api/profile/quiz",
      "/api/profile/me",
    ],
  });
});

// Generic 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    suggestion: "Did you mean to access /api/...?",
  });
});

/* ---------------------------- Error Handling ------------------------------- */
app.use(
  (err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const errorStatus = (err as any)?.statusCode || (err as any)?.status || 500;
    const errorStack = err instanceof Error ? err.stack : undefined;
    
    console.error("❌ Unhandled Error:", {
      message: errorMessage,
      stack: errorStack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
    });

    const isDevelopment = process.env.NODE_ENV !== "production";
    res.status(errorStatus).json({
      message: isDevelopment ? errorMessage : "Internal server error",
      ...(isDevelopment && { stack: errorStack }),
    });
  }
);

/* ---------------------- Graceful Shutdown & Errors ------------------------- */
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("\n🎉 =================================");
  console.log("🚀 Server Status: ONLINE");
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(
    `🗄️  Database: ${
      mongoose.connection.readyState === 1 ? "Connected" : "Connecting..."
    }`
  );
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("🎉 =================================\n");
});

// Graceful shutdown handler
const shutdown = (signal: string) => {
  console.log(`📴 ${signal} received, shutting down...`);
  server.close(() => {
    mongoose.connection.close().then(() => {
      console.log("✅ All connections closed");
      process.exit(0);
    }).catch((err) => {
      console.error("❌ Error closing MongoDB connection:", err);
      process.exit(1);
    });
  });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

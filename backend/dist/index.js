"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profile_1 = __importDefault(require("./routes/profile"));
const measurements_1 = __importDefault(require("./routes/measurements"));
const fitnessGoalRoutes_1 = __importDefault(require("./routes/fitnessGoalRoutes"));
const fitness_1 = __importDefault(require("./routes/fitness"));
const doctors_1 = __importDefault(require("./routes/doctors"));
const medications_1 = __importDefault(require("./routes/medications"));
const personal_doctors_1 = __importDefault(require("./routes/personal-doctors"));
const careTeamRoutes_1 = __importDefault(require("./routes/careTeamRoutes"));
const medicationSuggestionRoutes_1 = __importDefault(require("./routes/medicationSuggestionRoutes"));
const doctors_2 = __importDefault(require("./routes/doctors"));
const medications_2 = __importDefault(require("./routes/medications"));
const seedDoctors_1 = require("./utils/seedDoctors");
dotenv_1.default.config();
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingEnvVars);
    console.error("Please check your .env file");
    process.exit(1);
}
console.log("✅ Environment variables loaded successfully");
console.log("🔐 JWT Secret configured:", process.env.JWT_SECRET ? "Yes" : "No");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5004;
const connectDB = async (retryCount = 0) => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        await (0, seedDoctors_1.seedSystemDoctors)();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("❌ MongoDB Connection Failed:", errorMessage);
        if (retryCount < 5) {
            console.log(`🔄 Retrying MongoDB in 5s... (attempt ${retryCount + 1}/5)`);
            setTimeout(() => connectDB(retryCount + 1), 5000);
        }
        else {
            console.error("❌ Max retries reached. Will retry in 30s...");
            setTimeout(() => connectDB(0), 30000);
        }
    }
};
connectDB();
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "⚠️ Too many requests, please try again later.",
});
app.use("/api/auth", limiter);
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL || "",
].filter(Boolean);
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};
app.use((0, cors_1.default)(corsOptions));
console.log("✅ CORS Enabled for:", allowedOrigins);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${req.ip}`);
    next();
});
app.get("/health", (req, res) => {
    const dbStatus = mongoose_1.default.connection.readyState;
    const dbStatusMap = {
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
app.use("/api/auth", authRoutes_1.default);
app.use("/api/profile", profile_1.default);
app.use("/api/measurements", measurements_1.default);
app.use("/api/goals", fitnessGoalRoutes_1.default);
app.use("/api/fitness", fitness_1.default);
app.use("/api/doctors", doctors_1.default);
app.use("/api/doctors", personal_doctors_1.default);
app.use("/api/medications", medications_1.default);
app.use("/api/care-team", careTeamRoutes_1.default);
app.use("/api/medication", medicationSuggestionRoutes_1.default);
app.use("/api/doctors", doctors_2.default);
app.use("/api/medications", medications_2.default);
app.use("/api/*", (req, res) => {
    console.log(`❓ API endpoint not found: ${req.originalUrl}`);
    res.status(404).json({
        message: `API endpoint ${req.originalUrl} not found`,
        availableEndpoints: [
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/verify",
            "/api/auth/me",
            "/api/profile/quiz",
            "/api/profile",
            "/api/measurements",
        ],
    });
});
app.use("*", (req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`,
        suggestion: "Did you mean to access /api/...?",
    });
});
app.use((err, req, res, next) => {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const errorStatus = err?.statusCode || err?.status || 500;
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
});
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log("\n🎉 =================================");
    console.log("🚀 Server Status: ONLINE");
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🗄️  Database: ${mongoose_1.default.connection.readyState === 1 ? "Connected" : "Connecting..."}`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("🎉 =================================\n");
});
const shutdown = (signal) => {
    console.log(`📴 ${signal} received, shutting down...`);
    server.close(() => {
        mongoose_1.default.connection.close().then(() => {
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
//# sourceMappingURL=index.js.map
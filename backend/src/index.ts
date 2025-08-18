import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running 🚀");
});

// Example route
app.get("/medications", (req, res) => {
  res.json([
    { name: "Metformin", dosage: "500mg", time: "08:00" },
    { name: "Omega 3", dosage: "800mg", time: "12:30" },
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

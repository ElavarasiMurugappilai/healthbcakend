import mongoose from "mongoose";
import User from "./models/User";
import Doctor from "./models/Doctor";
import MedicationSuggestion from "./models/MedicationSuggestion";
import MedicationSchedule from "./models/MedicationSchedule";
import bcrypt from "bcryptjs";

const MONGO_URI = "mongodb://localhost:27017/healthapp"; // change as needed

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Clear existing data
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await MedicationSuggestion.deleteMany({});
  await MedicationSchedule.deleteMany({});

  // Create test user
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: "Test User",
    email: "testuser@example.com",
    password: passwordHash,
    role: "user",
  });

  // Create doctors
  const doctor1 = await Doctor.create({
    name: "Dr. Alice Smith",
    specialization: "Cardiologist",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  });
  const doctor2 = await Doctor.create({
    name: "Dr. John Lee",
    specialization: "Endocrinologist",
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
  });

  // Create medication suggestions
  await MedicationSuggestion.create([
    {
      doctorId: doctor1._id,
      userId: user._id,
      medicationName: "Atorvastatin",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "30 days",
      status: "pending",
    },
    {
      doctorId: doctor2._id,
      userId: user._id,
      medicationName: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "60 days",
      status: "pending",
    },
    {
      doctorId: doctor1._id,
      userId: user._id,
      medicationName: "Aspirin",
      dosage: "75mg",
      frequency: "Once daily",
      duration: "90 days",
      status: "pending",
    },
  ]);

  // Optionally, add one accepted medication to schedule
  await MedicationSchedule.create({
    userId: user._id,
    name: "Lisinopril",
    dosage: "5mg",
    qty: "1",
    status: "Upcoming",
    time: "08:00",
  });

  console.log("Seed complete!");
  await mongoose.disconnect();
}

seed();
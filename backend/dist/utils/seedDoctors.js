"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSystemDoctors = void 0;
const Doctor_1 = __importDefault(require("../models/Doctor"));
const systemDoctors = [
    {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@hospital.com",
        specialization: "Cardiologist",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        experience: 12,
        isSystemApproved: true,
    },
    {
        name: "Dr. Michael Chen",
        email: "michael.chen@hospital.com",
        specialization: "Endocrinologist",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        rating: 4.9,
        experience: 15,
        isSystemApproved: true,
    },
    {
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@hospital.com",
        specialization: "General Practitioner",
        photo: "https://images.unsplash.com/photo-1594824475317-29bb5c8b7c0c?w=150&h=150&fit=crop&crop=face",
        rating: 4.7,
        experience: 8,
        isSystemApproved: true,
    },
    {
        name: "Dr. David Kim",
        email: "david.kim@hospital.com",
        specialization: "Nutritionist",
        photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
        rating: 4.6,
        experience: 10,
        isSystemApproved: true,
    },
    {
        name: "Dr. Lisa Thompson",
        email: "lisa.thompson@hospital.com",
        specialization: "Psychiatrist",
        photo: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face",
        rating: 4.8,
        experience: 14,
        isSystemApproved: true,
    },
    {
        name: "Dr. James Wilson",
        email: "james.wilson@hospital.com",
        specialization: "Orthopedist",
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        rating: 4.5,
        experience: 18,
        isSystemApproved: true,
    },
];
const seedSystemDoctors = async () => {
    try {
        const existingCount = await Doctor_1.default.countDocuments({ isSystemApproved: true });
        if (existingCount > 0) {
            console.log(`✅ ${existingCount} system doctors already exist`);
            return;
        }
        await Doctor_1.default.insertMany(systemDoctors);
        console.log(`✅ Successfully seeded ${systemDoctors.length} system doctors`);
    }
    catch (error) {
        console.error("❌ Error seeding system doctors:", error);
    }
};
exports.seedSystemDoctors = seedSystemDoctors;
//# sourceMappingURL=seedDoctors.js.map
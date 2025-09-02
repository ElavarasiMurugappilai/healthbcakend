"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorController_1 = require("../controllers/doctorController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/system", doctorController_1.getSystemDoctors);
router.post("/careteam/add", auth_1.authenticateToken, doctorController_1.addToCareTeam);
router.get("/careteam", auth_1.authenticateToken, doctorController_1.getCareTeam);
router.post("/selected", auth_1.authenticateToken, async (req, res) => {
    try {
        const { selectedDoctors } = req.body;
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ error: "Authentication required" });
        }
        await req.user.updateOne({
            $set: { 'profile.selectedDoctors': selectedDoctors || [] }
        });
        res.status(200).json({ message: "Selected doctors saved successfully" });
    }
    catch (error) {
        console.error("Error saving selected doctors:", error);
        res.status(500).json({ error: "Error saving selected doctors" });
    }
});
exports.default = router;
//# sourceMappingURL=doctorRoutes.js.map
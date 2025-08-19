import express from "express";
import { signup, login } from "../controllers/authController";

const router = express.Router();

// temporary test route
router.get("/test", (req, res) => {
  res.send("Auth route working ✅");
});

router.post("/signup", signup);
router.post("/login", login);

export default router;

// src/controllers/profileController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel";

export const updateProfile = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.userId;
  const { name, email, password, profilePhoto } = req.body;

  try {
    let updateData: any = { name, email, profilePhoto };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

import type { Request, Response } from "express";
import { loginZodSchema, signupZodSchema } from "../lib/zod.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";

export const signup = async (req: Request, res: Response) => {
  const result = signupZodSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.issues[0]?.message,
    });
    return;
  }
  const { email, fullName, password } = result.data;
  try {
    const existingUser = await User.findOne({
      email: email,
    });
    if (existingUser) {
      res.status(400).json({
        message: "Email already exists",
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });
    if (newUser) {
      generateToken(newUser._id, res, "user");
      const userWithoutPassword = newUser.toObject() as {
        [key: string]: any;
      };
      delete userWithoutPassword.password;
      res.status(201).json(userWithoutPassword);
    } else {
      res.status(400).json({
        message: "Invalid user details ",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error " });
  }
};

export const login = async (req: Request, res: Response) => {
  const result = loginZodSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: result.error.issues[0]?.message,
    });
    return;
  }
  try {
    const { email, password } = result.data;
    const existingUser = await User.findOne({
      email: email,
    });
    if (!existingUser) {
      res.status(403).json({ message: "Incorrect credentials" });
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password as string
    );
    if (!isPasswordCorrect) {
      res.status(403).json({ message: "Incoorect Password" });
      return;
    }
    generateToken(existingUser._id, res, "user");
    const userWithoutPassword = existingUser.toObject() as {
      [key: string]: any;
    };
    delete userWithoutPassword.password;
    res.status(200).json(userWithoutPassword);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error " });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error " });
  }
};

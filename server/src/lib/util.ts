import type { Response } from "express";
import type { Types } from "mongoose";
import jwt from "jsonwebtoken";

export const generateToken = (
  userId: Types.ObjectId,
  res: Response,
  role: "user" | "admin" | "university"
): string => {
  //todo:- add role in token
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return token;
};

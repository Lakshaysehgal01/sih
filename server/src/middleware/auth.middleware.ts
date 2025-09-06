import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const checkLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({
        message: "Unauthorized - No token Provided",
      });
      return;
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & {
      userId: string;
    };
    if (!decode) {
      res.status(401).json({
        message: "Unauthorized - Invalid Token ",
      });
      return;
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found " });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
};

export const checkAdimn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized - No user in request" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden - Admins only" });
    return;
  }
  next();
};

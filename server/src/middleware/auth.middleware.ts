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
      role: "user" | "admin" | "university";
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
    req.role = decode.role;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
};

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.role) {
      return res.status(401).json({ message: "Unauthorized - Not logged in" });
    }
    if (req.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
};

export const checkUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.role) {
      return res.status(401).json({ message: "Unauthorized - Not logged in" });
    }
    if (req.role !== "university") {
      return res.status(403).json({ message: "Forbidden - University only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error " });
  }
};

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define proper user interface
interface JWTUser {
  id: string;
  email: string;
  role: "user" | "university" | "admin";
  iat?: number;
  exp?: number;
}

// Extend Request interface to include authenticated user property
declare global {
  namespace Express {
    interface Request {
      authUser?: JWTUser;
    }
  }
}

function authenticate(req: Request, res: Response, next: NextFunction): void {
  // First check for cookie token
  let token = req.cookies?.jwt;

  // If no cookie token, check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    res.status(401).json({ message: "Access token is missing" });
    return;
  }

  // Verify JWT secret is configured
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is not set");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTUser;
    req.authUser = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);

    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "Invalid token" });
    } else {
      res.status(403).json({ message: "Token verification failed" });
    }
  }
}

export default authenticate;

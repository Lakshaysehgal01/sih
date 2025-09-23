import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
  userId: string;
  role: string;
}

export const protect =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.token ||
      req.cookies?.jwt || // Try 'jwt' cookie name too
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
        debug: {
          cookiesReceived: Object.keys(req.cookies || {}),
          authHeaderPresent: !!req.headers.authorization,
        },
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as AuthPayload;

      // Check role
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient role" });
      }

      // Attach user info to req
      (req as any).user = { id: decoded.userId, role: decoded.role };

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };

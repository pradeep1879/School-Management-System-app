import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../config.ts";
import type { AppRole, JwtUserPayload } from "../types/auth.types";

export const verifyUser = (allowedRoles: AppRole[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const decoded = jwt.verify(
        token,
        config.JWT_SECRET as string,
      ) as JwtUserPayload;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      req.userId = decoded.id;
      req.role = decoded.role;

      next();
    } catch (error) {
      void error;

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

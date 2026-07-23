import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : undefined);

    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to access this resource.",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const decoded = verifiedToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      throw new Error("User not found. Please log in again.");
    }

    if (user.status === "BANNED") {
      throw new Error("Your account has been Bnned . Please contact support.");
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource.",
      );
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  });
};

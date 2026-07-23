import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { userController } from "../user/user.controller";

const router = Router();
router.post("/login", authController.loginUser);
router.post("/refresh-token", authController.refreshToken);
router.get(
  "/me",
  auth(Role.ADMIN, Role.TENANT, Role.LANDLORD),
  userController.getMyProfile,
);
export const authRoutes = router;

import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

// Public
router.post("/register", userController.registerUser);
export const userRoutes = router;

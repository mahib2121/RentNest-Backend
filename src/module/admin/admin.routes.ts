import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { PropertyController } from "../Properties/properties.controller";
import { RentalRequestController } from "../rental-request/rental-request.controller";
import { paymentController } from "../payment/payment.controller";
import { AdminController } from "./admin.controller";

const router = Router();

// Dashboard
router.get("/dashboard", auth(Role.ADMIN), AdminController.dashboard);

// Users
router.get("/users", auth(Role.ADMIN), AdminController.getUsers);
router.get("/users/:id", auth(Role.ADMIN), AdminController.getUserById);
router.patch(
  "/users/:id/status",
  auth(Role.ADMIN),
  AdminController.updateStatus,
);

// Properties
router.get(
  "/properties",
  auth(Role.ADMIN),
  PropertyController.getAllProperties,
);
router.patch(
  "/properties/:id/status",
  auth(Role.ADMIN),
  PropertyController.updateProperty,
);

// Rental Requests
router.get(
  "/rentals",
  auth(Role.ADMIN),
  RentalRequestController.getLandlordRequests,
);

// Payments
router.get("/payments", auth(Role.ADMIN), paymentController.getAllPayments);

// Categories
// router.post("/categories", auth(Role.ADMIN), CategoryController.createCategory);
// router.patch("/categories/:id", auth(Role.ADMIN), CategoryController.updateCategory);
// router.delete("/categories/:id", auth(Role.ADMIN), CategoryController.deleteCategory);
export const adminRoutes = router;

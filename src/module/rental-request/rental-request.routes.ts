import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middleware/auth";
import { RentalRequestController } from "./rental-request.controller";

const router = Router();
// Create a rental request
router.post("/", auth(Role.TENANT), RentalRequestController.createRequest);

/**
 * Landlord
 */

// Get all rental requests for landlord's properties
router.get(
  "/",
  auth(Role.LANDLORD),
  RentalRequestController.getLandlordRequests,
);

// Approve or reject a rental request
router.patch(
  "/:id",
  auth(Role.LANDLORD),
  RentalRequestController.updateRequestStatus,
);

export const rentalRequestRoutes = router;

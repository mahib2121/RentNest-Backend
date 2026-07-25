// import { Router } from "express";
// import { auth } from "../../middleware/auth";
// import { Role } from "../../../generated/prisma/enums";
// import { RentalRequestController } from "./rental-request.controller";

// const router = Router();

// // Get all pending/active rental requests for the landlord's properties
// router.get(
//   "/requests",
//   auth(Role.LANDLORD),
//   RentalRequestController.getLandlordRequests,
// );

// // Approve or reject a specific request (e.g., passing { status: 'APPROVED' } in body)
// router.patch(
//   "/requests/:id",
//   auth(Role.LANDLORD),
//   RentalRequestController.updateRequestStatus,
// );

// // // View past rental history
// // router.get("/history", auth(Role.LANDLORD), RentalRequestController.getRentalHistory);

// // // View reviews left on the landlord's properties
// // router.get(
// //   "/reviews",
// //   auth(Role.LANDLORD),
// //   ReviewControll.getLandlordReviews,
// // );

// export const rentalrequest = router;

import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";

import { auth } from "../../middleware/auth";
import { RentalRequestController } from "./rental-request.controller";

const router = Router();

/**
 * Tenant
 */

// Create a rental request
router.post("/", auth(Role.TENANT), RentalRequestController.createRequest);

/**
 * Landlord
 */

// Get all rental requests for landlord's properties
// Optional: ?status=PENDING | APPROVED | REJECTED | COMPLETED
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

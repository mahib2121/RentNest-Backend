import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

// Tenant
router.post("/", auth(Role.TENANT), reviewController.createReview);

router.patch("/:id", auth(Role.TENANT), reviewController.updateReview);

router.delete("/:id", auth(Role.TENANT), reviewController.deleteReview);

// Public
router.get("/property/:propertyId", reviewController.getPropertyReviews);

router.get("/:id", reviewController.getSingleReview);

// Admin
router.get("/", auth(Role.ADMIN), reviewController.getAllReviews);

router.delete(
  "/:id/admin",
  auth(Role.ADMIN),
  reviewController.adminDeleteReview,
);

export const reviewRoutes = router;
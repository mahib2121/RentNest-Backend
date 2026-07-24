import { Router } from "express";

import { Role } from "../../../generated/prisma/client";

import { auth } from "../../middleware/auth";

import { PropertyController } from "./properties.controller";

const router = Router();

router.get("/", PropertyController.getAllProperties);

router.get("/:id", PropertyController.getSingleProperty);

router.post("/", auth(Role.LANDLORD), PropertyController.createProperty);

router.get(
  "/my-properties",
  auth(Role.LANDLORD),
  PropertyController.getMyProperties,
);

router.patch("/:id", auth(Role.LANDLORD), PropertyController.updateProperty);

router.delete("/:id", auth(Role.LANDLORD), PropertyController.deleteProperty);

export const propertyRoutes = router;

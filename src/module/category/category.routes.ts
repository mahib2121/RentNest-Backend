import { Router } from "express";

import { categoryController } from "./category.controller";

const router = Router();

router.post("/", categoryController.createCategory);

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getSingleCategory);

router.patch("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

export const categoryRoutes = router;

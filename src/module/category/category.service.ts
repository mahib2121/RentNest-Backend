import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "./category.interface";
import AppError from "../../utils/AppError";

const createCategoryIntoDB = async (payload: CreateCategoryPayload) => {
  const isCategoryExist = await prisma.category.findFirst({
    where: {
      OR: [{ name: payload.name }, { slug: payload.slug }],
    },
  });

  if (isCategoryExist) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  const category = await prisma.category.create({
    data: payload,
  });

  return category;
};

const getAllCategoriesFromDB = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleCategoryFromDB = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  return category;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: UpdateCategoryPayload,
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  if (payload.name || payload.slug) {
    const duplicateCategory = await prisma.category.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          payload.name ? { name: payload.name } : {},
          payload.slug ? { slug: payload.slug } : {},
        ],
      },
    });

    if (duplicateCategory) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Category name or slug already exists",
      );
    }
  }

  return prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategoryFromDB = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  await prisma.category.delete({
    where: { id },
  });

  return null;
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};

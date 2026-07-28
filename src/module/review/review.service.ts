import { JwtPayload } from "jsonwebtoken";
import HttpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/AppError";
import { PaymentStatus } from "../../../generated/prisma/enums";

import { CreateReviewPayload, UpdateReviewPayload } from "./review.interface";

const createReview = async (user: JwtPayload, payload: CreateReviewPayload) => {
  const { rentalRequestId, rating, comment } = payload;

  if (rating < 1 || rating > 5) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: {
      payment: true,
      review: true,
    },
  });

  if (!rentalRequest) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rentalRequest.tenantId !== user.id) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      "You are not allowed to review this rental",
    );
  }

  if (rentalRequest.payment?.status !== PaymentStatus.SUCCESS) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      "You can only review a rental after payment is completed",
    );
  }

  if (rentalRequest.review) {
    throw new ApiError(
      HttpStatus.CONFLICT,
      "A review already exists for this rental",
    );
  }

  const result = await prisma.review.create({
    data: {
      rentalRequestId,
      propertyId: rentalRequest.propertyId,
      tenantId: user.id,
      rating,
      comment,
    },
  });

  return result;
};

const updateReview = async (
  reviewId: string,
  user: JwtPayload,
  payload: UpdateReviewPayload,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Review not found");
  }

  if (review.tenantId !== user.id) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      "You are not allowed to update this review",
    );
  }

  if (
    payload.rating !== undefined &&
    (payload.rating < 1 || payload.rating > 5)
  ) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5",
    );
  }

  const result = await prisma.review.update({
    where: { id: reviewId },
    data: payload,
  });

  return result;
};

const deleteReview = async (reviewId: string, user: JwtPayload) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Review not found");
  }

  if (review.tenantId !== user.id) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      "You are not allowed to delete this review",
    );
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return null;
};

const getPropertyReviews = async (
  propertyId: string,
  query: Record<string, unknown>,
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = (query.sortBy as string) || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const where = {
    propertyId,
    ...(query.rating ? { rating: Number(query.rating) } : {}),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        tenant: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    meta: { page, limit, total },
    data: reviews,
  };
};

const getSingleReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      tenant: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true } },
    },
  });

  if (!review) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Review not found");
  }

  return review;
};

const getAllReviews = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = (query.sortBy as string) || "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const where = {
    ...(query.propertyId ? { propertyId: String(query.propertyId) } : {}),
    ...(query.tenantId ? { tenantId: String(query.tenantId) } : {}),
    ...(query.rating ? { rating: Number(query.rating) } : {}),
  };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        tenant: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, title: true } },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    meta: { page, limit, total },
    data: reviews,
  };
};

const adminDeleteReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Review not found");
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return null;
};

export const reviewService = {
  createReview,
  updateReview,
  deleteReview,
  getPropertyReviews,
  getSingleReview,
  getAllReviews,
  adminDeleteReview,
};

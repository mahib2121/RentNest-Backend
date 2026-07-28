
import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, body } = req;

    const result = await reviewService.createReview(user!, body);

    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: "Review submitted successfully.",
      data: result,
    });
  }
);

const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
      user,
      body,
    } = req;

    const result = await reviewService.updateReview(id as string , user!, body);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Review updated successfully.",
      data: result,
    });
  }
);

const deleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
      user,
    } = req;

    const result = await reviewService.deleteReview(id as string , user!);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Review deleted successfully.",
      data: result,
    });
  }
);


const getSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
    } = req;

    const result = await reviewService.getSingleReview(id as string);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Review retrieved successfully.",
      data: result,
    });
  }
);

const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req;

    const { meta, data } = await reviewService.getAllReviews(query);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Reviews retrieved successfully.",
      meta,
      data,
    });
  }
);
const adminDeleteReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { id },
    } = req;

    const result = await reviewService.adminDeleteReview(id as string);

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Review deleted successfully.",
      data: result,
    });
  }
);
const getPropertyReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      params: { propertyId },
      query,
    } = req;

    const { meta, data } = await reviewService.getPropertyReviews(
      propertyId as string,
      query
    );

    sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Reviews retrieved successfully.",
      meta,
      data,
    });
  }
);



export const reviewController = {
  createReview,
  updateReview,
  deleteReview,
  getPropertyReviews,
  getSingleReview,
  getAllReviews,
  adminDeleteReview,
};
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
import AppError from "../../utils/AppError";
const createCheckout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await paymentService.createCheckout(req.body, req.user);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "checkout complete ",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"];

    if (!signature || typeof signature !== "string") {
      throw new AppError(HttpStatus.BAD_REQUEST, "Stripe signature is missing");
    }

    await paymentService.handleWebhook(req.body as Buffer, signature);

    res.status(HttpStatus.OK).json({
      received: true,
    });
  },
);

export const paymentController = {
  createCheckout,
  handleWebhook,
};

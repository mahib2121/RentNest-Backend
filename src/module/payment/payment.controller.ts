import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";
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

export const paymentController = {
  createCheckout,
};

import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const dashboard = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.dashboard();

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Dashboard data retrieved successfully",
      data: result,
    });
  },
);

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getUsers(req.query);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Users retrieved successfully",
      data: result,
    });
  },
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.getUserById(id as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User retrieved successfully",
      data: result,
    });
  },
);

const updateStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await AdminService.updateStatus(id as string, req.body);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });
  },
);

export const AdminController = {
  dashboard,
  getUsers,
  getUserById,
  updateStatus,
};

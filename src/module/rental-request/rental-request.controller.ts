import { Request, Response } from "express";
import { RentalRequestService } from "./rental-request.service";

export const RentalRequestController = {
  createRequest: async (req: Request, res: Response) => {
    try {
      const tenantId = req.user!.id as string;
      const result = await RentalRequestService.createRequest(
        tenantId,
        req.body,
      );

      res.status(201).json({
        success: true,
        message: "Rental request submitted successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getLandlordRequests: async (req: Request, res: Response) => {
    try {
      const landlordId = req.user!.id;
      const { status } = req.query;

      const result = await RentalRequestService.getLandlordRequests(
        landlordId,
        status,
      );

      res.status(200).json({
        success: true,
        message: "Requests retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateRequestStatus: async (req: Request, res: Response) => {
    try {
      const landlordId = req.user!.id;
      const { id } = req.params;

      const result = await RentalRequestService.updateRequestStatus(
        landlordId,
        id as string,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: `Request status updated to ${result.status}`,
        data: result,
      });
    } catch (error: any) {
      res.status(403).json({ success: false, message: error.message });
    }
  },
};

import { prisma } from "../../lib/prisma";
import {
  ICreateRentalRequest,
  IUpdateRequestStatus,
} from "./rental-request.interface";

export const RentalRequestService = {
  // TENANT: Create a new request
  createRequest: async (tenantId: string, payload: ICreateRentalRequest) => {
    return await prisma.rentalRequest.create({
      data: {
        ...payload,
        tenantId,
      },
    });
  },

  // LANDLORD: Get all requests for their properties (with optional status filter)
  getLandlordRequests: async (landlordId: string, status?: any) => {
    const whereCondition: any = {
      property: {
        landlordId: landlordId, // Assumes your Property model has a landlordId field
      },
    };

    if (status) {
      whereCondition.status = status;
    }

    return await prisma.rentalRequest.findMany({
      where: whereCondition,
      include: {
        property: true,
        tenant: {
          select: { id: true, name: true, email: true }, // Don't expose passwords
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // LANDLORD: Approve or Reject a request
  updateRequestStatus: async (
    landlordId: string,
    requestId: string,
    payload: IUpdateRequestStatus,
  ) => {
    // 1. Find the request and verify ownership
    const request = await prisma.rentalRequest.findUnique({
      where: { id: requestId },
      include: { property: true },
    });

    if (!request) {
      throw new Error("Rental request not found");
    }

    if (request.property.landlordId !== landlordId) {
      throw new Error("Unauthorized: You do not own this property");
    }

    // 2. Update the status
    return await prisma.rentalRequest.update({
      where: { id: requestId },
      data: { status: payload.status },
    });
  },
};

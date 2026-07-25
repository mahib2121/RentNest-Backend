import {
  RentalRequestStatus,
  PropertyStatus,
} from "../../../generated/prisma/enums";

export interface ICreateRentalRequest {
  propertyId: string;
  moveInDate: Date;
  durationMonths: number;
  message?: string;
}

export interface IUpdateRequestStatus {
  status: RentalRequestStatus;
}

export interface IGetLandlordRequestsQuery {
  status?: RentalRequestStatus;
}

export interface IUpdatePropertyStatus {
  availabilityStatus: PropertyStatus;
}

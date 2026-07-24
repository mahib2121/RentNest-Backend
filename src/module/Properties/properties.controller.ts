import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PropertyService } from "./properties.service";

const createProperty = catchAsync(async (req, res) => {
  const landlordId = req.user?.id as string;

  const result = await PropertyService.createPropertyIntoDB(
    landlordId,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req, res) => {
  const filters = {
    searchTerm: req.query.searchTerm as string,
    city: req.query.city as string,
    division: req.query.division as string,
    categoryId: req.query.categoryId as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
    bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
  };

  const pagination = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as "asc" | "desc",
  };

  const result = await PropertyService.getAllPropertiesFromDB(
    filters,
    pagination,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProperty = catchAsync(async (req, res) => {
  const result = await PropertyService.getSinglePropertyFromDB(
    req.params.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property retrieved successfully",
    data: result,
  });
});

const getMyProperties = catchAsync(async (req, res) => {
  const landlordId = req.user?.id;

  const result = await PropertyService.getMyPropertiesFromDB(
    landlordId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My properties retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req, res) => {
  const landlordId = req.user?.id;

  const result = await PropertyService.updatePropertyIntoDB(
    landlordId as string,
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req, res) => {
  const landlordId = req.user?.id;

  await PropertyService.deletePropertyFromDB(
    landlordId as string,
    req.params.id as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: null,
  });
});

export const PropertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
};

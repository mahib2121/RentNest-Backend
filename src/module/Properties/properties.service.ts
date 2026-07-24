import httpStatus from "http-status";
import { Prisma, PropertyStatus } from "../../../generated/prisma/client";

import AppError from "../../utils/AppError";
import { prisma } from "../../lib/prisma";

import {
  CreatePropertyPayload,
  UpdatePropertyPayload,
  IPropertyFilterParams,
  IPaginationOptions,
} from "./properties.interface";

const sortableFields = [
  "createdAt",
  "rentPrice",
  "bedrooms",
  "bathrooms",
  "areaSqft",
  "city",
] as const;

const createPropertyIntoDB = async (
  landlordId: string,
  payload: CreatePropertyPayload,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return property;
};

const getAllPropertiesFromDB = async (
  filters: IPropertyFilterParams,
  pagination: IPaginationOptions,
) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = pagination;

  const skip = (Number(page) - 1) * Number(limit);

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (filters.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: filters.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: filters.searchTerm,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: filters.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (filters.city) {
    andConditions.push({
      city: {
        equals: filters.city,
        mode: "insensitive",
      },
    });
  }

  if (filters.division) {
    andConditions.push({
      division: {
        equals: filters.division,
        mode: "insensitive",
      },
    });
  }

  if (filters.categoryId) {
    andConditions.push({
      categoryId: filters.categoryId,
    });
  }

  if (filters.bedrooms !== undefined) {
    andConditions.push({
      bedrooms: Number(filters.bedrooms),
    });
  }

  if (filters.bathrooms !== undefined) {
    andConditions.push({
      bathrooms: Number(filters.bathrooms),
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    andConditions.push({
      rentPrice: {
        ...(filters.minPrice !== undefined && {
          gte: Number(filters.minPrice),
        }),
        ...(filters.maxPrice !== undefined && {
          lte: Number(filters.maxPrice),
        }),
      },
    });
  }

  andConditions.push({
    availabilityStatus: PropertyStatus.AVAILABLE,
  });

  const whereConditions: Prisma.PropertyWhereInput = {
    AND: andConditions,
  };

  const orderByField = sortableFields.includes(
    sortBy as (typeof sortableFields)[number],
  )
    ? sortBy
    : "createdAt";

  const properties = await prisma.property.findMany({
    where: whereConditions,
    skip,
    take: Number(limit),
    orderBy: {
      [orderByField]: sortOrder,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  });

  const total = await prisma.property.count({
    where: whereConditions,
  });

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: properties,
  };
};

const getSinglePropertyFromDB = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      reviews: {
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  return property;
};

const getMyPropertiesFromDB = async (landlordId: string) => {
  const properties = await prisma.property.findMany({
    where: {
      landlordId,
    },
    include: {
      category: true,
      _count: {
        select: {
          rentalRequests: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

const updatePropertyIntoDB = async (
  landlordId: string,
  propertyId: string,
  payload: UpdatePropertyPayload,
) => {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      landlordId,
    },
  });

  if (!property) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Property not found or access denied",
    );
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
  }

  const updatedProperty = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: payload,
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return updatedProperty;
};

const deletePropertyFromDB = async (landlordId: string, propertyId: string) => {
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      landlordId,
    },
  });

  if (!property) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Property not found or access denied",
    );
  }

  await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });

  return null;
};

export const PropertyService = {
  createPropertyIntoDB,
  getAllPropertiesFromDB,
  getSinglePropertyFromDB,
  getMyPropertiesFromDB,
  updatePropertyIntoDB,
  deletePropertyFromDB,
};

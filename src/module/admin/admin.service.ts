import { prisma } from "../../lib/prisma";

const dashboard = async () => {
  const [
    totalUsers,
    totalTenants,
    totalLandlords,
    totalProperties,
    totalRentalRequests,
    totalPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: "TENANT",
      },
    }),
    prisma.user.count({
      where: {
        role: "LANDLORD",
      },
    }),
    prisma.property.count(),
    prisma.rentalRequest.count(),
    prisma.payment.count(),
  ]);

  return {
    totalUsers,
    totalTenants,
    totalLandlords,
    totalProperties,
    totalRentalRequests,
    totalPayments,
  };
};

const getUsers = async (query: any) => {
  const role = query.role as string | undefined;

  const users = await prisma.user.findMany({
    where: role
      ? {
          role: role as any,
        }
      : {},
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

const getUserById = async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

const updateStatus = async (
  id: string,
  payload: {
    status: string;
  },
) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload.status as any,
    },
  });
};

export const AdminService = {
  dashboard,
  getUsers,
  getUserById,
  updateStatus,
};

import bcrypt from "bcryptjs";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, phone, role, profileImage } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(config.bcrypt_salt_round),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      profileImage,
    },
    omit: {
      password: true,
    },
  });

  return createdUser;
};

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
};

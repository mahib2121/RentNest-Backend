import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }
  const accessToken = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwt_access!,
    { expiresIn: "30d" },
  );
  const refreshToken = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwt_refresh!,
    { expiresIn: "30d" },
  );
  return { accessToken, refreshToken };
};
const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("User is BANNED ");
  }

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access,
    config.jwt_expiry as SignOptions,
  );

  return { accessToken };
};

export const authService = {
  loginUser,
  refreshToken,
};

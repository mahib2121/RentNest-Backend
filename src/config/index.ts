import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_refresh: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_expiry: process.env.JWT_EXPIRY,
  app_URL: process.env.APP_URL,
};

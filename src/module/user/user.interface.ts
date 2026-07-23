import { Role } from "../../../generated/prisma/enums";
export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  role: Role;
}

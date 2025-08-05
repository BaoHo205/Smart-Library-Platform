import { UserRole } from "./enum/UserType";

export interface User {
  id?: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
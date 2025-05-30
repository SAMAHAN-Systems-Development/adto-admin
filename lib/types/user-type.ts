export enum UserType {
  ADMIN = "ADMIN",
  ORGANIZATION = "ORGANIZATION",
  USER = "USER",
}

export interface User {
  id: string;
  email: string;
  role: UserType;
  orgId?: string;
}

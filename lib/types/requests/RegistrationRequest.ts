export interface UpdateRegistrationRequest {
  fullName?: string;
  email?: string;
  yearLevel?: string;
  course?: string;
  cluster?: string;
  isAttended?: boolean;
  organizationParentId?: string;
  organizationChildId?: string;
}

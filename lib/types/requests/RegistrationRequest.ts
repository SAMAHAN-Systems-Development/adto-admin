export interface UpdateRegistrationRequest {
  fullName?: string;
  email?: string;
  yearLevel?: string;
  course?: string;
  cluster?: string;
  isAttended?: boolean;
  organizationParentId?: string | null;
  organizationChildId?: string | null;
}

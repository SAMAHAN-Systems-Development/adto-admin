export interface CreateOrganizationRequest {
  name: string;
  acronym?: string;
  email: string;
  password?: string;
  organizationParentId?: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  isAdmin?: boolean;
}

export interface UpdateOrganizationRequest {
  name?: string;
  acronym?: string;
  email?: string;
  password?: string;
  organizationParentId?: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  isAdmin?: boolean;
}

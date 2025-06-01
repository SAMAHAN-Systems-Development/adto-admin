import { OrganizationChild } from "../types/entities";
import { CreateOrganizationDto } from "../types/dto/create-organization.type";
export const addOrganization = async (
  organizationData: CreateOrganizationDto,
): Promise<OrganizationChild> => {
  const data = await fetch(`endpoint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: organizationData.name,
      acronym: organizationData.acronym,
      icon: organizationData.icon,
      facebook: organizationData.links?.facebook,
      instagram: organizationData.links?.instagram,
      twitter: organizationData.links?.twitter,
      linkedin: organizationData.links?.linkedin,
      isActive: true,
      isAdmin: false,
    }),
  });

  if (!data.ok) {
    throw new Error("Failed to create organization");
  }

  return data.json();
};

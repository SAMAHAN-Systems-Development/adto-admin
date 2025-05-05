import { OrganizationChild } from "../types/entities";
import { CreateOrganizationInput } from "../types/forms/organization";

export const addOrganization = async (
  organizationData: CreateOrganizationInput,
): Promise<OrganizationChild> => {
  const data = await fetch(`endpoint`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: organizationData.organizationName,
      acronym: organizationData.organizationAcronym,
      icon: organizationData.organizationIcon,
      facebook: organizationData.facebookLink,
      twitter: organizationData.twitterLink,
      linkedin: organizationData.linkedinLink,
      isActive: true,
      isAdmin: false,
    }),
  });

  if (!data.ok) {
    throw new Error("Failed to create organization");
  }

  return data.json();
};

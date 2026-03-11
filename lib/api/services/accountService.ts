import { BASE_URL } from "../../config/api";
import type { UpdateOrganizationRequest } from "../../types/requests/OrganizationRequests";

/**
 * Fetch the currently authenticated user's own organization profile.
 * The backend resolves identity from the JWT (orgId claim).
 */
export const getMyOrganization = async () => {
  const response = await fetch(`${BASE_URL}/organizations/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch account information");
  }

  const data = await response.json();

  // Flatten the nested user.email to top-level email for form compatibility
  if (data.user?.email) {
    return { ...data, email: data.user.email };
  }

  return data;
};

/**
 * Update the currently authenticated user's own organization profile.
 * The backend resolves identity from the JWT (orgId claim).
 */
export const updateMyOrganization = async (
  orgData: Omit<UpdateOrganizationRequest, "organizationParentId" | "isAdmin">,
) => {
  const response = await fetch(`${BASE_URL}/organizations/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(orgData),
  });

  if (!response.ok) {
    throw new Error("Failed to update account information");
  }

  const data = await response.json();
  return data;
};

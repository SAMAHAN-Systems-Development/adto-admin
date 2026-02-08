import { BASE_URL } from "../../config/api";

export const findAllOrganizationParents = async () => {
  const response = await fetch(`${BASE_URL}/organization-parents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organization parents");
  }

  const data = await response.json();
  return data;
};

import { OrganizationRequest } from "@/lib/types/requests/Organization";
import { BASE_URL } from "../../config/api";

export const createOrganizationService = async (orgData: OrganizationRequest) => {

    const response = await fetch(`${BASE_URL}/organizations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orgData),
    });

    if (!response.ok) {
        throw new Error("Organization create failed");
    }

    const data = await response.json();
    return data;
};

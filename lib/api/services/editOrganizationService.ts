import { OrganizationRequest } from "@/lib/types/requests/Organization";
import { BASE_URL } from "../../config/api";

export const editOrganizationService = async (id: string, orgData: OrganizationRequest) => {

    const response = await fetch(`${BASE_URL}/organizations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orgData),
    });

    if (!response.ok) {
        throw new Error("Organization update failed");
    }

    const data = await response.json();
    return data;
};

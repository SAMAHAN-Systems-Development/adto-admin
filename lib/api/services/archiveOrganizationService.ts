import { BASE_URL } from "../../config/api";

export const archiveOrganizationService = async (id: string) => {
    const response = await fetch(`${BASE_URL}/organizations/${id}/archive`, {
        method: "PATCH",
    });

    if (!response.ok) {
        throw new Error("Event organization failed");
    }

    const data = await response.json();
    return data;
};

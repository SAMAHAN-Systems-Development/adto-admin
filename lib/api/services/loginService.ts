import { BASE_URL } from "../../config/api";
import { AdminLoginRequest } from "../../types/requests/AdminLoginRequest";

export const loginAdminUser = async (loginData: AdminLoginRequest) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data;
};

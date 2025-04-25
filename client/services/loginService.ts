import { BASE_URL } from "../config";
import { AdminLoginDto } from "../types/dto/admin-login.type";

export const loginClientUser = async (loginData: AdminLoginDto) => {
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

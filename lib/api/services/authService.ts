import { BASE_URL } from "../config";
import { AdminLoginDto } from "../types/dto/admin-login.type";
import { User, UserType } from "../types/user-type";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  sub: string;
  role: UserType;
  orgId?: string;
}

const TOKEN_KEY = 'auth_token';

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

// Create headers with Authorization if token exists
const createAuthHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };
  
  const token = getStoredToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

export const login = async (
  loginData: AdminLoginDto
): Promise<{ auth_token: string; user: User }> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Login failed" }));
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();

  const decodedToken = jwtDecode<DecodedToken>(data.auth_token);
  const user: User = {
    id: decodedToken.sub,
    email: decodedToken.email,
    role: decodedToken.role,
    orgId: decodedToken.orgId,
  };

  setStoredToken(data.auth_token);

  return { auth_token: data.auth_token, user };
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", 
    headers: createAuthHeaders(),
  });

  removeStoredToken();

  if (!response.ok) {
    throw new Error("Logout failed");
  }
};

export const getProfile = async (): Promise<User> => {
  const response = await fetch(`${BASE_URL}/auth/profile`, {
    method: "GET",
    credentials: "include", 
    headers: createAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear invalid token
      removeStoredToken();
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch profile");
  }

  const data = await response.json();
  return data as User;
};

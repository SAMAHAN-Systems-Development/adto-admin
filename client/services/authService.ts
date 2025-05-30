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
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && token.split('.').length === 3) {
      return token;
    }
    if (token) {
      localStorage.removeItem(TOKEN_KEY);
    }
    return null;
  } catch (error) {
    console.error('Error getting stored token:', error);
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  try {
    if (token && token.split('.').length === 3) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      console.error('Invalid token format, not storing');
    }
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const clearAllAuthData = (): void => {
  removeStoredToken();
};

// Create headers with Authorization if valid token exists
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

  removeStoredToken();
  
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Login failed" }));
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();

  if (!data.auth_token) {
    throw new Error("No token received from server");
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(data.auth_token);
    const user: User = {
      id: decodedToken.sub,
      email: decodedToken.email,
      role: decodedToken.role,
      orgId: decodedToken.orgId,
    };

    setStoredToken(data.auth_token);
    return { auth_token: data.auth_token, user };
  } catch (error) {
    console.error('Error decoding token:', error);
    throw new Error("Invalid token received from server");
  }
};

export const logout = async (): Promise<void> => {
  try {
    clearAllAuthData();
    
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Logout request failed, but token was cleared locally");
    }
  } catch (error) {
    console.error('Logout error:', error);
    clearAllAuthData();
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
      removeStoredToken();
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch profile");
  }

  const data = await response.json();
  return data as User;
};

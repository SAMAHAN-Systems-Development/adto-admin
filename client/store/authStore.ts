import { create } from "zustand";
import { User } from "../types/user-type";
import {
  getProfile,
  login as loginService,
  logout as logoutService,
} from "../services/authService";
import { AdminLoginDto } from "../types/dto/admin-login.type";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isCheckingSession: boolean;
  error: string | null;
  login: (loginData: AdminLoginDto) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isLoggingIn: false,
  isLoggingOut: false,
  isCheckingSession: true,
  error: null,

  login: async (loginData: AdminLoginDto) => {
    set({ isLoggingIn: true, error: null });
    try {
      const { user } = await loginService(loginData);
      set({
        user,
        isAuthenticated: true,
        isLoggingIn: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      set({
        error: errorMessage,
        isLoggingIn: false,
        isLoading: false,
        user: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoggingOut: true, error: null });
    try {
      await logoutService();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoggingOut: false,
        isLoading: false,
        error: null,
        isCheckingSession: false,
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      
      set({
        user: null,
        isAuthenticated: false,
        isLoggingOut: false,
        isLoading: false,
        error: null, 
        isCheckingSession: false,
      });
      
      console.warn('Logout error (local state cleared):', errorMessage);
    }
  },

  checkSession: async () => {
    set({ isCheckingSession: true, isLoading: true, error: null });
    try {
      const user = await getProfile();
      set({
        user,
        isAuthenticated: true,
        isCheckingSession: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage: string | null = null;
      if (error instanceof Error && error.message !== "Unauthorized") {
        errorMessage = error.message;
      }
      set({
        user: null,
        isAuthenticated: false,
        isCheckingSession: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));

if (typeof window !== "undefined") {
  setTimeout(() => {
    useAuthStore.getState().checkSession();
  }, 100);
}

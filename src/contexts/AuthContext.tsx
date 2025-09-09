import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService, type Admin } from "../services";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isSuspended: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token and fetch profile on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          await refreshProfile();
        } catch (error) {
          console.error("Failed to refresh profile:", error);
          localStorage.removeItem("access_token");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const refreshProfile = async (): Promise<void> => {
    try {
      const response = await authService.getAdminProfile();
      if (response.success && response.data) {
        const adminData: Admin = response.data.admin;
        const userData: User = {
          id: adminData.id,
          email: adminData.email,
          firstName: adminData.first_name,
          lastName: adminData.last_name,
          role: adminData.role,
          isActive: adminData.is_active,
          isSuspended: adminData.is_suspended,
        };
        setUser(userData);
      } else {
        throw new Error(response.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Profile refresh failed:", error);
      throw error;
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        const adminData: Admin = response.data.admin;
        const userData: User = {
          id: adminData.id,
          email: adminData.email,
          firstName: adminData.first_name,
          lastName: adminData.last_name,
          role: adminData.role,
          isActive: adminData.is_active,
          isSuspended: adminData.is_suspended,
        };

        // Store access token in localStorage for future API calls
        localStorage.setItem("access_token", response.data.access_token);
        setUser(userData);

        return { success: true };
      } else {
        return { success: false, error: response.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_BEZA_BRAND_API_URL || "";

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Global logout handler
let globalLogoutHandler: (() => void) | null = null;

export const setGlobalLogoutHandler = (logoutFn: () => void) => {
  globalLogoutHandler = logoutFn;
};

export const clearGlobalLogoutHandler = () => {
  globalLogoutHandler = null;
};

class BaseApiService {
  protected baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  protected getAuthToken(): string | null {
    return localStorage.getItem("access_token");
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized responses
        if (response.status === 401) {
          console.warn("401 Unauthorized response received. Logging out user.");
          if (globalLogoutHandler) {
            globalLogoutHandler();
          }
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }
}

export { BaseApiService, API_BASE_URL };

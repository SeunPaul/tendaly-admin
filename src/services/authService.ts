import { BaseApiService, API_BASE_URL } from "./baseApi";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  is_suspended: boolean;
}

export interface AdminProfileResponse {
  success: boolean;
  message: string;
  data: {
    admin: Admin;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    admin: Admin;
  };
}

class AuthService extends BaseApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getAdminProfile(): Promise<AdminProfileResponse> {
    return this.request<AdminProfileResponse>("/admin/profile", {
      method: "GET",
    });
  }
}

export const authService = new AuthService(API_BASE_URL);

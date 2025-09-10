import { BaseApiService, API_BASE_URL } from "./baseApi";

export interface Admin {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  is_suspended: boolean;
  suspended_at: string | null;
  suspension_reason: string | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface CreateAdminResponse {
  success: boolean;
  message: string;
  data: Admin;
}

export interface GetAdminsResponse {
  success: boolean;
  message: string;
  data: Admin[];
}

class AdminService extends BaseApiService {
  constructor() {
    super(API_BASE_URL);
  }

  async getAdmins(): Promise<GetAdminsResponse> {
    return this.request<GetAdminsResponse>("/admin", {
      method: "GET",
    });
  }

  async createAdmin(data: CreateAdminRequest): Promise<CreateAdminResponse> {
    return this.request<CreateAdminResponse>("/admin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const adminService = new AdminService();

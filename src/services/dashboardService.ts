import { BaseApiService, API_BASE_URL } from "./baseApi";

export interface DashboardMetric {
  value: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

export interface UserTypeDistribution {
  totalUsers: number;
  caregivers: number;
  careseekers: number;
}

export interface DashboardData {
  totalCaregivers: DashboardMetric;
  totalUsers: DashboardMetric;
  activeUsers: DashboardMetric;
  deactivatedAccounts: DashboardMetric;
  bookings: DashboardMetric;
  totalRevenue: DashboardMetric;
  userTypeDistribution: UserTypeDistribution;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

class DashboardService extends BaseApiService {
  constructor() {
    super(API_BASE_URL);
  }

  async getDashboard(): Promise<DashboardResponse> {
    return this.request<DashboardResponse>("/admin/dashboard", {
      method: "GET",
    });
  }
}

export const dashboardService = new DashboardService();

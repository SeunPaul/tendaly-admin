// Export all services from a central location
export { authService } from "./authService";
export { dashboardService } from "./dashboardService";
export { caregiversService } from "./caregiversService";

// Export types
export type {
  LoginRequest,
  Admin,
  LoginResponse,
  AdminProfileResponse,
} from "./authService";
export type {
  DashboardMetric,
  UserTypeDistribution,
  DashboardData,
  DashboardResponse,
} from "./dashboardService";
export type {
  CaregiverMetric,
  VerifiedCaregiverMetric,
  CaregiverMetrics,
  Caregiver,
  Pagination,
  SortOptions,
  CaregiversQueryParams,
  CaregiversResponse,
  CaregiverProfileResponse,
  CaregiverUser,
  CaregiverProfile,
  KycProfile,
  KycVerificationRequest,
  KycVerificationResponse,
  Language,
  CareType,
  ServiceType,
} from "./caregiversService";
export type { ApiError } from "./baseApi";

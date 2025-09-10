// Export all services from a central location
export { authService } from "./authService";
export { dashboardService } from "./dashboardService";
export { caregiversService } from "./caregiversService";
export { careSeekersService } from "./careSeekersService";
export { adminService } from "./adminService";
export { emailService } from "./emailService";

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
export type {
  Admin as AdminUser,
  CreateAdminRequest,
  CreateAdminResponse,
  GetAdminsResponse,
} from "./adminService";
export type { SendEmailRequest, SendEmailResponse } from "./emailService";
export type {
  CareSeeker,
  CareSeekersQueryParams,
  CareSeekerMetrics,
  CareSeekersPagination,
  CareSeekersSort,
  CareSeekersResponse,
  Country,
  CareSeekerUser,
  CareSeekerKycProfile,
  CareSeekerProfileResponse,
} from "./careSeekersService";
export type { ApiError } from "./baseApi";

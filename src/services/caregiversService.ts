import { BaseApiService, API_BASE_URL } from "./baseApi";

export interface CaregiverMetric {
  value: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

export interface VerifiedCaregiverMetric {
  value: number;
  pendingVerification: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

export interface CaregiverMetrics {
  totalCaregivers: CaregiverMetric;
  verifiedCaregivers: VerifiedCaregiverMetric;
  caregiversWithActiveJobs: CaregiverMetric;
}

export interface Caregiver {
  id: string;
  full_name: string;
  email: string;
  type: string;
  account_created: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortOptions {
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

export interface CaregiversQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface CaregiversResponse {
  success: boolean;
  message: string;
  data: {
    metrics: CaregiverMetrics;
    caregivers: Caregiver[];
    pagination: Pagination;
    sort: SortOptions;
  };
}

// Caregiver profile (single) types
export interface UserCountry {
  id: string;
  created_at: string;
  modified_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export interface CaregiverUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  dob: string | null;
  phone_number: string | null;
  address: string | null;
  zip_code: string | null;
  profile_photo: string | null;
  user_type: string;
  country: UserCountry | null;
  created_at: string;
  modified_at: string;
}

export interface CaregiverCertificate {
  id: string;
  created_at: string;
  modified_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  issuing_organization: string | null;
  license_number: string | null;
  issue_date: string | null;
  expiration_date: string | null;
  certificate_url: string | null;
}

export interface Language {
  id: string;
  created_at: string;
  modified_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  name: string;
}

export interface CareType {
  id: string;
  created_at: string;
  modified_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  name: string;
}

export interface ServiceType {
  id: string;
  created_at: string;
  modified_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  name: string;
}

export interface CaregiverProfile {
  id: string;
  created_at: string;
  modified_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  about: string | null;
  video_intro: string | null;
  years_of_experience: number | null;
  summary_of_experience: string | null;
  service_address: string | null;
  service_longitude: string | null;
  service_latitude: string | null;
  service_radius: number | null;
  can_travel: boolean | null;
  can_provide_live_in_care: boolean | null;
  hourly_rate: number | null;
  accept_booking: boolean | null;
  certificates: CaregiverCertificate[] | null;
  languages: Language[] | null;
  care_types: CareType[] | null;
  service_types: ServiceType[] | null;
}

export interface KycProfile {
  id: string;
  created_at: string;
  modified_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  valid_id_type: string | null;
  valid_id_front: string | null;
  valid_id_back: string | null;
  work_authorization_type: string | null;
  work_permit_front: string | null;
  work_permit_back: string | null;
  ein_tin_number: string | null;
  ssn: string | null;
  passport_photo: string | null;
  valid_id_verified: boolean | null;
  work_authorization_verified: boolean | null;
  passport_verified: boolean | null;
  allow_background_check: boolean | null;
}

export interface CaregiverProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: CaregiverUser;
    caregiver_profile: CaregiverProfile | null;
    kyc_profile: KycProfile | null;
  };
}

// KYC Verification types
export interface KycVerificationRequest {
  verified: boolean;
}

export interface KycVerificationResponse {
  success: boolean;
  message: string;
  data: {
    user_id: string;
    verification_type: string;
    verified: boolean;
    verified_by: string;
    verified_at: string;
  };
}

class CaregiversService extends BaseApiService {
  async getCaregivers(
    params: CaregiversQueryParams = {}
  ): Promise<CaregiversResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = `/users/caregivers${queryString ? `?${queryString}` : ""}`;

    return this.request<CaregiversResponse>(endpoint, {
      method: "GET",
    });
  }

  async getCaregiverById(id: string): Promise<CaregiverProfileResponse> {
    const endpoint = `/users/caregivers/${id}`;
    return this.request<CaregiverProfileResponse>(endpoint, { method: "GET" });
  }

  async verifyValidId(
    userId: string,
    verified: boolean
  ): Promise<KycVerificationResponse> {
    const endpoint = `/kyc/admin/${userId}/verify-valid-id`;
    return this.request<KycVerificationResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ verified }),
    });
  }

  async verifyWorkAuthorization(
    userId: string,
    verified: boolean
  ): Promise<KycVerificationResponse> {
    const endpoint = `/kyc/admin/${userId}/verify-work-authorization`;
    return this.request<KycVerificationResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ verified }),
    });
  }

  async verifyPassport(
    userId: string,
    verified: boolean
  ): Promise<KycVerificationResponse> {
    const endpoint = `/kyc/admin/${userId}/verify-passport`;
    return this.request<KycVerificationResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({ verified }),
    });
  }
}

export const caregiversService = new CaregiversService(API_BASE_URL);

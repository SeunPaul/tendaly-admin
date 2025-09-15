import { BaseApiService, API_BASE_URL, type ApiError } from "./baseApi";

export interface CareSeekerMetrics {
  totalCareSeekers: {
    value: number;
    change: string;
    changeType: "positive" | "negative" | "neutral";
  };
  verifiedCareSeekers: {
    value: number;
    pendingVerification: number;
    change: string;
    changeType: "positive" | "negative" | "neutral";
  };
  jobsPostedByCareseekers: {
    value: number;
    change: string;
    changeType: "positive" | "negative" | "neutral";
  };
}

export interface CareSeeker {
  id: string;
  full_name: string;
  email: string;
  type: string;
  account_created: string;
}

export interface CareSeekersQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface CareSeekersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CareSeekersSort {
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

export interface CareSeekersResponse {
  success: boolean;
  message: string;
  data: {
    metrics: CareSeekerMetrics;
    careSeekers: CareSeeker[];
    pagination: CareSeekersPagination;
    sort: CareSeekersSort;
  };
}

export interface Country {
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

export interface CareSeekerUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  phone_number: string;
  address: string;
  zip_code: string;
  profile_photo: string | null;
  user_type: string;
  country: Country | null;
  created_at: string;
  modified_at: string;
}

export interface CareSeekerKycProfile {
  id: string;
  created_at: string;
  modified_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
  valid_id_type: string;
  valid_id_front: string | null;
  valid_id_back: string | null;
  work_authorization_type: string | null;
  work_permit_front: string | null;
  work_permit_back: string | null;
  ein_tin_number: string | null;
  ssn: string | null;
  passport_photo: string | null;
  valid_id_verified: boolean;
  work_authorization_verified: boolean;
  passport_verified: boolean;
  allow_background_check: boolean;
}

export interface CareSeekerProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: CareSeekerUser;
    kyc_profile: CareSeekerKycProfile | null;
  };
}

export interface KycVerificationResponse {
  success: boolean;
  message: string;
}

class CareSeekersService extends BaseApiService {
  constructor() {
    super(API_BASE_URL);
  }

  async getCareSeekers(
    params?: CareSeekersQueryParams
  ): Promise<CareSeekersResponse | ApiError> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/users/careseekers?${queryString}`
      : "/users/careseekers";

    return this.request<CareSeekersResponse>(url, {
      method: "GET",
    });
  }

  async getCareSeekerProfile(
    id: string
  ): Promise<CareSeekerProfileResponse | ApiError> {
    return this.request<CareSeekerProfileResponse>(`/users/careseekers/${id}`, {
      method: "GET",
    });
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

export const careSeekersService = new CareSeekersService();

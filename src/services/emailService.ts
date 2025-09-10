import { BaseApiService, API_BASE_URL } from "./baseApi";

export interface SendEmailRequest {
  recipient_email: string;
  title: string;
  body: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  data: {
    recipient_email: string;
    title: string;
    sent_at: string;
  };
}

class EmailService extends BaseApiService {
  constructor() {
    super(API_BASE_URL);
  }

  async sendEmail(data: SendEmailRequest): Promise<SendEmailResponse> {
    return this.request<SendEmailResponse>("/admin/send-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const emailService = new EmailService();

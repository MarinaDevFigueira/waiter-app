export interface GetBusinessSettingsResponse {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  enabledLanguages: string[];
  businessId?: string | null;
}

export interface UpdateBusinessSettingsRequestBody {
  primaryColor?: string;
  secondaryColor?: string;
  enabledLanguages?: string[];
}

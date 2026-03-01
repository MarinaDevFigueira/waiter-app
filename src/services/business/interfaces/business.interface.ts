import type { Business } from "@/shared/schemas/business.schema";

export interface GetBusinessItemResponse {
  id: string;
  name: string;
  logoUrl: string | null;
  city: string | null;
  state: string | null;
  createdAt: string;
}

export interface GetBusinessesApiResponse {
  items: GetBusinessItemResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface GetBusinessSettingsResponse {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  enabledLanguages: string[];
  businessId?: string | null;
}

export interface GetBusinessLimitsResponse {
  id: string | null;
  maxTableUsers: number;
  maxWaiterUsers: number;
  maxKitchenUsers: number;
  maxAttendantUsers: number;
  businessId?: string | null;
}

export interface GetBusinessDetailResponse {
  id: string;
  name: string;
  logoUrl: string | null;
  ownerId: string;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  settingsId: string | null;
  limitsId: string | null;
  createdAt: string;
  updatedAt: string;
  settings: GetBusinessSettingsResponse | null;
  limits: GetBusinessLimitsResponse | null;
}

export interface GetBusinessesRequestQuery {
  page: number;
  size: number;
  filters?: {
    search?: string;
    includeDeleted?: boolean;
  };
}

export interface UpdateBusinessRequestBody {
  name?: string;
  logoUrl?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipCode?: string | null;
}

export interface GetBusinessesResponse {
  items: Business[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

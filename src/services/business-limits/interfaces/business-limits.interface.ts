export interface GetBusinessLimitsResponse {
  id: string | null;
  maxTableUsers: number;
  maxWaiterUsers: number;
  maxKitchenUsers: number;
  maxAttendantUsers: number;
  businessId?: string | null;
}

export interface UserLimit {
  max: number;
  used: number;
}

export interface GetBusinessLimitsResponse {
  id: string;
  businessId: string;
  tableUsers: UserLimit;
  waiterUsers: UserLimit;
  kitchenUsers: UserLimit;
  attendantUsers: UserLimit;
}

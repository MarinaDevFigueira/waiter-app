export interface GetOrderSessionResponse {
  id: string;
  tableUserId: string;
  businessId: string;
  status: string;
  openedAt: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrderSessionSummaryItemResponse {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface GetOrderSessionSummaryOrderResponse {
  id: string;
  status: string;
  timestamp: string;
  items: GetOrderSessionSummaryItemResponse[];
}

export interface GetOrderSessionSummaryResponse {
  orderSession: GetOrderSessionResponse;
  orders: GetOrderSessionSummaryOrderResponse[];
  totalAmount: number;
}

export interface OrderSession {
  id: string;
  tableUserId: string;
  businessId: string;
  status: string;
  openedAt: Date;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderSessionSummaryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderSessionSummaryOrder {
  id: string;
  status: string;
  timestamp: Date;
  items: OrderSessionSummaryItem[];
}

export interface OrderSessionSummary {
  orderSession: OrderSession;
  orders: OrderSessionSummaryOrder[];
  totalAmount: number;
}

import { z } from "zod";

export const apiOrderSessionSchema = z.object({
  id: z.string(),
  tableUserId: z.string(),
  businessId: z.string(),
  status: z.string(),
  openedAt: z.string(),
  closedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const apiSummaryOrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const apiSummaryOrderSchema = z.object({
  id: z.string(),
  status: z.string(),
  timestamp: z.string(),
  items: z.array(apiSummaryOrderItemSchema),
});

export const apiOrderSessionSummarySchema = z.object({
  orderSession: apiOrderSessionSchema,
  orders: z.array(apiSummaryOrderSchema),
  totalAmount: z.number(),
});

export type ApiOrderSession = z.infer<typeof apiOrderSessionSchema>;
export type ApiSummaryOrderItem = z.infer<typeof apiSummaryOrderItemSchema>;
export type ApiSummaryOrder = z.infer<typeof apiSummaryOrderSchema>;
export type ApiOrderSessionSummary = z.infer<typeof apiOrderSessionSummarySchema>;

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

export interface SummaryOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface SummaryOrder {
  id: string;
  status: string;
  timestamp: Date;
  items: SummaryOrderItem[];
}

export interface OrderSessionSummary {
  orderSession: OrderSession;
  orders: SummaryOrder[];
  totalAmount: number;
}

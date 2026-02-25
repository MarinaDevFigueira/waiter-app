import { z } from "zod";

export const apiOrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const apiOrderSchema = z.object({
  id: z.string(),
  userName: z.string(),
  status: z.enum(["pending", "preparing", "ready", "canceled"]),
  timestamp: z.string(),
  items: z.array(apiOrderItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const apiOrderListSchema = z.object({
  items: z.array(apiOrderSchema),
});

export const apiOrderPaginatedListSchema = z.object({
  items: z.array(apiOrderSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const createOrderRequestSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1),
  orderSessionId: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "canceled"]),
});

export type ApiOrder = z.infer<typeof apiOrderSchema>;
export type ApiOrderPaginatedList = z.infer<typeof apiOrderPaginatedListSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;

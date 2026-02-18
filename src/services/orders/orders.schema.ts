import { z } from "zod";

export const apiOrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const apiOrderSchema = z.object({
  id: z.string(),
  tableNumber: z.string(),
  status: z.enum(["pending", "preparing", "ready"]),
  timestamp: z.string(),
  items: z.array(apiOrderItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const apiOrderListSchema = z.object({
  items: z.array(apiOrderSchema),
});

export const createOrderRequestSchema = z.object({
  tableNumber: z.string().min(1),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "ready"]),
});

export type ApiOrder = z.infer<typeof apiOrderSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;

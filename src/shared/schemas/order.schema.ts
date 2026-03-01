import { z } from "zod";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

export const orderItemSchema = z.object({
  name: z.string().min(1, { message: "Nome do item é obrigatório" }),
  quantity: z
    .number()
    .int({ message: "Quantidade deve ser um número inteiro" })
    .positive({ message: "Quantidade deve ser positiva" }),
  preco: z.number().positive({ message: "Preço deve ser positivo" }),
});

export const orderSchema = baseEntitySchema.extend({
  id: z.string(),
  userName: z.string(),
  items: z
    .array(orderItemSchema)
    .min(1, { message: "Pedido deve ter pelo menos um item" }),
  status: z.enum(["pending", "preparing", "ready", "waiting_delivery_man", "in_delivery", "delivered", "finished", "canceled"]),
  timestamp: z.date(),
});

export const orderFormSchema = orderSchema.omit({
  id: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
  deletedAt: true,
  deletedBy: true,
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderForm = z.infer<typeof orderFormSchema>;
export type OrderStatus = "pending" | "preparing" | "ready" | "waiting_delivery_man" | "in_delivery" | "delivered" | "finished" | "canceled";

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
  table: z.string().min(1, { message: "Mesa é obrigatória" }),
  items: z
    .array(orderItemSchema)
    .min(1, { message: "Pedido deve ter pelo menos um item" }),
  status: z.enum(["pending", "preparing", "ready"]),
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

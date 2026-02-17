import { z } from "zod";

export const baseEntitySchema = z.object({
  createdAt: z.date(),
  createdBy: z.string(),
  updatedAt: z.date(),
  updatedBy: z.string(),
  deletedAt: z.date().nullable(),
  deletedBy: z.string().nullable(),
});

export const baseEntityDefaults = {
  createdAt: new Date(),
  createdBy: "system",
  updatedAt: new Date(),
  updatedBy: "system",
  deletedAt: null,
  deletedBy: null,
};

export type BaseEntity = z.infer<typeof baseEntitySchema>;

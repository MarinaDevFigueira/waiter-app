import { z } from "zod";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { baseEntitySchema } from "@/shared/schemas/base-entity.schema";

const ROLE_VALUES = Object.values(UserRoleEnum) as [string, ...string[]];

export const userSchema = baseEntitySchema.extend({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  role: z.enum(ROLE_VALUES),
  document: z.string().nullable(),
  documentType: z.enum(["cpf", "rg"]).nullable(),
  birthDate: z.string().nullable(),
  businessId: z.string().nullable(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  deletedAt: z.coerce.date().optional(),
  deletedBy: z.string().nullable().optional(),
  permissions: z.array(z.string()).optional(),
});

export type User = z.infer<typeof userSchema>;

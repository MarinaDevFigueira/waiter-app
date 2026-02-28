import { z } from "zod";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";

const ROLE_VALUES = Object.values(UserRoleEnum) as [string, ...string[]];

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  role: z.enum(ROLE_VALUES),
  document: z.string().nullable(),
  documentType: z.enum(["cpf", "rg"]).nullable(),
  birthDate: z.string().nullable(),
  businessId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().optional(),
});

export type User = z.infer<typeof userSchema>;
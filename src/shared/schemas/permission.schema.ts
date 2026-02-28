import { z } from "zod";

export const permissionSchema = z.object({
  name: z.string(),
  module: z.string(),
  source: z.enum(["role", "custom"]).optional(),
});

export const userPermissionsResponseSchema = z.object({
  userId: z.string(),
  role: z.string(),
  permissions: z.array(permissionSchema),
});

export const permissionCatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  module: z.string(),
});

export const permissionsCatalogResponseSchema = z.object({
  permissions: z.array(permissionCatalogItemSchema),
});

export type Permission = z.infer<typeof permissionSchema>;
export type UserPermissionsResponse = z.infer<typeof userPermissionsResponseSchema>;
export type PermissionCatalogItem = z.infer<typeof permissionCatalogItemSchema>;
export type PermissionsCatalogResponse = z.infer<typeof permissionsCatalogResponseSchema>;

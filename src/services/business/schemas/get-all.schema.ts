import { z } from "zod";

export const apiBusinessItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  createdAt: z.string(),
});

export const apiPaginatedBusinessSchema = z.object({
  items: z.array(apiBusinessItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

export interface BusinessQueryParams {
  page: number;
  size: number;
  filters?: {
    search?: string;
    includeDeleted?: boolean;
  };
}

export type ApiBusinessItem = z.infer<typeof apiBusinessItemSchema>;
export type ApiPaginatedBusiness = z.infer<typeof apiPaginatedBusinessSchema>;

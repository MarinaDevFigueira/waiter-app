import { logger } from "@/lib/logger";

const API_URL = import.meta.env.VITE_API_URL as string;

type ApiSuccess<T> = { data: T };
type ApiError = { error: string };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const allCookies = document.cookie;
    const hasCookies = allCookies.length > 0;
    if (hasCookies) {
      headers["Cookie"] = allCookies;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const json = await response.json().catch(() => ({}));
    const isSuccess = response.ok;
    if (!isSuccess) {
      const message = (json as { message?: string }).message ?? `Erro ${response.status}`;
      return { error: message };
    }

    return { data: json as T };
  } catch (error) {
    logger.error("Erro na requisição", error instanceof Error ? error : new Error(String(error)));
    const errorMessage = error instanceof Error ? error.message : "Erro de conexão com o servidor";
    return { error: errorMessage };
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  postFormData: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "POST", body: formData }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  putFormData: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: "PUT", body: formData }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

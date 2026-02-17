import { StorageKeys } from "@/shared/constants/storage-keys";

const API_URL = import.meta.env.VITE_API_URL as string;

type ApiSuccess<T> = { data: T };
type ApiError = { error: string };
type ApiResult<T> = ApiSuccess<T> | ApiError;

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const accessToken = sessionStorage.getItem(StorageKeys.ACCESS_TOKEN);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });

    const json = await response.json().catch(() => ({}));

    const isSuccess = response.ok;
    if (!isSuccess) {
      const message =
        (json as { message?: string }).message ?? `Erro ${response.status}`;
      return { error: message };
    }

    return { data: json as T };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro de conexão com o servidor";
    return { error: errorMessage };
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

import { StorageKeys } from "@/shared/constants/storage-keys";
import { authObservable } from "@/shared/subjects/auth";
import { logger } from "@/lib/logger";

const API_URL = import.meta.env.VITE_API_URL as string;
const FIVE_MINUTES_IN_SECONDS = 5 * 60;

type ApiSuccess<T> = { data: T };
type ApiError = { error: string };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

interface JwtPayload {
  exp: number;
  sub: string;
  role: string;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    const hasThreeParts = parts.length === 3;
    if (!hasThreeParts) return null;

    const payload = JSON.parse(atob(parts[1])) as JwtPayload;
    return payload;
  } catch {
    return null;
  }
}

function isTokenExpiredOrExpiringSoon(token: string): boolean {
  const payload = decodeJwtPayload(token);
  const isInvalidPayload = payload === null;
  if (isInvalidPayload) return true;

  const nowInSeconds = Date.now() / 1000;
  const secondsUntilExpiry = payload.exp - nowInSeconds;

  return secondsUntilExpiry < FIVE_MINUTES_IN_SECONDS;
}

let ongoingRefresh: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  try {
    const refreshToken = sessionStorage.getItem(StorageKeys.REFRESH_TOKEN);
    const hasNoRefreshToken = !refreshToken;
    if (hasNoRefreshToken) {
      authObservable.clearAuth();
      return false;
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const isSuccess = response.ok;
    if (!isSuccess) {
      authObservable.clearAuth();
      return false;
    }

    const json = await response.json() as { accessToken: string; refreshToken: string };
    sessionStorage.setItem(StorageKeys.ACCESS_TOKEN, json.accessToken);
    sessionStorage.setItem(StorageKeys.REFRESH_TOKEN, json.refreshToken);

    return true;
  } catch (error) {
    logger.error("Falha ao renovar token", error instanceof Error ? error : new Error(String(error)));
    authObservable.clearAuth();
    return false;
  }
}

async function refreshTokens(): Promise<boolean> {
  const isAlreadyRefreshing = ongoingRefresh !== null;
  if (isAlreadyRefreshing) return ongoingRefresh as Promise<boolean>;

  ongoingRefresh = doRefresh().finally(() => {
    ongoingRefresh = null;
  });

  return ongoingRefresh;
}

async function ensureFreshToken(): Promise<void> {
  const accessToken = sessionStorage.getItem(StorageKeys.ACCESS_TOKEN);
  const hasNoToken = !accessToken;
  if (hasNoToken) return;

  const needsRefresh = isTokenExpiredOrExpiringSoon(accessToken);
  if (!needsRefresh) return;

  await refreshTokens();
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    await ensureFreshToken();

    const accessToken = sessionStorage.getItem(StorageKeys.ACCESS_TOKEN);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });

    const isUnauthorized = response.status === 401;
    if (isUnauthorized) {
      const refreshed = await refreshTokens();
      const refreshFailed = !refreshed;
      if (refreshFailed) {
        return { error: "Sessão expirada. Faça login novamente." };
      }

      const newToken = sessionStorage.getItem(StorageKeys.ACCESS_TOKEN);
      const retryHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
        ...options.headers,
      };

      const retryResponse = await fetch(`${API_URL}${path}`, { ...options, headers: retryHeaders });
      const retryJson = await retryResponse.json().catch(() => ({}));

      const retrySuccess = retryResponse.ok;
      if (!retrySuccess) {
        const message = (retryJson as { message?: string }).message ?? `Erro ${retryResponse.status}`;
        return { error: message };
      }

      return { data: retryJson as T };
    }

    const json = await response.json().catch(() => ({}));

    const isSuccess = response.ok;
    if (!isSuccess) {
      const message = (json as { message?: string }).message ?? `Erro ${response.status}`;
      return { error: message };
    }

    return { data: json as T };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro de conexão com o servidor";
    return { error: errorMessage };
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

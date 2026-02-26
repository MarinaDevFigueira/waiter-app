import { api } from "@/services/api";
import { authObservable } from "@/shared/subjects/auth";
import { StorageKeys } from "@/shared/constants/storage-keys";
import { UserProfileEnum } from "@/shared/constants/user-profile";
import type { AuthData } from "@/shared/subjects/auth";

type LoginSuccess = { data: AuthData };
type LoginError = { error: string };
type LoginResult = LoginSuccess | LoginError;

type LogoutResult = { data: { success: true } };

type GetCurrentUserResult = { data: AuthData } | { error: string };

interface LoginApiResponse {
  user: {
    id: string;
    name: string;
    email: string | null;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

const roleToProfile: Record<string, UserProfileEnum> = {
  admin: UserProfileEnum.ADMIN,
  table: UserProfileEnum.MESA,
  kitchen: UserProfileEnum.COZINHA,
  customer: UserProfileEnum.DELIVERY,
  attendant: UserProfileEnum.ATTENDANT,
  owner: UserProfileEnum.OWNER
};

class AuthService {
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const result = await api.post<LoginApiResponse>("/auth/login", {
        credential: username,
        password,
      });

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const { user, accessToken, refreshToken } = result.data;

      sessionStorage.setItem(StorageKeys.ACCESS_TOKEN, accessToken);
      sessionStorage.setItem(StorageKeys.REFRESH_TOKEN, refreshToken);

      const profile = roleToProfile[user.role] ?? UserProfileEnum.ATTENDANT;

      const authData: AuthData = {
        username: user.email ?? username,
        name: user.name,
        profile,
      };

      authObservable.setAuth(authData);

      return { data: authData };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer login";
      return { error: errorMessage };
    }
  }

  async logout(): Promise<LogoutResult> {
    try {
      authObservable.clearAuth();
      return { data: { success: true } };
    } catch (error) {
      authObservable.clearAuth();
      return { data: { success: true } };
    }
  }

  getCurrentUser(): GetCurrentUserResult {
    try {
      const auth = sessionStorage.getItem(StorageKeys.AUTH);
      const hasAuth = auth !== null;
      if (hasAuth && auth) {
        return { data: JSON.parse(auth) as AuthData };
      }
      return { error: "Usuário não autenticado" };
    } catch (error) {
      return { error: "Erro ao obter usuário atual" };
    }
  }
}

export const authService = new AuthService();

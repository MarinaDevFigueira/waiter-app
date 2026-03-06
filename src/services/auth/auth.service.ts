import { api } from "@/services/api";
import { authObservable } from "@/shared/subjects/auth";
import { permissionsObservable } from "@/shared/subjects/permissions.subject";
import { StorageKeys } from "@/shared/constants/storage-keys";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { permissionsService } from "@/services/permissions/permissions.service";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/query-client";
import { cookies } from "@/lib/cookies";
import { PERMISSIONS_QUERY_KEY } from "@/shared/hooks/useUserPermissions";
import type { AuthData } from "@/shared/subjects/auth";
import type { GetAuthMeResponse } from "./interfaces/auth.interface";

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

const roleToProfile: Record<string, UserRoleEnum> = {
  admin: UserRoleEnum.ADMIN,
  table: UserRoleEnum.TABLE,
  kitchen: UserRoleEnum.KITCHEN,
  customer: UserRoleEnum.CUSTOMER,
  attendant: UserRoleEnum.ATTENDANT,
  owner: UserRoleEnum.OWNER,
  system_manager: UserRoleEnum.SYSTEM_MANAGER
};

type HandleOAuthTokensResult = { data: AuthData } | { error: string };

class AuthService {
  async login(username: string, password: string): Promise<LoginResult> {
    try {
      cookies.safeClearAll();

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

      const profile = roleToProfile[user.role.toLowerCase()] ?? UserRoleEnum.ATTENDANT;

      const authData: AuthData = {
        username: user.email ?? username,
        name: user.name,
        profile,
      };

      authObservable.setAuth(authData);

      const permissionsResult = await permissionsService.getMyPermissions();
      const hasPermissionsError = "error" in permissionsResult;
      if (hasPermissionsError) {
        logger.error(
          "[authService.login] Erro ao carregar permissões",
          new Error(permissionsResult.error)
        );
      } else {
        permissionsObservable.setPermissions({
          userId: permissionsResult.data.userId,
          role: permissionsResult.data.role,
          permissions: permissionsResult.data.permissions,
        });
      }

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
      permissionsObservable.clear();
      queryClient.removeQueries({ queryKey: PERMISSIONS_QUERY_KEY });
      queryClient.clear();
      sessionStorage.removeItem(StorageKeys.ACCESS_TOKEN);
      sessionStorage.removeItem(StorageKeys.REFRESH_TOKEN);
      cookies.safeClearAll();
      return { data: { success: true } };
    } catch (error) {
      authObservable.clearAuth();
      permissionsObservable.clear();
      queryClient.clear();
      sessionStorage.removeItem(StorageKeys.ACCESS_TOKEN);
      sessionStorage.removeItem(StorageKeys.REFRESH_TOKEN);
      cookies.safeClearAll();
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

  async getMe(): Promise<{ data: GetAuthMeResponse } | { error: string }> {
    try {
      const result = await api.get<GetAuthMeResponse>("/auth/me");

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      return { data: result.data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar dados do usuário";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  }

  async handleGoogleOAuthTokens(
    accessToken: string,
    refreshToken: string
  ): Promise<HandleOAuthTokensResult> {
    try {
      cookies.safeClearAll();

      sessionStorage.setItem(StorageKeys.ACCESS_TOKEN, accessToken);
      sessionStorage.setItem(StorageKeys.REFRESH_TOKEN, refreshToken);

      const userResult = await this.getMe();

      const hasUserError = "error" in userResult;
      if (hasUserError) {
        return { error: userResult.error };
      }

      const user = userResult.data;
      const profile = roleToProfile[user.role.toLowerCase()] ?? UserRoleEnum.ATTENDANT;

      const authData: AuthData = {
        username: user.email ?? user.name,
        name: user.name,
        profile,
      };

      authObservable.setAuth(authData);

      const permissionsResult = await permissionsService.getMyPermissions();
      const hasPermissionsError = "error" in permissionsResult;
      if (hasPermissionsError) {
        logger.error(
          "[authService.handleGoogleOAuthTokens] Erro ao carregar permissões",
          new Error(permissionsResult.error)
        );
      } else {
        permissionsObservable.setPermissions({
          userId: permissionsResult.data.userId,
          role: permissionsResult.data.role,
          permissions: permissionsResult.data.permissions,
        });
      }

      return { data: authData };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao autenticar com Google";
      return { error: errorMessage };
    }
  }
}

export const authService = new AuthService();

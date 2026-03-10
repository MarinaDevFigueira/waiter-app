import { api } from "@/services/api";
import { authObservable, roleToProfile } from "@/shared/subjects/auth";
import { permissionsObservable } from "@/shared/subjects/permissions.subject";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { permissionsService } from "@/services/permissions/permissions.service";
import { logger } from "@/lib/logger";
import { queryClient } from "@/lib/query-client";
import { cookies } from "@/lib/cookies";
import { PERMISSIONS_QUERY_KEY } from "@/shared/hooks/useUserPermissions";
import type { AuthData } from "@/shared/subjects/auth";
import type { GetAuthMeResponse, OAuthTokenResponse } from "./interfaces/auth.interface";

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
}

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

      const { user } = result.data;
      const profile = roleToProfile[user.role.toLowerCase()] ?? UserRoleEnum.ATTENDANT;

      const authData: AuthData = {
        userId: user.id,
        username: user.email ?? username,
        name: user.name,
        email: user.email,
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

  async serverLogout(): Promise<{ data: void } | { error: string }> {
    try {
      const result = await api.post<void>("/auth/logout", {});
      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }
      return { data: undefined };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer logout no servidor";
      logger.error("[authService.serverLogout] Falha ao chamar endpoint de logout", error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  }

  async logout(): Promise<LogoutResult> {
    await this.serverLogout();

    authObservable.clearAuth();
    permissionsObservable.clear();
    queryClient.removeQueries({ queryKey: PERMISSIONS_QUERY_KEY });
    queryClient.clear();
    cookies.safeClearAll();
    return { data: { success: true } };
  }

  getCurrentUser(): GetCurrentUserResult {
    const auth = authObservable.getValue();
    const hasAuth = auth !== null;
    if (hasAuth) {
      return { data: auth };
    }
    return { error: "Usuário não autenticado" };
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

  async handleGoogleOAuthTokens(oauthtoken: string): Promise<HandleOAuthTokensResult> {
    try {
      const result = await api.post<OAuthTokenResponse>("/auth/oauth/token", { oauthtoken });

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const { user } = result.data;
      const profile = roleToProfile[user.role.toLowerCase()] ?? UserRoleEnum.ATTENDANT;

      const authData: AuthData = {
        userId: user.id,
        username: user.email ?? user.name,
        name: user.name,
        email: user.email,
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

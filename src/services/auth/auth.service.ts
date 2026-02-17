import { mockUsers } from "@/shared/mocks/users";
import { authObservable } from "@/shared/subjects/auth";
import type { AuthData } from "@/shared/subjects/auth";

type LoginSuccess = { data: AuthData };
type LoginError = { error: string };
type LoginResult = LoginSuccess | LoginError;

type LogoutResult = { data: { success: true } };

type GetCurrentUserResult = { data: AuthData } | { error: string };

class AuthService {
  async login(username: string, password: string): Promise<LoginResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.username === username && u.password === password
        );

        const userFound = user !== undefined;
        if (userFound && user) {
          const authData: AuthData = {
            username: user.username,
            name: user.name,
            profile: user.profile,
          };

          authObservable.setAuth(authData);

          resolve({ data: authData });
        } else {
          resolve({ error: "Usuário ou senha inválidos" });
        }
      }, 500);
    });
  }

  async logout(): Promise<LogoutResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        authObservable.clearAuth();
        resolve({ data: { success: true } });
      }, 300);
    });
  }

  getCurrentUser(): GetCurrentUserResult {
    const auth = sessionStorage.getItem("auth");
    const hasAuth = auth !== null;
    if (hasAuth && auth) {
      return { data: JSON.parse(auth) as AuthData };
    }
    return { error: "Usuário não autenticado" };
  }
}

export const authService = new AuthService();

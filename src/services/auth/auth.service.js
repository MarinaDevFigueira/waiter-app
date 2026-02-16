import { mockUsers } from "@/shared/mocks/users";
import { authObservable } from "@/shared/subjects/auth";

class AuthService {
  async login(username, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.username === username && u.password === password
        );

        const userFound = user !== undefined;
        if (userFound) {
          const authData = {
            username: user.username,
            name: user.name,
            profile: user.profile,
            token: `mock-token-${user.username}-${Date.now()}`,
          };

          authObservable.setAuth(authData);

          resolve({ data: authData });
        } else {
          resolve({ error: "Usuário ou senha inválidos" });
        }
      }, 500);
    });
  }

  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        authObservable.clearAuth();
        resolve({ data: { success: true } });
      }, 300);
    });
  }

  getCurrentUser() {
    const auth = sessionStorage.getItem("auth");
    const hasAuth = auth !== null;
    if (hasAuth) {
      return { data: JSON.parse(auth) };
    }
    return { error: "Usuário não autenticado" };
  }
}

export const authService = new AuthService();

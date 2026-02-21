# Auth service pattern with RxJS observables

All authentication logic must use RxJS BehaviorSubjects and return structured responses.

## Rule

- Auth state managed via RxJS BehaviorSubject in `src/shared/subjects/auth.js`
- Service methods return `{ data }` on success or `{ error: string }` on failure
- Never throw exceptions from service methods
- Auth persisted in sessionStorage (not localStorage)
- All service methods are async (return Promise)

## Example

```javascript
// WRONG - throwing exceptions
login(username, password) {
  const user = findUser(username, password);
  if (!user) {
    throw new Error("Invalid credentials");
  }
  return user;
}

// WRONG - no structured response
async login(username, password) {
  const user = await api.post("/login", { username, password });
  return user;
}

// CORRECT - structured response pattern
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

        setAuth(authData);
        resolve({ data: authData });
      } else {
        resolve({ error: "Usuário ou senha inválidos" });
      }
    }, 500);
  });
}
```

## Auth Subject Pattern

```javascript
// CORRECT - BehaviorSubject with sessionStorage persistence
import { BehaviorSubject } from "rxjs";

const getStoredAuth = () => {
  const stored = sessionStorage.getItem("auth");
  const isStoredValid = stored !== null;
  if (isStoredValid) {
    return JSON.parse(stored);
  }
  return null;
};

const initialAuth = getStoredAuth();
export const authSubject = new BehaviorSubject(initialAuth);

export const setAuth = (authData) => {
  const hasAuthData = authData !== null;
  if (hasAuthData) {
    sessionStorage.setItem("auth", JSON.stringify(authData));
  } else {
    sessionStorage.removeItem("auth");
  }
  authSubject.next(authData);
};
```

## Why

- Structured responses allow consistent error handling without try/catch
- BehaviorSubject provides reactive state that components can subscribe to
- sessionStorage clears on tab close (better security than localStorage)
- Async pattern supports future real API integration without refactoring

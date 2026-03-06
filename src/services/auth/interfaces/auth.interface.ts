import type { UserRoleEnum } from "@/shared/enums/user-role.enum";

export interface LoginRequestBody {
  credential: string;
  password: string;
}

export interface RegisterRequestBody {
  name: string;
  username: string;
  password: string;
  email?: string;
  document?: string;
  documentType?: "cpf" | "rg";
  birthDate?: string;
  businessId?: string;
  role?: UserRoleEnum;
}

export interface RefreshTokenRequestBody {
  refreshToken: string;
}

export interface LoginUserResponse {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

export interface LoginResponse {
  user: LoginUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface GetAuthMeResponse {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

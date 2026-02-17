import { UserProfileEnum, type UserProfile } from "@/shared/constants/user-profile";

interface MockUser {
  username: string;
  password: string;
  profile: UserProfile;
  name: string;
}

export const mockUsers: MockUser[] = [
  {
    username: "iconsagrado",
    password: "123",
    profile: UserProfileEnum.ADMIN,
    name: "Administrador",
  },
  {
    username: "mesa01",
    password: "123",
    profile: UserProfileEnum.MESA,
    name: "Garçom Mesa 01",
  },
  {
    username: "chefecozin",
    password: "123",
    profile: UserProfileEnum.COZINHA,
    name: "Chefe de Cozinha",
  },
  {
    username: "usuarioonline",
    password: "123",
    profile: UserProfileEnum.DELIVERY,
    name: "Entregador Online",
  },
  {
    username: "atendente",
    password: "123",
    profile: UserProfileEnum.ATTENDANT,
    name: "Atendente",
  },
];

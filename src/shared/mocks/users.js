import { UserProfileEnum } from "@/shared/constants/user-profile";

export const mockUsers = [
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

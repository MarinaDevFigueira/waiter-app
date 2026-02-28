import { UserRoleEnum } from "@/shared/enums/user-role.enum";

interface MockUser {
  username: string;
  password: string;
  profile: UserRoleEnum;
  name: string;
}

export const mockUsers: MockUser[] = [
  {
    username: "iconsagrado",
    password: "123",
    profile: UserRoleEnum.OWNER,
    name: "Dono do Negócio",
  },
  {
    username: "sysadmin",
    password: "123",
    profile: UserRoleEnum.ADMIN,
    name: "Administrador do Sistema",
  },
  {
    username: "mesa01",
    password: "123",
    profile: UserRoleEnum.TABLE,
    name: "Garçom Mesa 01",
  },
  {
    username: "chefecozin",
    password: "123",
    profile: UserRoleEnum.KITCHEN,
    name: "Chefe de Cozinha",
  },
  {
    username: "usuarioonline",
    password: "123",
    profile: UserRoleEnum.CUSTOMER,
    name: "Entregador Online",
  },
  {
    username: "atendente",
    password: "123",
    profile: UserRoleEnum.ATTENDANT,
    name: "Atendente",
  },
];

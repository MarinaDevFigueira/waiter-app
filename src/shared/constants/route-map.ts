import { UserRoleEnum } from "@/shared/enums/user-role.enum";

type RouteRecord = Record<string, string>;

export const RouteMap: Record<UserRoleEnum, RouteRecord> = {
  [UserRoleEnum.TABLE]: {
    home: "/",
    foods: "/waiter/foods",
    orders: "/waiter/orders",
    newOrder: "/waiter/new-order",
  },
  [UserRoleEnum.CUSTOMER]: {
    home: "/",
    foods: "/waiter/foods",
    orders: "/waiter/orders",
    deliveries: "/waiter/deliveries",
  },
  [UserRoleEnum.OWNER]: {
    home: "/",
    dashboard: "/dashboard",
    users: "/dashboard/users",
    reports: "/dashboard/reports",
    settings: "/dashboard/settings",
    products: "/dashboard/products",
  },
  [UserRoleEnum.ATTENDANT]: {
    home: "/",
    dashboard: "/dashboard",
    reports: "/dashboard/reports",
    orders: "/dashboard/orders",
  },
  [UserRoleEnum.KITCHEN]: {
    home: "/",
    kitchen: "/kitchen",
    orders: "/kitchen/orders",
    inventory: "/kitchen/inventory",
  },
  [UserRoleEnum.ADMIN]: {
    home: "/",
    dashboard: "/dashboard",
    reports: "/dashboard/reports",
    users: "/dashboard/users",
    business: "/dashboard/business",
  },
  [UserRoleEnum.SYSTEM_MANAGER]: {
    home: "/",
    dashboard: "/dashboard",
    reports: "/dashboard/reports",
    users: "/dashboard/users",
    business: "/dashboard/business",
  },
  [UserRoleEnum.WAITER]: {
    home: "/",
    foods: "/waiter/foods",
    orders: "/waiter/orders",
    newOrder: "/waiter/new-order",
  },
};

export const getRoutesForProfile = (profile: UserRoleEnum): RouteRecord => {
  return RouteMap[profile] ?? {};
};

export const canAccessRoute = (
  profile: UserRoleEnum,
  route: string,
): boolean => {
  const routes = getRoutesForProfile(profile);
  return Object.values(routes).includes(route);
};

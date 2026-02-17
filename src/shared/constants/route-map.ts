import { UserProfileEnum, type UserProfile } from "./user-profile";

type RouteRecord = Record<string, string>;

export const RouteMap: Record<UserProfile, RouteRecord> = {
  [UserProfileEnum.MESA]: {
    home: "/",
    foods: "/waiter/foods",
    orders: "/waiter/orders",
    newOrder: "/waiter/new-order",
  },
  [UserProfileEnum.DELIVERY]: {
    home: "/",
    foods: "/waiter/foods",
    orders: "/waiter/orders",
    deliveries: "/waiter/deliveries",
  },
  [UserProfileEnum.ADMIN]: {
    home: "/",
    dashboard: "/dashboard",
    users: "/dashboard/users",
    reports: "/dashboard/reports",
    settings: "/dashboard/settings",
    products: "/dashboard/products",
  },
  [UserProfileEnum.ATTENDANT]: {
    home: "/",
    dashboard: "/dashboard",
    reports: "/dashboard/reports",
    orders: "/dashboard/orders",
  },
  [UserProfileEnum.COZINHA]: {
    home: "/",
    kitchen: "/kitchen",
    orders: "/kitchen/orders",
    inventory: "/kitchen/inventory",
  },
};

export const getRoutesForProfile = (profile: UserProfile): RouteRecord => {
  return RouteMap[profile] ?? {};
};

export const canAccessRoute = (profile: UserProfile, route: string): boolean => {
  const routes = getRoutesForProfile(profile);
  return Object.values(routes).includes(route);
};

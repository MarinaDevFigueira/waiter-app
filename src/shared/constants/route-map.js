import { UserProfileEnum } from "./user-profile";

export const RouteMap = {
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

export const getRoutesForProfile = (profile) => {
  return RouteMap[profile] || {};
};

export const canAccessRoute = (profile, route) => {
  const routes = getRoutesForProfile(profile);
  return Object.values(routes).includes(route);
};

export const OrdersViewEnum = {
  TABLE: "table",
  KITCHEN: "kitchen",
} as const;

export type OrdersView = (typeof OrdersViewEnum)[keyof typeof OrdersViewEnum];

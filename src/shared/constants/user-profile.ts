export const UserProfileEnum = Object.freeze({
  ADMIN: "Admin",
  MESA: "Mesa",
  COZINHA: "Cozinha",
  DELIVERY: "Delivery",
  ATTENDANT: "Attendant",
});

export type UserProfile = (typeof UserProfileEnum)[keyof typeof UserProfileEnum];

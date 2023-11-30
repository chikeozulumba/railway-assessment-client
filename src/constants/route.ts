export const ROUTE_AUTH = {
  AUTHORIZE: "/auth/authorize",
  PROFILE: "/auth/profile",
};

export const ROUTE_WISHLIST = {
  CREATE: "/wishlists",
  GET_WISHLISTS: "/wishlists",
  VIEW_WISHLIST: (param: string) => `/wishlists/${param}`,
};

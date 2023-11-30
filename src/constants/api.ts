export const API_AUTH = {
  AUTHORIZE: "/auth/authorize",
  PROFILE: "/auth/profile",
};

export const API_WISHLIST = {
  CREATE: "/wishlists",
  GET_WISHLISTS: "/wishlists",
  SINGLE_WISHLIST: (param?: string) => {
    if (typeof param === "undefined")
      throw new Error("Wishlist id/slug is required");
    return `/wishlists/${param}`;
  },
  UPDATE: (param?: string) => {
    if (typeof param === "undefined")
      throw new Error("Wishlist id/slug is required");
    return `/wishlists/${param}`;
  },
};

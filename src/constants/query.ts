export const Query = {
  GET_USER_PROFILE: "GET_USER_PROFILE",
  WISHLISTS: "WISHLISTS",
  SINGLE_WISHLIST: (key: string) => `WISHLISTS/${key}`,
};

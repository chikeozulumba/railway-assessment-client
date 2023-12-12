export const NAVIGATION_MENU_LINKS = ["Home", "Wishlists", "Activities"].map(
  (name: string) => {
    const key = name.toLowerCase().replaceAll(" ", "-");
    return {
      name,
      key,
      path: `/${key === "home" ? "" : key}`,
    };
  }
);

export enum NAVIGATION_LINKS_PATH {
  Home = "/",
}

export const NAVIGATION_HOME_GROUP_LINKS = {
  Recent: "Recent",
  Favorites: "Favorites",
};

export const NAVIGATION_HOME_GROUP_LINKS_PATH = [
  NAVIGATION_HOME_GROUP_LINKS.Recent,
  NAVIGATION_HOME_GROUP_LINKS.Favorites,
].map((name) => ({ name, key: name.replaceAll(" ", "-").toLowerCase() }));

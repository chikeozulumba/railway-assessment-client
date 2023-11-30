import { AuthState } from "@/@types/auth";
import { create } from "zustand";

export const authStoreInitialState = {
  loading: true,
  isLoggedInCheck: false,
  authenticated: false,
  token: undefined,
  data: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  state: authStoreInitialState,
  setAuthState: (update) =>
    set(({ state }) => ({ state: { ...state, ...update } })),
}));

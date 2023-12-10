import { create } from "zustand";
import type { AuthState } from "@/@types/auth";

export const initialState = {
  loading: false,
  isLoggedInCheck: false,
  authenticated: false,
  token: undefined,
  data: null,
};

export const authInitialState = {
  provider: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  state: initialState,
  auth: authInitialState,
  setAuthState: (update) =>
    set(({ state }) => ({ state: { ...state, ...update } })),
  setAuthModeState: (update) =>
    set(({ auth }) => ({ auth: { ...auth, ...update } })),
}));

import { AuthState } from "@/@types/auth";
import { create } from "zustand";

export const initialState = {
  loading: true,
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

import { create } from "zustand";
import type { TokenState } from "@/@types/token";

export const initialState = [];

export const useTokenStore = create<TokenState>((set) => ({
  state: initialState,
  addToken: (update) =>
    set(({ state }) => ({
      state: Array.isArray(update) ? update : [update, ...state],
    })),
}));

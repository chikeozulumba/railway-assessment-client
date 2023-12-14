export interface AuthState {
  state: {
    loading: boolean;
    isLoggedInCheck: boolean;
    authenticated: boolean;
    token: string | undefined;
    data: null | User;
  };
  auth: {
    provider: string | null;
  };
  setAuthState: (update: Partial<AuthState["state"]>) => void;
  setAuthModeState: (update: Partial<AuthState["auth"]>) => void;
}

export type RailwayToken = {
  id: string;
  name: string;
  value: string;
  isDefault?: boolean;
  createdAt: string;
};

export interface TokenState {
  state: RailwayToken[];
  addToken: (update: RailwayToken|RailwayToken[]) => void;
}

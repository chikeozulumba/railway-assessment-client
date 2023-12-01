export type User = {
  id: string;
  fullName: string;
  email: string;
  providerId: string;
  provider: string;
  avatarUrl: string | undefined;
  status: string;
  railwayAccountConnected: boolean;
  createdAt: string;
  updatedAt: string;
};

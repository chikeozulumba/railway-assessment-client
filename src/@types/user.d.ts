export type User = {
  id: string;
  fullName: string;
  email: string;
  providerId: string;
  provider: string;
  avatarUrl: string | undefined;
  status: string;
  railwayAccountStatus: string;
  activeRailwayToken: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  userId: string;
  railwayId: string;
  email: string | null;
  name: string | null;
  username: string | null;
  avatar: string | null;
  currentCost: string;
  estimatedCost: string;
  registrationStatus: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  projects?: Array<Project>;
  // _count?: ProfileCount;
}

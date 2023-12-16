import type { Profile, User } from "./user";

export type Project = {
  id: string;
  userId: string;
  profileId: string;
  tokenId: string;
  railwayProjectId: string;
  name: string | null;
  description: string | null;
  projectCreatedAt: Date | null;
  projectUpdatedAt: Date | null;
  prDeploys: boolean | null;
  prForks: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  profile?: Profile;
  services?: Array<Service>;
  //   _count?: ProjectCount;
};

export type Service = {
  id: string;
  userId: string;
  projectId: string;
  railwayServiceId: string;
  name: string | null;
  serviceCreatedAt: Date | null;
  serviceUpdatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  project?: Project;
  instances?: Array<ServiceInstance>;
  _count?: ServiceCount;
};

export type ServiceInstance = {
  id: string;
  userId: string;
  serviceId: string;
  railwayServiceInstanceId: string;
  builder: string | null;
  buildCommand: string | null;
  sourceImage: string | null;
  sourceRepo: string | null;
  sourceTemplateName: string | null;
  sourceTemplateSource: string | null;
  startCommand: string | null;
  numReplicas: string | null;
  domains: any | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  service?: Service;
};

import { gql } from "@apollo/client";

export const GET_PROFILE_AND_RAILWAY_TOKENS = gql`
  query {
    me {
      id
      uid
      fullName
      defaultRailwayToken {
        id
      }
    }

    getRailwayTokens {
      id
      name
      value
      createdAt
    }
  }
`;

export const GET_RAILWAY_TOKENS = gql`
  query {
    getRailwayTokens {
      id
      name
      value
      createdAt
    }
  }
`;

export const USER_GITHUB_REPOSITORIES = gql`
  query GetUserGithubRepositories($tokenId: String) {
    fetchUserGithubRepositories (tokenId: $tokenId) {
      id
      fullName
      defaultBranch
      isPrivate
    }
  }
`;

export const USER_GITHUB_REPOSITORY_WITH_BRANCHES = gql`
  query GetUserGithubRepositoryBranches($repo: String!, $tokenId: String) {
    fetchUserGithubRepositoryBranches(tokenId: $tokenId, repo: $repo) 
  }
`;

export const GET_RAILWAY_PROJECTS = gql`
  query {
    railwayProjects {
      id
      userId
      tokenId
      railwayProjectId
      name
      description
      projectCreatedAt
      projectUpdatedAt
      prDeploys
      prForks
      createdAt
      updatedAt

      services {
        id
        projectId
        railwayServiceId
        name
        serviceCreatedAt
        serviceUpdatedAt
        createdAt
        updatedAt
        instances {
          id
          railwayServiceInstanceId
          builder
          buildCommand
          sourceImage
          sourceRepo
          sourceTemplateName
          sourceTemplateSource
          startCommand
          numReplicas
        }
      }
    }
  }
`;

export const GET_RAILWAY_PROJECT = gql`
  query ($projectId: String!) {
    getRailwayProject(projectId: $projectId) {
      id
      userId
      tokenId
      railwayProjectId
      name
      description
      projectCreatedAt
      projectUpdatedAt
      prDeploys
      prForks
      createdAt
      updatedAt

      services {
        id
        projectId
        railwayServiceId
        name
        serviceCreatedAt
        serviceUpdatedAt
        createdAt
        updatedAt
        instances {
          id
          railwayServiceInstanceId
          builder
          buildCommand
          sourceImage
          sourceRepo
          sourceTemplateName
          sourceTemplateSource
          startCommand
          numReplicas
        }
      }
    }
  }
`;

export const GET_RAILWAY_PROJECT_DEPLOYMENTS = gql`
  query ($projectId: String!) {
    getRailwayProjectDeployments(projectId: $projectId)
  }
`;

export const GET_RAILWAY_PROJECT_DEPLOYMENT = gql`
  query ($projectId: String!) {
    getRailwayProjectDeployments(projectId: $projectId)
  }
`;

export const GET_RAILWAY_SERVICE_DEPLOYMENTS = gql`
  query ($serviceId: String!) {
    getRailwayServiceDeployments(serviceId: $serviceId)
  }
`;

export const GET_RAILWAY_DEPLOYMENT = gql`
  query ($deploymentId: String!, $tokenId: String!) {
    getDeployment(deploymentId: $deploymentId, tokenId: $tokenId)
  }
`;

export const GET_RAILWAY_DEPLOYMENT_LOGS = gql`
  query ($deploymentId: String!, $tokenId: String!, $limit: String!) {
    getDeploymentLogs(deploymentId: $deploymentId, tokenId: $tokenId, limit: $limit)
  }
`;

export const GET_RAILWAY_DEPLOYMENT_BUILD_LOGS = gql`
  query ($deploymentId: String!, $tokenId: String!, $limit: String!) {
    getDeploymentBuildLogs(deploymentId: $deploymentId, tokenId: $tokenId, limit: $limit)
  }
`;


export const GET_RAILWAY_SERVICE = gql`
  query ($serviceId: String!) {
    getRailwayService(serviceId: $serviceId)
  }
`;

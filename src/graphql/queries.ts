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

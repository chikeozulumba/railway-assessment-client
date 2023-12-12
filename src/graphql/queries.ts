import { gql } from "@apollo/client";

export const GET_PROFILE_AND_RAILWAY_TOKENS = gql`
  query {
    me {
      id
      fullName
      email
      provider
      providerId
      avatarUrl
    }

    getRailwayTokens {
      id
      name
      value
      createdAt
    }
  }
`;

export const USER_GITHUB_REPOSITORIES = gql`
  query GetUserGithubRepositories {
    fetchUserGithubRepositories {
      id
      fullName
      defaultBranch
    }
  }
`;

export const USER_GITHUB_REPOSITORY_WITH_BRANCHES = gql`
  query GetUserGithubRepositoryBranches($repoId: String!, $tokenId: String) {
    fetchUserGithubRepositoryBranches(tokenId: $tokenId, repoId: $repoId) 
  }
`;

export const GET_RAILWAY_PROJECTS = gql`
  query {
    railwayProjects {
      id
      userId
      profileId
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

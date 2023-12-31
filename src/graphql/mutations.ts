import { gql } from "@apollo/client";

export const AUTHORIZE_USER_MUTATION = gql`
  mutation Authorize($payload: AuthorizeDTO!) {
    authorize(payload: $payload) {
      id
      fullName
    }
  }
`;

export const CONNECT_RAILWAY_ACCOUNT_MUTATION = gql`
  mutation ConnectRailwayAccount($payload: ConnectRailwayAccountDTO!) {
    connectRailwayAccount(payload: $payload) {
      id
      fullName
      railwayAccountStatus
    }
  }
`;

export const DELETE_RAILWAY_PROJECT_MUTATION = gql`
  mutation DeleteRailwayProject($id: String!) {
    deleteRailwayProject(id: $id)
  }
`;

export const DELETE_RAILWAY_SERVICE_MUTATION = gql`
  mutation DeleteRailwayService($id: String!) {
    deleteRailwayService(id: $id)
  }
`;

export const CREATE_NEW_RAILWAY_PROJECT_MUTATION = gql`
  mutation CreateNewRailwayProject($payload: CreateNewRailwayProjectDTO!) {
    createNewRailwayProject(payload: $payload) {
      id
    }
  }
`;

export const CREATE_NEW_RAILWAY_SERVICE_MUTATION = gql`
  mutation CreateNewRailwayProjectService($payload: CreateNewRailwayProjectServiceDTO!) {
    createNewRailwayProjectService(payload: $payload) {
      id
    }
  }
`;

export const REMOVE_RAILWAY_TOKEN_MUTATION = gql`
  mutation RemoveRailwayToken($id: String!) {
    removeRailwayToken(id: $id) {
      status
    }
  }
`;

export const DEPLOY_GITHUB_REPO_TO_PROJECT = gql`
  mutation DeployGithubRepoToProject($projectId: String!, $repo: String!) {
    deployGithubRepo(projectId: $projectId, repo: $repo) 
  }
`;

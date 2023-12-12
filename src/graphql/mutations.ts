import { gql } from "@apollo/client";

export const AUTHORIZE_USER_MUTATION = gql`
  mutation Authorize($payload: AuthenticateDTO!) {
    authorize(payload: $payload) {
      id
      fullName
      email
      provider
      providerId
      avatarUrl
    }
  }
`;

export const CONNECT_RAILWAY_ACCOUNT_MUTATION = gql`
  mutation ConnectRailwayAccount($payload: ConnectRailwayAccountDTO!) {
    connectRailwayAccount(payload: $payload) {
      status
      id
      fullName
      email
      provider
      providerId
      avatarUrl
      railwayAccountStatus
    }
  }
`;

export const CREATE_NEW_RAILWAY_PROJECT_MUTATION = gql`
  mutation CreateNewRailwayProject($payload: CreateNewRailwayProjectDTO!) {
    createNewRailwayProject(payload: $payload) {
      id
      # userId
      # profileId
      # railwayProjectId
      # name
      # description
      # projectCreatedAt
      # projectUpdatedAt
      # prDeploys
      # prForks
      # createdAt
      # updatedAt
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

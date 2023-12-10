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

export const REMOVE_RAILWAY_TOKEN_MUTATION = gql`
  mutation RemoveRailwayToken($id: String!) {
    removeRailwayToken(id: $id) {
      status
    }
  }
`;

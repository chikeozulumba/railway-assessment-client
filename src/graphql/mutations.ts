import { gql } from "@apollo/client";

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

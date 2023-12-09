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

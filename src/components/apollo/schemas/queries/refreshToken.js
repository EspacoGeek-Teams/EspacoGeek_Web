import { gql } from "@apollo/client";

const refreshTokenMutation = gql`
  mutation RefreshToken {
    refreshToken {
      accessToken
      user {
        id
        username
        email
      }
    }
  }
`;

export default refreshTokenMutation;

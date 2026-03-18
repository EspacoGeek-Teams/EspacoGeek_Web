import { gql } from "@apollo/client";

const refreshTokenMutation = gql`
  mutation RefreshToken {
    refreshToken {
      accessToken
    }
  }
`;

export default refreshTokenMutation;

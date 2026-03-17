import { gql } from "@apollo/client";

const refreshTokenQuery = gql`
  query RefreshToken {
    refreshToken
  }
`;

export default refreshTokenQuery;

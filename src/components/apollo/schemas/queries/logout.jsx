import { gql } from "@apollo/client";

const logoutQuery = gql`
  query Logout {
    logout
  }
`;

export default logoutQuery;

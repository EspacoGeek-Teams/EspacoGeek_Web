import { gql } from "@apollo/client";

const isLoggedQuery = gql`
  query IsLogged {
    isLogged
  }
`;

export default isLoggedQuery;

import { gql } from "@apollo/client";

const meQuery = gql`
  query Me {
    me {
      id
      username
      email
      roles
    }
  }
`;

export default meQuery;

import { gql } from "@apollo/client";

const meQuery = gql`
  query Me {
    me {
      id
      email
      username
      roles
    }
  }
`;

export default meQuery;

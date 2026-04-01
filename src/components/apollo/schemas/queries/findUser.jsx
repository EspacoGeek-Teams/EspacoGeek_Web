import { gql } from '@apollo/client';

const findUserQuery = gql`
  query FindUser($username: String) {
    findUser(username: $username) {
      id
      username
    }
  }
`;

export default findUserQuery;

import { gql } from '@apollo/client';

const findUserQuery = gql`
  query FindUser($username: String) {
    findUser(username: $username) {
      id
      username
      email
      roles
      privateList
    }
  }
`;

export default findUserQuery;

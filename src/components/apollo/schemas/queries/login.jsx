import { gql } from "@apollo/client";

const loginMutation = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user {
        id
        username
        email
      }
    }
  }
`;

export default loginMutation;

import { gql } from "@apollo/client";

const loginMutation = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default loginMutation;

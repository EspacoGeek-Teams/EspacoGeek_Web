import { gql } from "@apollo/client";

const loginQuery = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export default loginQuery;

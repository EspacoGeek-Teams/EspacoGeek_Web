import { gql } from "@apollo/client";

const createUser = gql`
    mutation CreateUser($username: String!, $email: String!, $password: String!) {
        createUser(credentials: { username: $username, email: $email, password: $password })
    }
`;

export default createUser;

import { gql } from "@apollo/client";

const deleteUser = gql`
    mutation DeleteUser($password: String!) {
        deleteUser(password: $password)
    }
`;

export default deleteUser;

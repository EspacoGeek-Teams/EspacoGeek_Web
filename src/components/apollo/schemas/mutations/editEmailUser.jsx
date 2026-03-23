import { gql } from "@apollo/client";

const editEmailUser = gql`
    mutation EditEmail($newEmail: String!, $password: String!) {
        editEmail(newEmail: $newEmail, password: $password)
    }
`;

export default editEmailUser;

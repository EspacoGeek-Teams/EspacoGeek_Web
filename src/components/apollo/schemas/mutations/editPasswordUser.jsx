import { gql } from "@apollo/client";

const editPasswordUser = gql`
    mutation EditPassword($actualPassword: String, $newPassword: String) {
        editPassword(actualPassword: $actualPassword, newPassword: $newPassword)
    }
`;

export default editPasswordUser;

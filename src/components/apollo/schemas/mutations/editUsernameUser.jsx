import { gql } from "@apollo/client";

const editUsernameUser = gql`
    mutation EditUsername($newUsername: String!) {
        editUsername(newUsername: $newUsername)
    }
`;

export default editUsernameUser;

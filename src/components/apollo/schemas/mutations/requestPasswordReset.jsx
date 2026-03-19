import { gql } from "@apollo/client";

const requestPasswordReset = gql`
    mutation RequestPasswordReset($email: String!) {
        requestPasswordReset(email: $email)
    }
`;

export default requestPasswordReset;

import { gql } from "@apollo/client";

const verifyEmail = gql`
    mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token)
    }
`;

export default verifyEmail;

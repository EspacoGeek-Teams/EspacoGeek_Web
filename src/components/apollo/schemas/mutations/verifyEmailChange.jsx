import { gql } from "@apollo/client";

const verifyEmailChange = gql`
    mutation VerifyEmailChange($token: String!) {
        verifyEmailChange(token: $token)
    }
`;

export default verifyEmailChange;

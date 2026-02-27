```jsx
import { gql } from "@apollo/client";

const resetPassword = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
        resetPassword(token: $token, newPassword: $newPassword)
    }
`;

export default resetPassword;

```

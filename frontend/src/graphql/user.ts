import { gql } from "@apollo/client";

export const ME = gql`
query Me {
    me { id name email }
}
`;

export const UPDATE_PROFILE = gql`
mutation UpdateProfile($name: String!) {
    updateProfile(name: $name) { id name email }
}
`;

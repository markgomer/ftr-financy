import { gql } from "@apollo/client";

export type Category = {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    color: string;
};

export const CATEGORIES = gql`
  query Categories {
    categories { id name description icon color }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory(
    $name: String!
    $description: String
    $icon: String
    $color: String
  ) {
    createCategory(name: $name, description: $description, icon: $icon, color: $color) {
      id name description icon color
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory(
    $id: ID!
    $name: String
    $description: String
    $icon: String
    $color: String
  ) {
    updateCategory(id: $id, name: $name, description: $description, icon: $icon, color: $color) {
      id name description icon color
    }
  }
`;

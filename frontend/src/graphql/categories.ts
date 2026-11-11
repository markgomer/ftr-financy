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

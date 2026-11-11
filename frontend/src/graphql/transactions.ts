import { gql } from "@apollo/client";
import type { Category } from "./categories";

export type Transaction = {
    id: string;
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: string;
    category: Category | null;
};

export const TRANSACTIONS = gql`
  query Transactions {
    transactions {
      id description amount type date
      category { id name description icon color }
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id description amount type date
      category { id name description icon color }
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      id description amount type date
      category { id name description icon color }
    }
  }
`;

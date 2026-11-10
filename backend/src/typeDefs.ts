export const typeDefs = /* GraphQL */ `
type User {
    id: ID!
    name: String!
    email: String!
}

type AuthPayload {
    token: String!
    user: User!
}

type Query {
    me: User!
    health: String!
    categories: [Category!]!
    transactions: [Transaction!]!
}

type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createCategory(name: String!): Category!
    updateCategory(id: ID!, name: String!): Category!
    deleteCategory(id: ID!): Boolean!
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
}

type Category {
    id: ID!
    name: String!
}

enum TransactionType {
    INCOME
    EXPENSE
}

type Transaction {
    id: ID!
    description: String!
    amount: Float!
    type: TransactionType!
    date: String!
    category: Category
}

input CreateTransactionInput {
    description: String!
    amount: Float!
    type: TransactionType!
    date: String
    categoryId: ID
}

input UpdateTransactionInput {
    description: String
    amount: Float
    type: TransactionType
    date: String
    categoryId: ID
}
`;

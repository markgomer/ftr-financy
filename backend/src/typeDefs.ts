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
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createCategory(name: String!): Category!
    updateCategory(id: ID!, name: String!): Category!
    deleteCategory(id: ID!): Boolean!
  }

  type Category {
    id: ID!
    name: String!
  }
`;

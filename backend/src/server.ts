import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import gql from "graphql-tag";

const typeDefs = gql`
  type Query {
    health: String!
  }
`;

const resolvers = {
  Query: { health: () => "ok" },
};

async function main() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(cors());
  app.use(express.json());
  app.use("/graphql", expressMiddleware(server));

  const port = Number(process.env.PORT) || 4000;
  app.listen(port, () => console.log(`http://localhost:${port}/graphql`));
}

main();

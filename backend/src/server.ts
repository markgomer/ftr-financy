import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { getContext, type Context } from "./context";


async function main() {
    const app = express();
    const server = new ApolloServer<Context>({ typeDefs, resolvers });
    await server.start();

    app.use(cors());
    app.use(express.json());
    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: async ({ req }) => getContext(req.headers.authorization),
        })
    );

    const port = Number(process.env.PORT) || 4000;
    app.listen(port, () => console.log(`http://localhost:${port}/graphql`));
}

main();

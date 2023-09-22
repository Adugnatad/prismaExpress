import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "../graphql/schema";
import cors from "cors";
import { ApolloServer } from "@apollo/server";

const apolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    status400ForVariableCoercionErrors: true,
    formatError: (formattedError, error) => {
      return {
        message: formattedError.message,
      };
    },
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at ${url}`);
};

const apollo = apolloServer();

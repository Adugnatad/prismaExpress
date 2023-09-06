import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.ts";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resolvers = {
  Product: {
    products() {
      return prisma.product.findMany();
    },
    product(_: any, args: any) {
      return prisma.product.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },
  Mutation: {
    addProduct(_: any, args: any) {
      let product = {
        ...args.product,
      };
      const createdProduct = prisma.product.create({
        data: product,
      });
      return createdProduct;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const {
  url,
} = async () =>
  await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

console.log(`Server ready at: ${url}`);

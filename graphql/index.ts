import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    products() {
      return prisma.product.findMany();
    },
    product(_: any, args: any) {
      return prisma.product.findUnique({
        where: {
          id: parseInt(args.id),
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

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(() => {
  console.log("Server listening at port 4000");
});

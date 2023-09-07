"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const schema_1 = require("./schema");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const resolvers = {
    Query: {
        products() {
            return prisma.product.findMany();
        },
        product(_, args) {
            return prisma.product.findUnique({
                where: {
                    id: parseInt(args.id),
                },
            });
        },
    },
    Mutation: {
        addProduct(_, args) {
            let product = Object.assign({}, args.product);
            const createdProduct = prisma.product.create({
                data: product,
            });
            return createdProduct;
        },
    },
};
const server = new server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers,
});
(0, standalone_1.startStandaloneServer)(server, {
    listen: { port: 4000 },
}).then(() => {
    console.log("Server listening at port 4000");
});

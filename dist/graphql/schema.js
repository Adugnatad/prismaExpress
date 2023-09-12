"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.typeDefs = `#graphql
  type Query {
    products: [Product]
    product(id: ID!): Product
  }
  type Product {
    id: ID!
    name: String!
    price: Int!
    available_quantity: Int!
    picture: String
    order: [Order!]
  }
  type Order {
    id: ID!
    order_amount: ID!
    product_id: ID!
    product: Product!
  }
  type Mutation {
    addProduct(product: AddProductInput!): Product
  }
  input AddProductInput {
    name: String!
    price: Int!
    available_quantity: Int!
    picture: String
  }

`;
exports.resolvers = {
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
//# sourceMappingURL=schema.js.map
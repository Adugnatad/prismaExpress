import { PrismaClient } from "@prisma/client";
import { checkHash } from "../config.ts/hash";
import jwt from "jsonwebtoken";
import { secret_key } from "../util/secrets";

const prisma = new PrismaClient();

const generateToken = (username: string) => {
  const payload = {
    username: username,
  };
  const token = jwt.sign(payload, secret_key, { expiresIn: "1h" });
  return token;
};

export const typeDefs = `#graphql
  type Query {
    products: [Product]
    product(id: ID!): Product
  }
  type User {
    id: ID!
    username: String!
    password: String!
    passwordResetToken: String
    profileId: Int!
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
    login(user: UserInfo!): String
  }
  input AddProductInput {
    name: String!
    price: Int!
    available_quantity: Int!
    picture: String
  }
  input UserInfo {
    username: String!
    password: String!
  }
`;

export const resolvers = {
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
    async login(_: any, args: any) {
      console.log(args);
      const user = await prisma.user.findUnique({
        where: {
          username: args.user.username,
        },
      });
      if (user) {
        const passwordCheck = checkHash(args.user.password, user.password);
        if (passwordCheck) {
          const token = generateToken(user.username);
          return token;
        } else {
          return "Invalid credentials";
        }
      } else {
        return "user not found";
      }
    },
  },
};

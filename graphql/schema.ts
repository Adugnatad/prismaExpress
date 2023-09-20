import { PrismaClient } from "@prisma/client";
import { checkHash, hash } from "../config.ts/hash";
import jwt from "jsonwebtoken";
import { secret_key } from "../util/secrets";
import { GraphQLError } from "graphql";

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
  enum Gender {
    MALE,
    FEMALE,
  }
  type Mutation {
    addProduct(product: AddProductInput!): Product
    login(user: UserInfo!): String
    signup(user: SignupInfo!): User
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
  input SignupInfo {
    username: String!
    password: String!
    FullName: String!
    gender: Gender!
    location: String!
    website: String!
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
        throw new GraphQLError("Your custom message here...", {
          extensions: { code: "FORBIDDEN" },
        });
      }
    },
    async signup(_: any, args: any) {
      const hashedPassword = await hash(args.user.password);
      if (hashedPassword) {
        const u = await prisma.user.findUnique({
          where: {
            username: args.user.username,
          },
        });
        if (u) {
          return "User already exists";
        } else {
          const user = await prisma.user
            .create({
              data: {
                username: args.user.username,
                password: args.user.password,
                profile: {
                  create: {
                    name: args.user.fullName,
                    gender: args.user.gender,
                    location: args.user.location,
                    website: args.user.website,
                  },
                },
              },
            })
            .then((user) => {
              return user;
            })
            .catch((err) => {
              return err.message;
            });
        }
      }
    },
  },
};

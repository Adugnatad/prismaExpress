"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
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

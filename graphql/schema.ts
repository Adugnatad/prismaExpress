export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Int!
    available_quantity: Int!
    picture: String!
    order: [Order!]
  }
  type Order {
    id: ID!
    order_amount: ID!
    product_id: ID!
    product: Product!
  }

`;

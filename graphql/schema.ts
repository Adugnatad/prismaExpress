import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import { PrismaClient } from "@prisma/client";
import * as productController from "../controllers/product";

const prisma = new PrismaClient();

const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "This is type for Product model",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLInt) },
    available_quantity: { type: GraphQLNonNull(GraphQLInt) },
    picture: { type: GraphQLString },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    product: {
      type: new GraphQLList(ProductType),
      description: "All Products",
      resolve: productController.getProductsGraph,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addProduct: {
      type: ProductType,
      description: "Add a Product",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLNonNull(GraphQLInt) },
        available_quantity: { type: GraphQLNonNull(GraphQLInt) },
        picture: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        productController.postProductGraph(
          args.name,
          args.price,
          args.available_quantity,
          args.picture
        ),
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

export default schema;

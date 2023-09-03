import express from "express";
import * as userController from "../controllers/user";
import * as productController from "../controllers/product";
import * as orderController from "../controllers/order";
import { verifyToken } from "../config.ts/jwtToken";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} from "graphql";
import { Prisma, PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "This is type for Product model",
  fields: () => ({
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
    available_quantity: { type: GraphQLInt },
    picture: { type: GraphQLString },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    product: {
      type: ProductType,
      description: "All Products",
      resolve: async (parent, args) => {
        const product = await prisma.product.findMany();
        return product;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use(express.json());

app.post("/signup", userController.signup);

app.post("/login", userController.login);

app.get("/test", verifyToken, (req, res) => {
  res.send("protected route");
});

app.post("/product", verifyToken, productController.postProduct);
app.get("/product", verifyToken, productController.getProducts);

app.get("/product/:id", verifyToken, productController.getProductId);

app.post("/order", verifyToken, orderController.postOrder);
app.get("/order", verifyToken, orderController.getOrders);
app.get("/order/:id", verifyToken, orderController.getOrderId);
app.delete("/order/:id", verifyToken, orderController.deleteOrderId);
app.put("/order/:id", verifyToken, orderController.updateOrderId);

app.use((req, res) => {
  res.status(405).send();
});

const server = app.listen(3000, () => {
  console.log(`
    🚀 Server ready at: http://localhost:3000`);
});

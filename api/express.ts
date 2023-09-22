import express from "express";
import * as userController from "../controllers/user";
import * as productController from "../controllers/product";
import * as orderController from "../controllers/order";
import { verifyToken } from "../config.ts/jwtToken";
import { CorsOptions } from "cors";
import cors from "cors";

const server = async () => {
  const app = express();
  app.use(express.json());

  var corsOptions: CorsOptions = {
    origin: "http://www.google.com",
    optionsSuccessStatus: 200,
  };

  app.get("/", cors(), (req, res) => {
    res.send("api live");
  });

  app.post("/signup", userController.signup);

  app.post("/login", userController.login);

  app.get("/test", verifyToken, (req, res) => {
    res.send("protected route");
  });

  app.post("/product", verifyToken, productController.postProduct);
  app.get("/product", verifyToken, productController.getProducts);
  app.get("/product/:id", verifyToken, productController.getProductId);
  app.delete("/product/:id", verifyToken, productController.deleteProduct);

  app.post("/order", verifyToken, orderController.postOrder);
  app.get("/order", verifyToken, orderController.getOrders);
  app.get("/order/:id", verifyToken, orderController.getOrderId);
  app.delete("/order/:id", verifyToken, orderController.deleteOrderId);
  app.put("/order/:id", verifyToken, orderController.updateOrderId);

  app.use((req, res) => {
    res.status(405).send();
  });

  app.listen(3000, () => {
    console.log(`
    🚀 Server ready at: http://localhost:3000`);
  });

  return app;
};

const app = server();

export default app;

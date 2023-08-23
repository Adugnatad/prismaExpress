import express from "express";
import * as userController from "../controllers/user";
const app = express();

app.use(express.json());

app.post("/signup", userController.signup);

app.post("/login", userController.login);

const server = app.listen(3000, () => {
  console.log(`
    🚀 Server ready at: http://localhost:3000`);
});

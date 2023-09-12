"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = __importStar(require("../controllers/user"));
const productController = __importStar(require("../controllers/product"));
const orderController = __importStar(require("../controllers/order"));
const jwtToken_1 = require("../config.ts/jwtToken");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const http_1 = __importDefault(require("http"));
const schema_1 = require("../graphql/schema");
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: schema_1.resolvers,
    introspection: true,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
});
server
    .start()
    .then(() => app.use("/graphql", (0, cors_1.default)(), (0, express4_1.expressMiddleware)(server)));
// await new Promise<void>((resolve) =>
//   httpServer.listen({ port: 4000 }, resolve)
// );
// console.log(`🚀 Server ready at http://localhost:4000/`);
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });
// console.log(`Server ready at ${url}`);
app.post("/signup", userController.signup);
app.post("/login", userController.login);
app.get("/test", jwtToken_1.verifyToken, (req, res) => {
    res.send("protected route");
});
app.post("/product", jwtToken_1.verifyToken, productController.postProduct);
app.get("/product", jwtToken_1.verifyToken, productController.getProducts);
app.get("/product/:id", jwtToken_1.verifyToken, productController.getProductId);
app.delete("/product/:id", jwtToken_1.verifyToken, productController.deleteProduct);
app.post("/order", jwtToken_1.verifyToken, orderController.postOrder);
app.get("/order", jwtToken_1.verifyToken, orderController.getOrders);
app.get("/order/:id", jwtToken_1.verifyToken, orderController.getOrderId);
app.delete("/order/:id", jwtToken_1.verifyToken, orderController.deleteOrderId);
app.put("/order/:id", jwtToken_1.verifyToken, orderController.updateOrderId);
app.use((req, res) => {
    res.status(405).send();
});
app.listen(3000, () => {
    console.log(`
    🚀 Server ready at: http://localhost:3000`);
});
exports.default = app;
//# sourceMappingURL=index.js.map
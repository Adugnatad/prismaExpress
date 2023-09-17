"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
exports.typeDefs = "#graphql\n  type Query {\n    products: [Product]\n    product(id: ID!): Product\n  }\n  type Product {\n    id: ID!\n    name: String!\n    price: Int!\n    available_quantity: Int!\n    picture: String\n    order: [Order!]\n  }\n  type Order {\n    id: ID!\n    order_amount: ID!\n    product_id: ID!\n    product: Product!\n  }\n  type Mutation {\n    addProduct(product: AddProductInput!): Product\n  }\n  input AddProductInput {\n    name: String!\n    price: Int!\n    available_quantity: Int!\n    picture: String\n  }\n\n";
exports.resolvers = {
    Query: {
        products: function () {
            return prisma.product.findMany();
        },
        product: function (_, args) {
            return prisma.product.findUnique({
                where: {
                    id: parseInt(args.id),
                },
            });
        },
    },
    Mutation: {
        addProduct: function (_, args) {
            var product = __assign({}, args.product);
            var createdProduct = prisma.product.create({
                data: product,
            });
            return createdProduct;
        },
    },
};
//# sourceMappingURL=schema.js.map
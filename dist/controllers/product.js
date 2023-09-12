"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProductId = exports.getProductsGraph = exports.getProducts = exports.postProductGraph = exports.postProduct = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const postProduct = async (req, res) => {
    const { name, price, available_quantity, picture } = req.body;
    await (0, express_validator_1.check)("price", "price must be greater than 0")
        .isInt({ min: 1 })
        .run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(403).send(errors);
    }
    const p = await prisma.product.findUnique({
        where: {
            name,
        },
    });
    if (p) {
        return res.status(403).send("product name already exists");
    }
    const product = await prisma.product
        .create({
        data: {
            name,
            price: parseInt(price),
            available_quantity: parseInt(available_quantity),
            picture,
        },
    })
        .then((product) => {
        res.status(200).json({ product });
    })
        .catch((err) => {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                res.status(403).send("Invalid request. Unique Constraint failed");
            }
            else {
                res.status(403).json(err.message);
            }
        }
        else {
            res.status(500).send();
        }
    });
};
exports.postProduct = postProduct;
const postProductGraph = async (name, price, available_quantity, picture) => {
    const p = await prisma.product.findUnique({
        where: {
            name,
        },
    });
    if (p) {
        throw new Error("Product with the same name already exists.");
    }
    const product = await prisma.product
        .create({
        data: {
            name,
            price,
            available_quantity,
            picture,
        },
    })
        .then((product) => {
        console.log(product);
        return product;
    })
        .catch((err) => {
        throw new Error(`Failed to add product: ${err.message}`);
    });
};
exports.postProductGraph = postProductGraph;
const getProducts = async (req, res) => {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
};
exports.getProducts = getProducts;
const getProductsGraph = async () => {
    const products = await prisma.product.findMany();
    return products;
};
exports.getProductsGraph = getProductsGraph;
const getProductId = async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    res.status(200).json(product);
};
exports.getProductId = getProductId;
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    await prisma.product
        .findUnique({
        where: {
            id: parseInt(id),
        },
    })
        .then(async (product) => {
        if (product) {
            await prisma.product.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).send("Product deleted successfully");
        }
        else {
            res.status(403).json({ Error: "No product by that id found" });
        }
    });
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.js.map
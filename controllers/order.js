"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderId = exports.deleteOrderId = exports.getOrderId = exports.getOrders = exports.postOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const postOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, order_amount } = req.body;
    const order = yield prisma.order
        .create({
        data: {
            product_id,
            order_amount,
        },
    })
        .then((order) => {
        res.status(200).json({ order });
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
});
exports.postOrder = postOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield prisma.order.findMany();
    res.status(200).json(orders);
});
exports.getOrders = getOrders;
const getOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield prisma.order.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    res.status(200).json(order);
});
exports.getOrderId = getOrderId;
const deleteOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.order
        .findUnique({
        where: {
            id: parseInt(id),
        },
    })
        .then((order) => __awaiter(void 0, void 0, void 0, function* () {
        if (order) {
            yield prisma.order.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json("order deleted");
        }
        else {
            res.status(403).json({ Error: "No order by that id found" });
        }
    }));
});
exports.deleteOrderId = deleteOrderId;
const updateOrderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { order_amount } = req.body;
    const order = yield prisma.order.update({
        where: {
            id: parseInt(id),
        },
        data: {
            order_amount,
        },
    });
    res.status(200).json("order updated");
});
exports.updateOrderId = updateOrderId;

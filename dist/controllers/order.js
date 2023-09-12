"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderId = exports.deleteOrderId = exports.getOrderId = exports.getOrders = exports.postOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const postOrder = async (req, res) => {
    const { product_id, order_amount } = req.body;
    const order = await prisma.order
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
};
exports.postOrder = postOrder;
const getOrders = async (req, res) => {
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
};
exports.getOrders = getOrders;
const getOrderId = async (req, res) => {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    res.status(200).json(order);
};
exports.getOrderId = getOrderId;
const deleteOrderId = async (req, res) => {
    const { id } = req.params;
    await prisma.order
        .findUnique({
        where: {
            id: parseInt(id),
        },
    })
        .then(async (order) => {
        if (order) {
            await prisma.order.delete({
                where: {
                    id: parseInt(id),
                },
            });
            res.status(200).json("order deleted");
        }
        else {
            res.status(403).json({ Error: "No order by that id found" });
        }
    });
};
exports.deleteOrderId = deleteOrderId;
const updateOrderId = async (req, res) => {
    const { id } = req.params;
    const { order_amount } = req.body;
    const order = await prisma.order.update({
        where: {
            id: parseInt(id),
        },
        data: {
            order_amount,
        },
    });
    res.status(200).json("order updated");
};
exports.updateOrderId = updateOrderId;
//# sourceMappingURL=order.js.map
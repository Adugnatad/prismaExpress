import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const postOrder = async (req: Request, res: Response) => {
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
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          res.status(403).send("Invalid request. Unique Constraint failed");
        } else {
          res.status(403).json(err.message);
        }
      } else {
        res.status(500).send();
      }
    });
};

export const getOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany();
  res.status(200).json(orders);
};

export const getOrderId = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json(order);
};

export const deleteOrderId = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await prisma.order.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json("order deleted");
};

export const updateOrderId = async (req: Request, res: Response) => {
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

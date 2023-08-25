import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const postProduct = async (req: Request, res: Response) => {
  const { name, price, available_quantity, picture } = req.body;
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
      res.status(200).json({ product });
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

export const getProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.status(200).json(products);
};

export const getProductId = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.status(200).json(product);
};

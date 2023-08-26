import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { body, check, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const postProduct = async (req: Request, res: Response) => {
  const { name, price, available_quantity, picture } = req.body;

  await check("price", "price must be greater than 0")
    .isInt({ min: 1 })
    .run(req);

  const errors = validationResult(req);

  const p = await prisma.product.findUnique({
    where: {
      name,
    },
  });

  if (p) {
    return res.status(403).send("product name already exists");
  }

  if (!errors.isEmpty()) {
    return res.status(403).send(errors);
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

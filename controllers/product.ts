import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";

const prisma = new PrismaClient();

export const postProduct = async (req: Request, res: Response) => {
  const { name, price, available_quantity, picture } = req.body;

  await check("price", "price must be greater than 0")
    .isInt({ min: 1 })
    .run(req);

  const errors = validationResult(req);

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

export const postProductGraph = async (
  name: string,
  price: number,
  available_quantity: number,
  picture: string
) => {
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

export const getProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  res.status(200).json(products);
};

export const getProductsGraph = async () => {
  const products = await prisma.product.findMany();
  return products;
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

export const deleteProduct = async (req: Request, res: Response) => {
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
      } else {
        res.status(403).json({ Error: "No product by that id found" });
      }
    });
};

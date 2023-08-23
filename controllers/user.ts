import { Prisma, PrismaClient } from "@prisma/client";
import { hash, checkHash } from "../config.ts/hash";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { username, password, Full_Name, gender, location, website } = req.body;
  const hashedPassword = await hash(password);
  if (hashedPassword) {
    const user = await prisma.user
      .create({
        data: {
          username: username,
          password: hashedPassword,
          profile: {
            create: {
              name: Full_Name,
              gender,
              location,
              website,
            },
          },
        },
      })
      .then((user) => {
        res.json({
          id: user.id,
          username: user.username,
          profile: user.profileId,
        });
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(403).json({ message: "Bad Request" });
        } else {
          res.status(500).send();
        }
      });
  } else {
    res.status(500).send("password hash failed");
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) {
    const passwordCheck = checkHash(password, user.password);
    if (passwordCheck) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } else {
    res.status(400).send("user not found!");
  }
};

import { Prisma, PrismaClient } from "@prisma/client";
import { hash, checkHash } from "../config.ts/hash.ts";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { secret_key } from "../util/secrets.ts";
import { check, validationResult } from "express-validator";

const prisma = new PrismaClient();

const generateToken = (username: string) => {
  const payload = {
    username: username,
  };
  const token = jwt.sign(payload, secret_key, { expiresIn: "1h" });
  return token;
};

export const signup = async (req: Request, res: Response) => {
  const { username, password, Full_Name, gender, location, website } = req.body;

  await check("gender", "gender can be either MALE or FEMALE")
    .isIn(["MALE", "FEMALE"])
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(403).send(errors);
  }

  const hashedPassword = await hash(password);
  if (hashedPassword) {
    const u = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (u) {
      res.status(403).send("Username already exists");
    } else {
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
            if (err.code === "P2002") {
              res.status(403).send("Invalid request. Unique Constraint failed");
            } else {
              res.status(403).json(err.message);
            }
          } else {
            res.status(500).send(err);
          }
        });
    }
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
      const token = generateToken(user.username);
      res.status(200).json({ token });
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } else {
    res.status(400).send("user not found!");
  }
};

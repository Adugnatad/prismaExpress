import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { username, password, Full_Name, gender, location, website } = req.body;

  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
      profile: {
        create: {
          name: Full_Name,
          gender,
          location,
          website,
        },
      },
    },
  });
  res.json(user);
});

const server = app.listen(3000, () => {
  console.log(`
    🚀 Server ready at: http://localhost:3000`);
});
